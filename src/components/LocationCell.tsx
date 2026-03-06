import { useRef, useCallback } from 'react';
import { Location, RegionColor } from '../data/types';
import styles from './LocationCell.module.css';

interface Props {
  location: Location;
  isSelected: boolean;
  isDimmed: boolean;
  isRemoved: boolean;
  onSelect: (id: string) => void;
  onToggleRemoved: (id: string) => void;
}

const regionColors: Record<RegionColor, string> = {
  'western-europe': '#4a90d9',
  'france-iberia': '#2d8b7a',
  'germany-austria': '#e8a44a',
  'eastern-europe': '#d4618c',
  'russia': '#c94444',
  'italy-balkans': '#8b5fbf',
  'north-africa': '#b44a8c',
  'middle-east': '#d46a5a',
  'south-med': '#e88a6a',
  'map-edge': '#c9a830',
};

export function LocationCell({ location, isSelected, isDimmed, isRemoved, onSelect, onToggleRemoved }: Props) {
  const bgColor = regionColors[location.region];
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const onTouchStart = useCallback(() => {
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onToggleRemoved(location.id);
    }, 500);
  }, [location.id, onToggleRemoved]);

  const onTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const badges: string[] = [];
  if (location.shrine) {
    badges.push(location.shrine.deity === 'The Colonel' ? 'Z' : 'S');
  }
  if (location.pentiment) badges.push('P');
  if (location.ligeian) badges.push('L');
  if (location.ally) badges.push('A');
  if (location.weapons.some(w => w.includes("Biedde"))) badges.push('W1');
  if (location.weapons.some(w => w.includes("Lionhunter"))) badges.push('W2');
  if (location.weapons.some(w => w.includes("Ebrehel"))) badges.push('W3');
  if (location.weapons.some(w => w.includes("Imhullune"))) badges.push('W4');
  if (location.specialEvent) badges.push('E');
  if (location.caper) badges.push('C');
  if (location.isTroubled) badges.push('T');
  if (location.isRemote && !location.isMapEdge) badges.push('R');
  if (location.bookOfSunsPage !== null) badges.push('B');

  return (
    <button
      className={`${styles.cell} ${isSelected ? styles.selected : ''} ${isDimmed ? styles.dimmed : ''} ${isRemoved && !isSelected ? styles.removed : ''}`}
      style={{ backgroundColor: bgColor }}
      onClick={() => { if (!didLongPress.current) onSelect(location.id); }}
      onContextMenu={(e) => { e.preventDefault(); onToggleRemoved(location.id); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      data-location-id={location.id}
      title={buildTooltip(location)}
    >
      <span className={styles.name}>{location.name}</span>
      {badges.length > 0 && (
        <div className={styles.badges}>
          {badges.map(b => (
            <span key={b} className={`${styles.badge} ${styles[`badge${b}`] || ''}`}>
              {b}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

function buildTooltip(loc: Location): string {
  const parts = [loc.name + ' — ' + loc.country];
  if (loc.isTroubled) parts.push('Troubled');
  if (loc.isRemote) parts.push('Remote');
  if (loc.shrine) parts.push(`Shrine: ${loc.shrine.description} (${loc.shrine.deity})`);
  if (loc.pentiment) parts.push(`Pentiment: ${loc.pentiment.name}`);
  if (loc.ligeian) parts.push(`Ligeian: ${loc.ligeian.name}`);
  if (loc.ally) parts.push(`Ally: ${loc.ally.name} (${loc.ally.aspect})`);
  if (loc.specialEvent) parts.push(`Special Event: ${loc.specialEvent.name}`);
  if (loc.caper) parts.push(`Caper: ${loc.caper.name}`);
  if (loc.bookOfSunsPage) parts.push(`Book of Suns: Page ${loc.bookOfSunsPage}`);
  return parts.join('\n');
}
