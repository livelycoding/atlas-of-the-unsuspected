#!/bin/bash
#
# Fetches wiki pages from the Cultist Simulator fandom wiki (MediaWiki API)
# and caches them locally as .md files containing raw wikitext markup.
#
# The cached files are used as a reference when manually updating
# src/data/locations.ts with game data. They are NOT consumed at build time.
#
# Idempotent: skips pages whose cache file already exists.
# To re-fetch a page, delete its file from wiki-cache/ first.
#
# Usage: ./fetch-wiki.sh          # fetch only missing pages
#        ./fetch-wiki.sh --force   # re-fetch all pages

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CACHE_DIR="$SCRIPT_DIR/wiki-cache"
mkdir -p "$CACHE_DIR"

FORCE=false
if [ "$1" = "--force" ]; then
  FORCE=true
fi

# All pages: "WikiPageName|local-filename"
# Page names must match the wiki URL (spaces as underscores, special chars URL-encoded).
PAGES=(
  # --- Location pages ---
  "London|london"
  "Amsterdam|amsterdam"
  "Rostock|rostock"
  "Paris|paris"
  "Rhenish_Aachen|rhenish-aachen"
  "Prague|prague"
  "Kaunas|kaunas"
  "Leningrad|leningrad"
  "Nizhny_Novgorod|nizhny-novgorod"
  "Strasbourg|strasbourg"
  "Munich|munich"
  "Vienna|vienna"
  "Krak%C3%B3w|krakow"
  "Kiev|kiev"
  "Stalingrad|stalingrad"
  "Sverdlovsk|sverdlovsk"
  "Granada|granada"
  "Avignon|avignon"
  "Venice|venice"
  "Budapest|budapest"
  "Cluj-Napoca|cluj-napoca"
  "Tiflis|tiflis"
  "Samarkand|samarkand"
  "Marrakech|marrakech"
  "Algiers|algiers"
  "Valletta|valletta"
  "Tirana|tirana"
  "Istanbul|istanbul"
  "Baghdad|baghdad"
  "Meshad|meshad"
  "Tripoli|tripoli"
  "Candia-Heraklion|candia-heraklion"
  "Alexandria|alexandria"

  # --- Map's Edge locations ---
  "Sunshine_Island|sunshine-island"
  "Fogfire_Point|fogfire-point"
  "Wounded_Moon_Lake|wounded-moon-lake"
  "Priory_of_Captains|priory-of-captains"
  "The_Tiger%27s_Nest|tigers-nest"
  "The_Pentapolis|pentapolis"
  "Hermitage_of_the_Scythe|hermitage-of-the-scythe"

  # --- Caper (vault) pages ---
  "The_Merry_Feaster%27s_Lair|the-merry-feasters-lair"
  "Skyrius_T|skyrius-t"
  "Corpshaus_Mamurra_M%C3%BCnchen|corpshaus-mamurra-munchen"
  "Knotwingknot_Nest|knotwingknot-nest"
  "Duende_Midnight|duende-midnight"
  "Chateau_Tarascon|chateau-tarascon"
  "Palazzo_Dario|palazzo-dario"
  "Yeshiva_Tigris|yeshiva-tigris"
  "Church_of_St_Marzanna_the_White|church-of-st-marzanna"
  "Althiban_Abyss|althiban-abyss"
  "The_Invisible_Serapeum|the-invisible-serapeum"

  # --- Opportunity pages: Connections & Licenses ---
  "Opportunity:_An_Official_Connection%3F|op-official-connection"
  "Opportunity:_An_Underworld_Connection%3F|op-underworld-connection"
  "Opportunity:_A_Connection_with_Radicals%3F|op-connection-radicals"
  "Opportunity:_a_Connection_with_a_Ruler%3F|op-connection-ruler"
  "Opportunity:_A_Connection_with_a_Holy_Man%3F|op-connection-holy-man"
  "Opportunity:_Import_Licence%3F|op-import-licence"
  "Opportunity:_Medical_Credentials%3F|op-medical-credentials"

  # --- Opportunity pages: Property ---
  "Opportunity:_Discreet_Office%3F|op-discreet-office"
  "Opportunity:_Quiet_Warehouse%3F|op-quiet-warehouse"
  "Opportunity:_Grand_Townhouse%3F|op-grand-townhouse"
  "Opportunity:_Secluded_Villa%3F|op-secluded-villa"

  # --- Opportunity pages: Items ---
  "Opportunity:_Purchase_a_Profane_Weapon%3F|op-profane-weapon"
  "Opportunity:_Purchase_a_Mutilated_Manuscript%3F|op-mutilated-manuscript"
  "Opportunity:_Purchase_an_Unusual_Weapon%3F|op-unusual-weapon"
  "Opportunity:_Purchase_Art_about_Yearning%3F|op-art-yearning"
  "Opportunity:_Purchase_a_Case_of_Extraordinary_Wine%3F|op-extraordinary-wine"
  "Opportunity:_Purchase_a_Menacing_Icon%3F|op-menacing-icon"
  "Opportunity:_Purchase_a_Dangerous_Substance%3F|op-dangerous-substance"
  "Opportunity:_Purchase_an_Unsettling_Doll%3F|op-unsettling-doll"
  "Opportunity:_Purchase_a_Crudely_Carved_Image%3F|op-crudely-carved-image"
  "Opportunity:_Purchase_the_%27Drinker%27s_Knife%27%3F|op-drinkers-knife"
  "Opportunity:_Purchase_an_Atlas_of_the_Unsuspected%3F|op-atlas-unsuspected"
  "Opportunity:_Purchase_an_Odd_Little_Bone%3F|op-odd-little-bone"
  "Opportunity:_Purchase_Red_Temptation%3F|op-red-temptation"
  "Opportunity:_Purchase_an_Antique_Guitar%3F|op-antique-guitar"
  "Opportunity:_Purchase_Art_about_Finality%3F|op-art-finality"

  # --- Opportunity pages: Times ---
  "Dawn|op-dawn"
  "Sunset|op-sunset"
  "Night|op-night"

  # --- Opportunity pages: Distractions ---
  "Freezing_Winds|op-freezing-winds"
  "The_Sea|op-the-sea"
  "Sulochana_Amavasya|op-sulochana-amavasya"
  "Mme_Matutine|op-mme-matutine"
  "Heights|op-heights"
  "The_Flowermaker%27s_Shadow|op-flowermakers-shadow"
  "Faith|op-faith"
  "The_Wolf_Divided%27s_Shadow|op-wolf-divideds-shadow"
  "Cats|op-cats"
  "Trembling_Heat|op-trembling-heat"
  "What-Is-Not-Seen|op-what-is-not-seen"
  "Echidna|op-echidna"

  # --- Item pages (Pentiments & Rewards) ---
  "Stained_Gloves_(Exile)|item-stained-gloves"
  "My_Unhealing_Wound|item-my-unhealing-wound"
  "Labhitic_Memento|item-labhitic-memento"
  "Sun-Kissed_Stone|item-sun-kissed-stone"
  "Kirqa-Caul|item-kirqa-caul"
  "Half-Smoked_Cigarette|item-half-smoked-cigarette"
  "Stranger%27s_Water|item-strangers-water"
  "Curio:_Fl%C3%BBte_Matutine|item-flute-matutine"

  # --- Other reference pages ---
  "Weapon|weapons"
)

