import { useState } from 'react';
import { Location } from '../data/types';
import { locationsById } from '../data/locations';
import { directedConnections } from '../data/connections';
import { opportunityDetails } from '../data/opportunities';
import styles from './DetailPanel.module.css';

interface Props {
  location: Location;
  onClose: () => void;
  onNavigate: (id: string) => void;
  isRemoved: boolean;
  onToggleRemoved: (id: string) => void;
  removedIds: Set<string>;
  foeWeaknesses: string[];
}

export function DetailPanel({ location, onClose, onNavigate, isRemoved, onToggleRemoved, removedIds, foeWeaknesses }: Props) {
  const outgoingDirectedIds = location.isMapEdge ? [] : directedConnections
    .filter(c => c.from === location.id)
    .map(c => c.to);
  const outgoingDirectedSet = new Set(outgoingDirectedIds);
  const allConnectedIds = location.isMapEdge ? [] : [
    ...location.connections.filter(id => !outgoingDirectedSet.has(id)),
    ...outgoingDirectedIds,
    ...location.edgeConnections,
  ];
  const [clickMode, setClickMode] = useState<'none' | 'travels' | 'removes'>('none');
  const ops = location.opportunities;
  const hasOpportunities = ops.connections.length > 0 || ops.property.length > 0
    || ops.items.length > 0 || ops.times.length > 0 || ops.distractions.length > 0;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{location.name}</h2>
          <span className={styles.country}>{location.country}</span>
          <label className={styles.removedCheckbox}>
            <input
              type="checkbox"
              checked={isRemoved}
              onChange={() => onToggleRemoved(location.id)}
            />
            Removed from pool
          </label>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
      </div>

      <div className={styles.tags}>
        {location.isMapEdge && <span className={`${styles.tag} ${styles.tagEdge}`}>Map's Edge</span>}
        {location.isTroubled && <span className={`${styles.tag} ${styles.tagTroubled}`}>Troubled</span>}
        {location.isRemote && !location.isMapEdge && <span className={`${styles.tag} ${styles.tagRemote}`}>Remote</span>}
        {location.cult === 'colonel' && <span className={`${styles.tag} ${styles.tagColonel}`}>Colonel</span>}
        {location.cult === 'lionsmith' && <span className={`${styles.tag} ${styles.tagLionsmith}`}>Lionsmith</span>}
      </div>

      {foeWeaknesses.length > 0 && (
        <div className={styles.weaknessCallout}>
          {foeWeaknesses.length} foe weakness{foeWeaknesses.length !== 1 ? 'es' : ''} here: {foeWeaknesses.join(', ')}
        </div>
      )}

      <div className={styles.sections}>
        {/* Connections */}
        <Section title="Connections">
          {location.isMapEdge ? (
            <span className={styles.endOfLine}>None. End of the line.</span>
          ) : (
            <>
              <div className={styles.clickModes}>
                <label className={styles.travelCheckbox}>
                  <input
                    type="checkbox"
                    checked={clickMode === 'travels'}
                    onChange={() => setClickMode(prev => prev === 'travels' ? 'none' : 'travels')}
                  />
                  Touch Connection = Travel
                </label>
                <label className={styles.travelCheckbox}>
                  <input
                    type="checkbox"
                    checked={clickMode === 'removes'}
                    onChange={() => setClickMode(prev => prev === 'removes' ? 'none' : 'removes')}
                  />
                  Touch Connection = Remove it
                </label>
              </div>
              <div className={styles.connectionList}>
                {allConnectedIds.map(id => {
                  const conn = locationsById.get(id);
                  if (!conn) return null;
                  const targetRemoved = removedIds.has(id);
                  const isOneWay = conn.isMapEdge || outgoingDirectedSet.has(id);
                  return (
                    <button
                      key={id}
                      className={`${styles.connectionBtn} ${conn.isMapEdge ? styles.connectionEdge : ''} ${targetRemoved ? styles.connectionRemoved : ''} ${isOneWay && !conn.isMapEdge ? styles.connectionDirected : ''}`}
                      onClick={() => {
                        if (clickMode === 'travels') {
                          onToggleRemoved(location.id);
                          onNavigate(id);
                        } else if (clickMode === 'removes') {
                          onToggleRemoved(id);
                        } else {
                          onNavigate(id);
                        }
                      }}
                    >
                      {conn.name}{isOneWay && <span className={styles.oneWayArrow}>{'\u2009\u2192'}</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </Section>

        {/* On Arrival */}
        {location.onArrival.length > 0 && (
          <Section title="On Arrival">
            <ul className={styles.list}>
              {location.onArrival.map((f, i) => {
                const isLigeian = location.ligeian && location.ligeian.name.includes(f);
                const isAlly = location.ally && location.ally.name === f;
                const isCaper = location.caper && location.caper.name === f;
                return (
                  <li key={i}>
                    {isLigeian ? `Ligeian: ${location.ligeian!.name}` : isAlly ? `Ally: ${f}` : isCaper ? `Caper: ${f}` : f}
                    {isAlly && (
                      <div className={styles.detail}>
                        <span className={styles.meta}>Aspect: {location.ally!.aspect}</span>
                      </div>
                    )}
                    {isLigeian && (
                      <div className={styles.detail}>
                        <span className={styles.meta}>{location.ligeian!.howToObtain}</span>
                        <ul className={styles.list}>
                          {location.ligeian!.abilities.map((a, j) => <li key={j}>{a}</li>)}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Section>
        )}

        {/* Special Features */}
        {location.specialFeatures.length > 0 && (
          <Section title="Special Features">
            <ul className={styles.list}>
              {location.specialFeatures.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </Section>
        )}

        {/* Special Event */}
        {location.specialEvent && (
          <Section title="Special Event">
            <strong className={styles.eventName}>{location.specialEvent.name}</strong>
            <span className={styles.description}>{location.specialEvent.description}</span>
            <div className={styles.eventTrigger}>
              <span className={styles.eventTriggerLabel}>How to start:</span>
              <span className={styles.eventTriggerValue}>{location.specialEvent.trigger}</span>
            </div>
            <ol className={styles.eventSteps}>
              {location.specialEvent.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
            <div className={styles.eventRewards}>
              <div className={styles.eventReward}>
                <span className={styles.eventRewardLabel}>Reward</span>
                <ExpandableList items={[location.specialEvent.reward]} />
              </div>
              {location.specialEvent.rewardAlt && (
                <div className={styles.eventReward}>
                  <span className={styles.eventRewardLabel}>Alt</span>
                  <ExpandableList items={[location.specialEvent.rewardAlt]} />
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Caper */}
        {location.caper && (
          <Section title="Caper">
            <div className={styles.detail}>
              <strong>{location.caper.name}</strong>
              {location.caper.complications.map((c, i) => (
                <div key={i} className={styles.detail}>
                  <span className={styles.meta}>{c.name}: {c.checks.join(', ')}</span>
                </div>
              ))}
            </div>
            <div className={styles.opGroup}>
              <span className={styles.opLabel}>Reward</span>
              <ExpandableList items={[location.caper.reward]} />
            </div>
          </Section>
        )}

        {/* Opportunities */}
        {hasOpportunities && (
          <Section title="Reconnoitre Opportunities">
            {ops.connections.length > 0 && (
              <OpSubsection label="Connections & Licenses" items={ops.connections} />
            )}
            {ops.property.length > 0 && (
              <OpSubsection label="Property" items={ops.property} />
            )}
            {ops.items.length > 0 && (
              <OpSubsection label="Items" items={ops.items} />
            )}
            {ops.times.length > 0 && (
              <OpSubsection label="Times" items={ops.times} />
            )}
            {ops.distractions.length > 0 && (
              <OpSubsection label="Distractions" items={ops.distractions} />
            )}
          </Section>
        )}

        {/* Shrine */}
        {location.shrine && (
          <Section title="Shrine">
            <div className={styles.detail}>
              <strong>{location.shrine.description}</strong>
              <span className={styles.meta}>Deity: {location.shrine.deity}</span>
            </div>
          </Section>
        )}

        {/* Pentiment */}
        {location.pentiment && (
          <Section title="Pentiment">
            <ExpandableList items={
              location.pentiment.name.includes(' or ')
                ? location.pentiment.name.split(' or ').map(s => s.trim())
                : [location.pentiment.name]
            } />
            <p className={styles.description}>{location.pentiment.howToObtain}</p>
          </Section>
        )}

        {/* Ligeian */}
        {location.ligeian && (
          <Section title="Ligeian">
            <div className={styles.detail}>
              <strong>{location.ligeian.name}</strong>
              <span className={styles.meta}>{location.ligeian.howToObtain}</span>
              <ul className={styles.list}>
                {location.ligeian.abilities.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          </Section>
        )}

        {/* Ally */}
        {location.ally && (
          <Section title="Ally">
            <div className={styles.detail}>
              <strong>{location.ally.name}</strong>
              <span className={styles.meta}>Aspect: {location.ally.aspect}</span>
            </div>
          </Section>
        )}

        {/* Weapons */}
        {location.weapons.length > 0 && (
          <Section title="Weapons Available">
            <ExpandableList items={location.weapons} />
          </Section>
        )}

        {/* Rarities */}
        {location.rarities.length > 0 && (
          <Section title="Rarities">
            {location.rarities.map((r, i) => (
              <div key={i} className={styles.detail}>
                <strong>{r.name}</strong>
                <span className={styles.meta}>{r.aspect}</span>
              </div>
            ))}
          </Section>
        )}

        {/* Book of Suns */}
        {location.bookOfSunsPage !== null && (
          <Section title="Book of Suns">
            <ExpandableList items={[`Book of Suns: Page ${location.bookOfSunsPage}`]} />
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function ExpandableList({ items }: { items: string[] }) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <ul className={styles.list}>
      {items.map((item, i) => {
        const detail = opportunityDetails[item];
        const isOpen = expanded.has(i);
        return (
          <li key={i} className={styles.opItem}>
            {detail ? (
              <>
                <button className={styles.opToggle} onClick={() => toggle(i)}>
                  <span className={styles.opChevron}>{isOpen ? '\u25BE' : '\u25B8'}</span>
                  {item}
                </button>
                {isOpen && (
                  <div className={styles.opDetail}>
                    <strong>{detail.result}</strong>
                    <span className={styles.meta}>{detail.aspects}</span>
                    {detail.weaknessPool && (
                      <span className={styles.meta}>
                        Part of the {detail.weaknessPool.name} weakness pool: {detail.weaknessPool.others.join(', ')}
                      </span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <span>{item}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function OpSubsection({ label, items }: { label: string; items: string[] }) {
  return (
    <div className={styles.opGroup}>
      <span className={styles.opLabel}>{label}</span>
      <ExpandableList items={items} />
    </div>
  );
}
