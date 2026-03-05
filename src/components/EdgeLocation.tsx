import { Location } from '../data/types';
import styles from './EdgeLocation.module.css';

interface Props {
  location: Location;
  isSelected: boolean;
  isDimmed: boolean;
  onSelect: (id: string) => void;
}

export function EdgeLocation({ location, isSelected, isDimmed, onSelect }: Props) {
  return (
    <button
      className={`${styles.edge} ${isSelected ? styles.selected : ''} ${isDimmed ? styles.dimmed : ''}`}
      onClick={() => onSelect(location.id)}
      data-location-id={location.id}
      title={`${location.name} — Map's Edge\nCannot leave once entered\n${location.specialFeatures.join('\n')}`}
    >
      <span className={styles.name}>{location.name}</span>
      <span className={styles.tag}>Map's Edge</span>
    </button>
  );
}
