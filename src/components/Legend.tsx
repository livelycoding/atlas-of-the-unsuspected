import React, { useState, useRef, useCallback } from 'react';
import { OpportunitySearch } from './OpportunitySearch';
import styles from './Legend.module.css';

interface Props {
  activeFilters: Set<string>;
  onToggleFilter: (filter: string) => void;
  opportunityTerms: string[];
  onOpportunitySearch: (terms: string[]) => void;
  eliminatedWeaknesses: Set<string>;
  onToggleWeakness: (name: string) => void;
  onEliminateOthers: (name: string) => void;
}

const weaknessPools = [
  { title: 'Environment', items: ['Freezing Winds', 'Trembling Heat', 'The Sea'] },
  { title: 'Quirks', items: ['Cats', 'Heights', 'Faith'] },
  { title: 'Disfavor', items: ["The Wolf Divided's Shadow", "The Horned Axe's Shadow", "The Flowermaker's Shadow"] },
];

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

const placeItems = [
  { id: 'shrine-colonel', label: 'Colonel Shrine', badge: 'Z', color: '#8b0000' },
  { id: 'shrine-lionsmith', label: 'Lionsmith Shrine', badge: 'S', color: '#b8860b' },
  { id: 'special-event', label: 'Special Event', badge: 'E', color: '#20b2aa' },
  { id: 'caper', label: 'Caper', badge: 'C', color: '#e06030' },
  { id: 'troubled', label: 'Troubled', badge: 'T', color: '#ff4500' },
  { id: 'remote', label: 'Remote', badge: 'R', color: '#6a5acd' },
  { id: 'map-edge', label: 'Map\'s Edge', badge: '\u2606', color: '#c9a830' },
];

const peopleItems = [
  { id: 'ally', label: 'Ally', badge: 'A', color: '#ff6347' },
  { id: 'ligeian', label: 'Ligeian', badge: 'L', color: '#4169e1' },
];

const stuffItems = [
  { id: 'pentiment', label: 'Pentiment', badge: 'P', color: '#2e8b57' },
  { id: 'weapon-biedde', label: "Biedde's Blade", badge: 'W1', color: '#708090' },
  { id: 'weapon-lionhunter', label: "Lionhunter's Rifle", badge: 'W2', color: '#5a6a5a' },
  { id: 'weapon-ebrehel', label: 'Ebrehel (vault)', badge: 'W3', color: '#8b4513' },
  { id: 'weapon-imhullune', label: 'Imhullune Tectrix (vault)', badge: 'W4', color: '#4a5568' },
  { id: 'book-of-suns-1', label: 'Book of Suns p.1', badge: 'B1', color: '#daa520' },
  { id: 'book-of-suns-2', label: 'Book of Suns p.2', badge: 'B2', color: '#daa520' },
  { id: 'book-of-suns-3', label: 'Book of Suns p.3', badge: 'B3', color: '#daa520' },
];

export function Legend({ activeFilters, onToggleFilter, opportunityTerms, onOpportunitySearch, eliminatedWeaknesses, onToggleWeakness, onEliminateOthers }: Props) {
  const [weaknessOpen, setWeaknessOpen] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const handleTouchStart = useCallback((name: string) => {
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onEliminateOthers(name);
    }, 500);
  }, [onEliminateOthers]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.weaknessRow}>
        <button className={styles.weaknessToggle} onClick={() => setWeaknessOpen(v => !v)}>
          <span className={`${styles.weaknessArrow} ${weaknessOpen ? styles.weaknessArrowOpen : ''}`}>&#9654;</span>
          <span>Remaining Weaknesses</span>
        </button>
        {weaknessOpen && (
          <>
            <p className={styles.weaknessHint}>Click to eliminate. Right-click or long-press to keep only that weakness.</p>
            <div className={styles.weaknessContent}>
              {weaknessPools.map((pool, i) => (
                <React.Fragment key={pool.title}>
                  {i > 0 && <div className={styles.divider} />}
                  <div className={styles.group}>
                    <h4 className={styles.groupTitle}>{pool.title}</h4>
                    <div className={styles.items}>
                      {pool.items.map(name => {
                        const isEliminated = eliminatedWeaknesses.has(name);
                        const remaining = pool.items.filter(n => !eliminatedWeaknesses.has(n));
                        const isSoleSurvivor = !isEliminated && remaining.length === 1;
                        return (
                          <button
                            key={name}
                            className={`${styles.item} ${isEliminated ? styles.eliminated : ''} ${isSoleSurvivor ? styles.soleSurvivor : ''}`}
                            title="Click to eliminate. Right-click or long-press to keep only this one."
                            onClick={() => { if (!didLongPress.current) onToggleWeakness(name); }}
                            onContextMenu={(e) => { e.preventDefault(); onEliminateOthers(name); }}
                            onTouchStart={() => handleTouchStart(name)}
                            onTouchEnd={handleTouchEnd}
                            onTouchCancel={handleTouchEnd}
                          >
                            <span className={styles.label}>{name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>
      <div className={styles.legend}>
      <OpportunitySearch terms={opportunityTerms} onSearch={onOpportunitySearch} />
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
        <h4 className={styles.groupTitle}>Places</h4>
        <div className={styles.items}>
          {placeItems.map(item => (
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
      <div className={styles.divider} />
      <div className={styles.group}>
        <h4 className={styles.groupTitle}>People</h4>
        <div className={styles.items}>
          {peopleItems.map(item => (
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
      <div className={styles.divider} />
      <div className={styles.group}>
        <h4 className={styles.groupTitle}>Weapons & Key Items</h4>
        <div className={styles.items}>
          {stuffItems.map(item => (
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
    </div>
  );
}
