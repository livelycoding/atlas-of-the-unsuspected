import { useState, useCallback, useRef } from 'react';
import { MapGrid } from './components/MapGrid';
import { DetailPanel } from './components/DetailPanel';
import { Legend } from './components/Legend';
import { locations, locationsById } from './data/locations';
import { RegionColor } from './data/types';
import styles from './App.module.css';

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

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
    const data = JSON.stringify([...removedIds]);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exile-map-run.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [removedIds]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const ids: string[] = JSON.parse(reader.result as string);
        setRemovedIds(new Set(ids));
      } catch { /* ignore invalid files */ }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const selectedLocation = selectedId ? locationsById.get(selectedId) ?? null : null;

  // Determine which locations pass the active filters
  const filteredIds = activeFilters.size === 0
    ? null // null = show all
    : new Set(
        locations
          .filter(loc => {
            for (const f of activeFilters) {
              if (f === 'shrine-colonel' && loc.shrine?.deity === 'The Colonel') return true;
              if (f === 'shrine-lionsmith' && loc.shrine?.deity === 'The Lionsmith') return true;
              if (f === 'pentiment' && loc.pentiment) return true;
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
              if (f === 'book-of-suns' && loc.bookOfSunsPage !== null) return true;
              // Region filters
              if (f === loc.region as RegionColor) return true;
            }
            return false;
          })
          .map(loc => loc.id)
      );

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Exile Map</h1>
        <span className={styles.subtitle}>Cultist Simulator: Exile DLC Explorer</span>
      </header>
      <div className={styles.toolbar}>
        <button className={styles.toolbarBtn} onClick={handleExport}>Export Current Run Data</button>
        <button className={styles.toolbarBtn} onClick={() => fileInputRef.current?.click()}>Import Run Data</button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} hidden />
      </div>
      <div className={styles.content}>
        <div className={styles.mapArea}>
          <p className={styles.hint}>Right-click a city to remove it from the pool</p>
          <MapGrid
            selectedId={selectedId}
            filteredIds={filteredIds}
            removedIds={removedIds}
            onSelect={handleSelect}
            onToggleRemoved={handleToggleRemoved}
          />
          <Legend
            activeFilters={activeFilters}
            onToggleFilter={handleToggleFilter}
          />
        </div>
        {selectedLocation && (
          <DetailPanel
            location={selectedLocation}
            onClose={handleClose}
            onNavigate={handleSelect}
            isRemoved={removedIds.has(selectedLocation.id)}
            onToggleRemoved={handleToggleRemoved}
            removedIds={removedIds}
          />
        )}
      </div>
    </div>
  );
}
