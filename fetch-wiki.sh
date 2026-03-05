#!/bin/bash
#
# Fetches wiki pages from the Cultist Simulator fandom wiki (MediaWiki API)
# and caches them locally as .md files containing raw wikitext markup.
#
# The cached files are used as a reference when manually updating
# src/data/locations.ts with game data. They are NOT consumed at build time.
#
# Usage: ./fetch-wiki.sh
# Note: Takes ~5-6 minutes due to polite rate-limiting (4-8s between requests).

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CACHE_DIR="$SCRIPT_DIR/wiki-cache"
mkdir -p "$CACHE_DIR"

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

  # --- Other reference pages ---
  "Weapon|weapons"
)

TOTAL=${#PAGES[@]}
COUNT=0

for entry in "${PAGES[@]}"; do
  IFS='|' read -r page filename <<< "$entry"
  COUNT=$((COUNT + 1))

  echo "[$COUNT/$TOTAL] Fetching $page..."

  curl -s "https://cultistsimulator.fandom.com/api.php?action=parse&page=$page&format=json&prop=wikitext" \
    -H "User-Agent: Mozilla/5.0" \
    | python -c "import sys,json; d=json.load(sys.stdin); print(d['parse']['wikitext']['*'])" \
    > "$CACHE_DIR/$filename.md" 2>/dev/null

  SIZE=$(wc -c < "$CACHE_DIR/$filename.md")
  echo "  -> saved $filename.md (${SIZE} bytes)"

  # Be polite: sleep 4-8 seconds between requests
  if [ $COUNT -lt $TOTAL ]; then
    DELAY=$((4 + RANDOM % 5))
    echo "  -> sleeping ${DELAY}s..."
    sleep $DELAY
  fi
done

echo ""
echo "Done! Fetched $COUNT/$TOTAL pages."