TOTAL=${#PAGES[@]}
COUNT=0
SKIPPED=0
FETCHED=0

for entry in "${PAGES[@]}"; do
  IFS='|' read -r page filename <<< "$entry"
  COUNT=$((COUNT + 1))

  TARGET="$CACHE_DIR/$filename.md"

  # Skip if file already exists and is non-empty (unless --force)
  if [ "$FORCE" = false ] && [ -s "$TARGET" ]; then
    echo "[$COUNT/$TOTAL] Skipping $page (cached)"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  echo "[$COUNT/$TOTAL] Fetching $page..."

  curl -s "https://cultistsimulator.fandom.com/api.php?action=parse&page=$page&format=json&prop=wikitext" \
    -H "User-Agent: Mozilla/5.0" \
    | python -c "import sys,json; d=json.load(sys.stdin); print(d['parse']['wikitext']['*'])" \
    > "$TARGET" 2>/dev/null

  SIZE=$(wc -c < "$TARGET")
  echo "  -> saved $filename.md (${SIZE} bytes)"
  FETCHED=$((FETCHED + 1))

  # Be polite: sleep 4-8 seconds between requests
  if [ $COUNT -lt $TOTAL ]; then
    DELAY=$((4 + RANDOM % 5))
    echo "  -> sleeping ${DELAY}s..."
    sleep $DELAY
  fi
done

echo ""
echo "Done! Fetched $FETCHED, skipped $SKIPPED (cached), $TOTAL total."
