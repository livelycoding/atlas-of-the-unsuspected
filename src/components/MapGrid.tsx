import { useRef, useEffect, useState } from 'react';
import { locations } from '../data/locations';
import { mapPositions } from '../data/mapPositions';
import { LocationCell } from './LocationCell';
import { EdgeLocation } from './EdgeLocation';
import { ConnectionLines } from './ConnectionLines';
import styles from './MapGrid.module.css';

interface Props {
  selectedId: string | null;
  filteredIds: Set<string> | null;
  removedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggleRemoved: (id: string) => void;
  mapMode: boolean;
}

const GRID_ROWS = 6;
const GRID_COLS = 7;

const regularLocations = locations.filter(l => !l.isMapEdge);
const edgeLocations = locations.filter(l => l.isMapEdge);

function renderEdge(
  id: string,
  selectedId: string | null,
  filteredIds: Set<string> | null,
  removedIds: Set<string>,
  onSelect: (id: string) => void,
  onToggleRemoved: (id: string) => void,
) {
  const loc = locations.find(l => l.id === id);
  if (!loc) return null;
  return (
    <EdgeLocation
      key={loc.id}
      location={loc}
      isSelected={selectedId === loc.id}
      isDimmed={filteredIds !== null && !filteredIds.has(loc.id)}
      isRemoved={removedIds.has(loc.id)}
      onSelect={onSelect}
      onToggleRemoved={onToggleRemoved}
    />
  );
}

export function MapGrid({ selectedId, filteredIds, removedIds, onSelect, onToggleRemoved, mapMode }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [cellPositions, setCellPositions] = useState<Map<string, { x: number; y: number }>>(new Map());

  useEffect(() => {
    const updatePositions = () => {
      if (!wrapperRef.current) return;
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const positions = new Map<string, { x: number; y: number }>();

      for (const loc of locations) {
        const el = wrapperRef.current.querySelector(`[data-location-id="${loc.id}"]`);
        if (el) {
          const rect = el.getBoundingClientRect();
          positions.set(loc.id, {
            x: rect.left - wrapperRect.left + rect.width / 2,
            y: rect.top - wrapperRect.top + rect.height / 2,
          });
        }
      }
      setCellPositions(positions);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    const timer = setTimeout(updatePositions, 100);
    return () => {
      window.removeEventListener('resize', updatePositions);
      clearTimeout(timer);
    };
  }, [mapMode]);

  // --- Map mode rendering ---
  if (mapMode) {
    return (
      <div className={styles.mapWrapper} ref={wrapperRef}>
        {/* Regular locations */}
        {regularLocations.map(loc => {
          const pos = mapPositions[loc.id];
          if (!pos) return null;
          return (
            <div
              key={loc.id}
              className={styles.mapCell}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <LocationCell
                location={loc}
                isSelected={selectedId === loc.id}
                isDimmed={filteredIds !== null && !filteredIds.has(loc.id)}
                isRemoved={removedIds.has(loc.id)}
                onSelect={onSelect}
                onToggleRemoved={onToggleRemoved}
              />
            </div>
          );
        })}

        {/* Edge locations */}
        {edgeLocations.map(loc => {
          const pos = mapPositions[loc.id];
          if (!pos) return null;
          return (
            <div
              key={loc.id}
              className={styles.mapCell}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <EdgeLocation
                location={loc}
                isSelected={selectedId === loc.id}
                isDimmed={filteredIds !== null && !filteredIds.has(loc.id)}
                isRemoved={removedIds.has(loc.id)}
                onSelect={onSelect}
                onToggleRemoved={onToggleRemoved}
              />
            </div>
          );
        })}

        <ConnectionLines cellPositions={cellPositions} selectedId={selectedId} removedIds={removedIds} mapMode />
      </div>
    );
  }

  // --- Grid mode rendering (original) ---

  // Build grid cells array
  const grid: (typeof regularLocations[0] | null)[][] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    grid[r] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      grid[r][c] = regularLocations.find(l => l.gridRow === r && l.gridCol === c) ?? null;
    }
  }

  const e = (id: string) => renderEdge(id, selectedId, filteredIds, removedIds, onSelect, onToggleRemoved);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {/* Top edge: Sunshine Island (center-left), Fogfire Point (center-right) */}
      <div className={styles.edgeTop}>
        <div className={styles.edgeTopLeft}>{e('sunshine-island')}</div>
        <div className={styles.edgeTopRight}>{e('fogfire-point')}</div>
      </div>

      <div className={styles.middleRow}>
        {/* Left edge: Priory of Captains */}
        <div className={styles.edgeLeft}>
          {e('priory-of-captains')}
        </div>

        {/* Main grid */}
        <div className={styles.grid}>
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className={styles.row} data-row={rowIdx}>
              {row.map((loc, colIdx) => (
                <div key={colIdx} className={styles.cellSlot}>
                  {loc ? (
                    <LocationCell
                      location={loc}
                      isSelected={selectedId === loc.id}
                      isDimmed={filteredIds !== null && !filteredIds.has(loc.id)}
                      isRemoved={removedIds.has(loc.id)}
                      onSelect={onSelect}
                      onToggleRemoved={onToggleRemoved}
                    />
                  ) : (
                    <div className={styles.emptyCell} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right edge: Wounded Moon Lake (top), Tiger's Nest (bottom) */}
        <div className={styles.edgeRight}>
          {e('wounded-moon-lake')}
          {e('tigers-nest')}
        </div>
      </div>

      {/* Bottom edge: Pentapolis (left), Hermitage of the Scythe (right) */}
      <div className={styles.edgeBottom}>
        <div className={styles.edgeBottomLeft}>{e('pentapolis')}</div>
        <div className={styles.edgeBottomRight}>{e('hermitage-of-the-scythe')}</div>
      </div>

      {/* SVG connection lines overlay — rendered last so it paints on top */}
      <ConnectionLines cellPositions={cellPositions} selectedId={selectedId} removedIds={removedIds} />
    </div>
  );
}
