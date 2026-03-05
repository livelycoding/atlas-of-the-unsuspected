import { useState, useCallback } from 'react';
import { MapGrid } from './components/MapGrid';
import { DetailPanel } from './components/DetailPanel';
import { Legend } from './components/Legend';
import { locations, locationsById } from './data/locations';
import { RegionColor } from './data/types';
import styles from './App.module.css';

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const handleSelect = useCallback((id: string) => {
    setSelectedId(prev => (prev === id ? null : id));
  }, []);

  const handleClose = useCallback(() => {
    setSelectedId(null);
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
      <div className={styles.content}>
        <div className={styles.mapArea}>
          <MapGrid
            selectedId={selectedId}
            filteredIds={filteredIds}
            onSelect={handleSelect}
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
          />
        )}
      </div>
    </div>
  );
}
