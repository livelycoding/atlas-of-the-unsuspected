import { useState, useCallback, useRef, useMemo } from 'react';
import { MapGrid } from './components/MapGrid';
import { DetailPanel } from './components/DetailPanel';
import { Legend } from './components/Legend';
import { OperationsPanel } from './components/OperationsPanel';
import { HelpPanel } from './components/HelpPanel';
import { locations, locationsById } from './data/locations';
import { opportunityDetails } from './data/opportunities';
import { RegionColor } from './data/types';
import styles from './App.module.css';

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [mapMode, setMapMode] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);
  const [opportunityTerms, setOpportunityTerms] = useState<string[]>([]);
  const [showOperations, setShowOperations] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [initialOperation, setInitialOperation] = useState<string | null>(null);
  const [operationSourceId, setOperationSourceId] = useState<string | null>(null);
  const [eliminatedWeaknesses, setEliminatedWeaknesses] = useState<Set<string>>(new Set());

  const weaknessPools: Record<string, string[]> = {
    'Environment': ['Freezing Winds', 'Trembling Heat', 'The Sea'],
    'Quirks': ['Cats', 'Heights', 'Faith'],
    'Disfavor': ["The Wolf Divided's Shadow", "The Horned Axe's Shadow", "The Flowermaker's Shadow"],
  };

  const handleToggleWeakness = useCallback((name: string) => {
    setEliminatedWeaknesses(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  const handleEliminateOthers = useCallback((name: string) => {
    const pool = Object.values(weaknessPools).find(p => p.includes(name));
    if (!pool) return;
    const others = pool.filter(n => n !== name);
    setEliminatedWeaknesses(prev => {
      const next = new Set(prev);
      const allOthersEliminated = others.every(n => next.has(n));
      if (allOthersEliminated) {
        others.forEach(n => next.delete(n));
      } else {
        others.forEach(n => next.add(n));
        next.delete(name);
      }
      return next;
    });
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(prev => (prev === id ? null : id));
  }, []);

  const handleClose = useCallback(() => {
    setSelectedId(null);
  }, []);

  const handleToggleRemoved = useCallback((id: string) => {
    setRemovedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleToggleFilter = useCallback((filter: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        next.add(filter);
      }
      return next;
    });
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(() => {
    const data = JSON.stringify({
      removedIds: [...removedIds],
      eliminatedWeaknesses: [...eliminatedWeaknesses],
      mapMode,
    });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exile-map-run.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [removedIds, eliminatedWeaknesses, mapMode]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (Array.isArray(parsed)) {
          setRemovedIds(new Set(parsed));
          setEliminatedWeaknesses(new Set());
        } else {
          setRemovedIds(new Set(parsed.removedIds ?? []));
          setEliminatedWeaknesses(new Set(parsed.eliminatedWeaknesses ?? []));
          if (parsed.mapMode !== undefined) setMapMode(parsed.mapMode);
        }
      } catch { /* ignore invalid files */ }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const selectedLocation = selectedId ? locationsById.get(selectedId) ?? null : null;

  // Determine which weaknesses are confirmed (final) — the remaining one when 2 of 3 in a pool are eliminated
  const finalWeaknesses = useMemo(() => {
    const finals = new Set<string>();
    for (const pool of Object.values(weaknessPools)) {
      const eliminated = pool.filter(w => eliminatedWeaknesses.has(w));
      if (eliminated.length === 2) {
        const remaining = pool.find(w => !eliminatedWeaknesses.has(w))!;
        finals.add(remaining);
      }
    }
    return finals;
  }, [eliminatedWeaknesses]);

  // Map location id → list of final weakness names found in that location's distractions
  const nameNormalization: Record<string, string> = { 'Sea': 'The Sea' };

  // Build reverse lookup: weakness name → pool name
  const weaknessToPool = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [pool, members] of Object.entries(weaknessPools)) {
      for (const m of members) map[m] = pool;
    }
    return map;
  }, []);

  // Which pools are fully resolved (2 of 3 eliminated)
  const resolvedPools = useMemo(() => {
    const resolved = new Set<string>();
    for (const [pool, members] of Object.entries(weaknessPools)) {
      if (members.filter(w => eliminatedWeaknesses.has(w)).length === 2) {
        resolved.add(pool);
      }
    }
    return resolved;
  }, [eliminatedWeaknesses]);

  const locationWeaknessMap = useMemo(() => {
    const map = new Map<string, string[]>();
    if (finalWeaknesses.size === 0) return map;
    for (const loc of locations) {
      const matched: string[] = [];
      for (const d of loc.opportunities.distractions) {
        const normalized = nameNormalization[d] ?? d;
        if (finalWeaknesses.has(normalized)) {
          matched.push(normalized);
        }
      }
      if (matched.length > 0) {
        map.set(loc.id, matched);
      }
    }
    return map;
  }, [finalWeaknesses]);

  // Per-location: certain if no distraction from an unresolved pool remains non-eliminated
  const locationWeaknessCertain = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const loc of locations) {
      let hasAnyPoolDistraction = false;
      let uncertain = false;
      for (const d of loc.opportunities.distractions) {
        const normalized = nameNormalization[d] ?? d;
        const pool = weaknessToPool[normalized];
        if (!pool) continue;
        hasAnyPoolDistraction = true;
        if (!resolvedPools.has(pool) && !eliminatedWeaknesses.has(normalized)) {
          uncertain = true;
          break;
        }
      }
      map.set(loc.id, hasAnyPoolDistraction && !uncertain);
    }
    return map;
  }, [resolvedPools, weaknessToPool, eliminatedWeaknesses]);

  // Determine which locations pass the active legend filters
  const legendFilteredIds = activeFilters.size === 0
    ? null
    : new Set(
        locations
          .filter(loc => {
            for (const f of activeFilters) {
              if (f === 'shrine-colonel' && loc.shrine?.deity === 'The Colonel') return true;
              if (f === 'shrine-lionsmith' && loc.shrine?.deity === 'The Lionsmith') return true;
              if (f === 'pentiment' && (loc.pentiment || loc.opportunities.items.some(item => {
                const detail = opportunityDetails[item];
                return detail && detail.aspects.split(/,\s*/).includes('Pentiment');
              }))) return true;
              if (f === 'ligeian' && loc.ligeian) return true;
              if (f === 'ally' && loc.ally) return true;
              if (f === 'troubled' && loc.isTroubled) return true;
              if (f === 'remote' && loc.isRemote) return true;
              if (f === 'map-edge' && loc.isMapEdge) return true;
              if (f === 'weapon-biedde' && loc.weapons.some(w => w.includes("Biedde"))) return true;
              if (f === 'weapon-lionhunter' && loc.weapons.some(w => w.includes("Lionhunter"))) return true;
              if (f === 'weapon-ebrehel' && loc.weapons.some(w => w.includes("Ebrehel"))) return true;
              if (f === 'weapon-imhullune' && loc.weapons.some(w => w.includes("Imhullune"))) return true;
              if (f === 'special-event' && loc.specialEvent) return true;
              if (f === 'caper' && loc.caper) return true;
              if (f === 'book-of-suns-1' && loc.bookOfSunsPage === 1) return true;
              if (f === 'book-of-suns-2' && loc.bookOfSunsPage === 2) return true;
              if (f === 'book-of-suns-3' && loc.bookOfSunsPage === 3) return true;
              if (f === loc.region as RegionColor) return true;
            }
            return false;
          })
          .map(loc => loc.id)
      );

  // Determine which locations match all opportunity search terms (AND logic)
  const opportunityMatchIds = useMemo(() => {
    if (opportunityTerms.length === 0) return null;
    return new Set(
      locations
        .filter(loc => {
          const all = [
            ...loc.opportunities.connections,
            ...loc.opportunities.property,
            ...loc.opportunities.items,
            ...loc.opportunities.times,
            ...loc.opportunities.distractions,
          ];
          return opportunityTerms.every(term => all.includes(term));
        })
        .map(loc => loc.id)
    );
  }, [opportunityTerms]);

  // Merge legend filters and opportunity search: intersect if both active
  const filteredIds = useMemo(() => {
    if (!legendFilteredIds && !opportunityMatchIds) return null;
    if (!legendFilteredIds) return opportunityMatchIds;
    if (!opportunityMatchIds) return legendFilteredIds;
    return new Set([...legendFilteredIds].filter(id => opportunityMatchIds.has(id)));
  }, [legendFilteredIds, opportunityMatchIds]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Atlas of the Unsuspected</h1>
        <span className={styles.subtitle}>Cultist Simulator: Exile DLC Explorer</span>
        <div className={styles.headerSpacer} />
        <button
          className={`${styles.toolbarBtn} ${showHelp ? styles.toolbarBtnActive : ''}`}
          onClick={() => setShowHelp(v => !v)}
        >
          How to Use
        </button>
      </header>
      <div className={styles.toolbar}>
        <button className={styles.toolbarBtn} onClick={handleExport}>Export Run Data</button>
        <button className={styles.toolbarBtn} onClick={() => fileInputRef.current?.click()}>Import Run Data</button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} hidden />
        <button
          className={`${styles.toolbarBtn} ${confirmReset ? styles.toolbarBtnDanger : ''}`}
          onClick={() => {
            if (confirmReset) {
              setRemovedIds(new Set());
              setEliminatedWeaknesses(new Set());
              setConfirmReset(false);
            } else {
              setConfirmReset(true);
              setTimeout(() => setConfirmReset(false), 3000);
            }
          }}
        >
          {confirmReset ? 'Click again to confirm' : 'Reset Cities'}
        </button>
        <div className={styles.toolbarSpacer} />
        <button
          className={`${styles.toolbarBtn} ${showOperations ? styles.toolbarBtnActive : ''}`}
          onClick={() => setShowOperations(v => !v)}
        >
          Operations Reference
        </button>
      </div>
      <div className={styles.viewToggleRow}>
        <button
          className={styles.viewToggleBtn}
          onClick={() => setMapMode(m => !m)}
        >
          {mapMode ? 'Switch to Grid View' : 'Switch to Map View'}
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.mapArea}>
          <p className={styles.hint}>Right-click or long-press a city to remove it from the pool.</p>
          <button
            className={`${styles.filterWarning} ${activeFilters.size > 0 || opportunityTerms.length > 0 ? styles.filterWarningVisible : ''}`}
            onClick={() => { setActiveFilters(new Set()); setOpportunityTerms([]); }}
            tabIndex={activeFilters.size > 0 || opportunityTerms.length > 0 ? 0 : -1}
          >
            You have filters on. Reset all filters
          </button>
          <MapGrid
            selectedId={selectedId}
            filteredIds={filteredIds}
            removedIds={removedIds}
            onSelect={handleSelect}
            onToggleRemoved={handleToggleRemoved}
            mapMode={mapMode}
            locationWeaknessCount={new Map([...locationWeaknessMap].map(([id, ws]) => [id, ws.length]))}
          />
          <Legend
            activeFilters={activeFilters}
            onToggleFilter={handleToggleFilter}
            opportunityTerms={opportunityTerms}
            onOpportunitySearch={setOpportunityTerms}
            eliminatedWeaknesses={eliminatedWeaknesses}
            onToggleWeakness={handleToggleWeakness}
            onEliminateOthers={handleEliminateOthers}
          />
        </div>
        {showHelp && !selectedLocation && !showOperations && (
          <HelpPanel onClose={() => setShowHelp(false)} />
        )}
        {showOperations && !selectedLocation && (
          <OperationsPanel
            onClose={() => { setShowOperations(false); setOperationSourceId(null); }}
            initialOperation={initialOperation}
            onClearInitial={() => setInitialOperation(null)}
            onBack={operationSourceId ? () => {
              setShowOperations(false);
              setSelectedId(operationSourceId);
              setOperationSourceId(null);
            } : undefined}
          />
        )}
        {selectedLocation && (
          <DetailPanel
            location={selectedLocation}
            onClose={handleClose}
            onNavigate={handleSelect}
            isRemoved={removedIds.has(selectedLocation.id)}
            onToggleRemoved={handleToggleRemoved}
            removedIds={removedIds}
            foeWeaknesses={locationWeaknessMap.get(selectedLocation.id) ?? []}
            foeWeaknessesCertain={locationWeaknessCertain.get(selectedLocation.id) ?? false}
            onOpenOperation={(name) => {
              setOperationSourceId(selectedLocation.id);
              setSelectedId(null);
              setInitialOperation(name);
              setShowOperations(true);
            }}
          />
        )}
      </div>
      <footer className={styles.footer}>
        Unofficial fan tool, not associated with Weather Factory. For speedrunners and anyone who loves the Exile DLC. Learn more about the game and support the devs at <a href="https://www.weatherfactory.biz" target="_blank" rel="noopener noreferrer">weatherfactory.biz</a>.
      </footer>
    </div>
  );
}
