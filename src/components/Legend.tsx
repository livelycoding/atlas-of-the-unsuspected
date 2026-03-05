import styles from './Legend.module.css';

interface Props {
  activeFilters: Set<string>;
  onToggleFilter: (filter: string) => void;
}

const regionItems = [
  { id: 'western-europe', label: 'Western Europe', color: '#4a90d9' },
  { id: 'france-iberia', label: 'France / Iberia', color: '#2d8b7a' },
  { id: 'germany-austria', label: 'Germany / Austria', color: '#e8a44a' },
  { id: 'eastern-europe', label: 'Eastern Europe', color: '#d4618c' },
  { id: 'russia', label: 'Russia / USSR', color: '#c94444' },
  { id: 'italy-balkans', label: 'Italy / Balkans', color: '#8b5fbf' },
  { id: 'north-africa', label: 'North Africa', color: '#b44a8c' },
  { id: 'middle-east', label: 'Middle East', color: '#d46a5a' },
  { id: 'south-med', label: 'South Mediterranean', color: '#e88a6a' },
];

const badgeItems = [
  { id: 'shrine-colonel', label: 'Colonel Shrine', badge: 'Z', color: '#8b0000' },
  { id: 'shrine-lionsmith', label: 'Lionsmith Shrine', badge: 'S', color: '#b8860b' },
  { id: 'pentiment', label: 'Pentiment', badge: 'P', color: '#2e8b57' },
  { id: 'ligeian', label: 'Ligeian', badge: 'L', color: '#4169e1' },
  { id: 'ally', label: 'Ally', badge: 'A', color: '#ff6347' },
  { id: 'troubled', label: 'Troubled', badge: 'T', color: '#ff4500' },
  { id: 'remote', label: 'Remote', badge: 'R', color: '#6a5acd' },
  { id: 'weapon-biedde', label: "Biedde's Blade", badge: 'W', color: '#708090' },
  { id: 'weapon-lionhunter', label: "Lionhunter's Rifle", badge: 'W', color: '#5a6a5a' },
  { id: 'weapon-ebrehel', label: 'Ebrehel (vault)', badge: 'W', color: '#8b4513' },
  { id: 'weapon-imhullune', label: 'Imhullune Tectrix (vault)', badge: 'W', color: '#4a5568' },
  { id: 'caper', label: 'Caper', badge: 'C', color: '#e06030' },
  { id: 'book-of-suns', label: 'Book of Suns', badge: 'B', color: '#daa520' },
  { id: 'map-edge', label: 'Map\'s Edge', badge: '\u2606', color: '#c9a830' },
];

export function Legend({ activeFilters, onToggleFilter }: Props) {
  return (
    <div className={styles.legend}>
      <div className={styles.group}>
        <h4 className={styles.groupTitle}>Regions</h4>
        <div className={styles.items}>
          {regionItems.map(item => (
            <button
              key={item.id}
              className={`${styles.item} ${activeFilters.has(item.id) ? styles.active : ''}`}
              onClick={() => onToggleFilter(item.id)}
            >
              <span className={styles.swatch} style={{ backgroundColor: item.color }} />
              <span className={styles.label}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.group}>
        <h4 className={styles.groupTitle}>Features</h4>
        <div className={styles.items}>
          {badgeItems.map(item => (
            <button
              key={item.id}
              className={`${styles.item} ${activeFilters.has(item.id) ? styles.active : ''}`}
              onClick={() => onToggleFilter(item.id)}
            >
              <span className={styles.badgeIcon} style={{ backgroundColor: item.color }}>
                {item.badge}
              </span>
              <span className={styles.label}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
