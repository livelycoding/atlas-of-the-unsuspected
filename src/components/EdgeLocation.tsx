import { useRef, useCallback } from 'react';
import { Location } from '../data/types';
import styles from './EdgeLocation.module.css';

interface Props {
  location: Location;
  isSelected: boolean;
  isDimmed: boolean;
  isRemoved: boolean;
  onSelect: (id: string) => void;
  onToggleRemoved: (id: string) => void;
  weaknessCount: number;
  weaknessCertain: boolean;
}

export function EdgeLocation({ location, isSelected, isDimmed, isRemoved, onSelect, onToggleRemoved, weaknessCount, weaknessCertain }: Props) {
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

  return (
    <button
      className={`${styles.edge} ${isSelected ? styles.selected : ''} ${isDimmed ? styles.dimmed : ''} ${isRemoved && !isSelected ? styles.removed : ''}`}
      onClick={() => { if (!didLongPress.current) onSelect(location.id); }}
      onContextMenu={(e) => { e.preventDefault(); onToggleRemoved(location.id); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      data-location-id={location.id}
      title={`${location.name} — Map's Edge\nCannot leave once entered\n${location.specialFeatures.join('\n')}`}
    >
      {weaknessCount > 0 && (
        <span className={`${styles.weaknessCount} ${weaknessCertain ? '' : styles.weaknessUncertain}`}>{weaknessCount}</span>
      )}
      <span className={styles.name}>{location.name}</span>
      <span className={styles.tag}>Map's Edge</span>
    </button>
  );
}
