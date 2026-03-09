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
  foeWeaknessesCertain: boolean;
  weaknessActive: boolean;
  possibleWeaknesses: string[];
  onOpenOperation?: (name: string) => void;
  onBack?: () => void;
  backName?: string;
}

export function DetailPanel({ location, onClose, onNavigate, isRemoved, onToggleRemoved, removedIds, foeWeaknesses, foeWeaknessesCertain, weaknessActive, possibleWeaknesses, onOpenOperation, onBack, backName }: Props) {
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
          {onBack && <button className={styles.backBtn} onClick={onBack}>{'\u2190'} Back to {backName}</button>}
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
          {foeWeaknessesCertain ? <>Confirmed<HelpBubble text="All weakness pools with distractions at this location have been fully narrowed down, so this count is confirmed." />: {foeWeaknesses.length}</> : <>{foeWeaknesses.length}{' known'}<HelpBubble text="This location has at least one possible distraction from a weakness pool you haven't fully narrowed down yet. There may be additional foe weaknesses here." /></>} foe weakness{foeWeaknesses.length !== 1 ? 'es' : ''} here: {foeWeaknesses.join(', ')}
        </div>
      )}
      {weaknessActive && foeWeaknesses.length === 0 && (
        <div className={`${styles.weaknessCallout} ${styles.weaknessCalloutZero}`}>
          {foeWeaknessesCertain ? <>Confirmed<HelpBubble text="All weakness pools with distractions at this location have been fully narrowed down, so this count is confirmed." />: no</> : <>No{' known'}<HelpBubble text="This location has at least one possible distraction from a weakness pool you haven't fully narrowed down yet. There may be foe weaknesses here." /></>} foe weaknesses here
        </div>
      )}
      {weaknessActive && possibleWeaknesses.length > 0 && (
        <div className={styles.possibleWeaknesses}>
          Possible: {possibleWeaknesses.join(', ')}
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
                const isSpecial = isLigeian || isAlly || isCaper;
                if (!isSpecial) return null;
                return (
                  <li key={i}>
                    {isLigeian ? `Ligeian: ${location.ligeian!.name}` : isAlly ? `Ally: ${f}` : `Caper: ${f}`}
                    {isAlly && (
                      <div className={styles.detail}>
                        <span className={styles.meta}>{location.ally!.aspect}</span>
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
            <ExpandableList items={location.onArrival.filter(f => {
              const isLigeian = location.ligeian && location.ligeian.name.includes(f);
              const isAlly = location.ally && location.ally.name === f;
              const isCaper = location.caper && location.caper.name === f;
              return !isLigeian && !isAlly && !isCaper;
            })} onOpenOperation={onOpenOperation} />
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
              <span className={styles.eventTriggerValue}>{renderAspects(location.specialEvent.trigger, onOpenOperation)}</span>
            </div>
            <ol className={styles.eventSteps}>
              {location.specialEvent.steps.map((s, i) => <li key={i}>{renderAspects(s, onOpenOperation)}</li>)}
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
              <OpSubsection label="Connections & Licenses" items={ops.connections} onOpenOperation={onOpenOperation} />
            )}
            {ops.property.length > 0 && (
              <OpSubsection label="Property" items={ops.property} onOpenOperation={onOpenOperation} />
            )}
            {ops.items.length > 0 && (
              <OpSubsection label="Items" items={ops.items} onOpenOperation={onOpenOperation} />
            )}
            {ops.times.length > 0 && (
              <OpSubsection label="Times" items={ops.times} onOpenOperation={onOpenOperation} />
            )}
            {ops.distractions.length > 0 && (
              <OpSubsection label="Distractions" items={ops.distractions} onOpenOperation={onOpenOperation} />
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
        {!location.pentiment && (() => {
          const pentimentOpps = location.opportunities.items.filter(item => {
            const d = opportunityDetails[item];
            return d && d.aspects.split(/,\s*/).includes('Pentiment');
          });
          if (pentimentOpps.length === 0) return null;
          const costs = pentimentOpps.map(item => {
            const d = opportunityDetails[item];
            const match = d.aspects.match(/Worth (\d+)/);
            return match ? `${match[1]} Worth` : 'Worth';
          });
          return (
            <Section title="Pentiment">
              <ExpandableList items={pentimentOpps} onOpenOperation={onOpenOperation} />
              <p className={styles.description}>Reconnoitre, then purchase for {costs.join(' / ')}</p>
            </Section>
          );
        })()}

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

function HelpBubble({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className={styles.uncertainHelp}
        onClick={() => setOpen(v => !v)}
        aria-label="More info"
      >?</button>
      {open && <span className={styles.helpText}>{text}</span>}
    </>
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

function renderAspects(text: string, onOpenOperation?: (name: string) => void): React.ReactNode {
  if (!onOpenOperation || !text.includes('[[')) return text;
  const parts = text.split(/\[\[([^\]]+)\]\]/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <button key={i} className={styles.opLink} onClick={() => onOpenOperation(part)}>
        {part}
      </button>
    ) : (
      part
    )
  );
}

function ExpandableList({ items, onOpenOperation }: { items: string[]; onOpenOperation?: (name: string) => void }) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [expandedSub, setExpandedSub] = useState<Set<string>>(new Set());

  const toggle = (i: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const toggleSub = (key: string) => {
    setExpandedSub(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <ul className={styles.list}>
      {items.map((item, i) => {
        const lookupKey = item.startsWith('Opportunity: ') ? item.slice('Opportunity: '.length) : item;
        const detail = opportunityDetails[lookupKey];
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
                    <span className={styles.meta}>{renderAspects(detail.aspects, onOpenOperation)}</span>
                    {detail.weaknessPool && (
                      <span className={styles.meta}>
                        Part of the {detail.weaknessPool.name} weakness pool: {detail.weaknessPool.others.join(', ')}
                      </span>
                    )}
                    {detail.subItems && detail.subItems.map((sub, si) => {
                      const subKey = `${i}-${si}`;
                      const subOpen = expandedSub.has(subKey);
                      return (
                        <div key={subKey}>
                          <button className={styles.opToggle} onClick={() => toggleSub(subKey)}>
                            <span className={styles.opChevron}>{subOpen ? '\u25BE' : '\u25B8'}</span>
                            {sub.label}
                          </button>
                          {subOpen && (
                            <div className={styles.opSubItem}>
                              <span className={styles.meta}>{sub.aspects}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
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

function OpSubsection({ label, items, onOpenOperation }: { label: string; items: string[]; onOpenOperation?: (name: string) => void }) {
  return (
    <div className={styles.opGroup}>
      <span className={styles.opLabel}>{label}</span>
      <ExpandableList items={items} onOpenOperation={onOpenOperation} />
    </div>
  );
}
