import { useState, useEffect, useRef, useCallback } from 'react';
import { defianceMethods, defianceVictory } from '../data/defiance';
import styles from './OperationsPanel.module.css';

interface Props {
  onClose: () => void;
  initialMethod?: string | null;
  onClearInitial?: () => void;
  onBack?: () => void;
}

export function DefiancePanel({ onClose, initialMethod, onClearInitial, onBack }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [linkedIdx, setLinkedIdx] = useState<number | null>(null);
  const [victoryOpen, setVictoryOpen] = useState(false);
  const methodRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = useCallback((i: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!initialMethod) return;
    const idx = defianceMethods.findIndex(m => m.name === initialMethod);
    if (idx === -1) return;
    setExpanded(prev => new Set(prev).add(idx));
    setLinkedIdx(idx);
    requestAnimationFrame(() => {
      methodRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    onClearInitial?.();
  }, [initialMethod, onClearInitial]);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>&larr; Back to City</button>
          )}
          <h2 className={styles.title}>Defiance Quick Reference</h2>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
      </div>
      <div className={styles.operations}>
        {/* Victory condition */}
        <div className={styles.operation}>
          <button className={styles.opHeader} onClick={() => setVictoryOpen(v => !v)}>
            <span className={styles.chevron}>{victoryOpen ? '\u25BE' : '\u25B8'}</span>
            Edge Victory Condition
          </button>
          {victoryOpen && (
            <div className={styles.opBody}>
              <div>
                <span className={styles.subLabel}>How to Win</span>
                <p style={{ fontSize: '0.78rem', color: '#b0b8c0', margin: 0 }}>{defianceVictory.description}</p>
              </div>
              <div>
                <span className={styles.subLabel}>Requirements</span>
                <ul className={styles.list}>
                  {defianceVictory.requirements.map((r, j) => <li key={j}>{r}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Methods */}
        {defianceMethods.map((method, i) => {
          const isOpen = expanded.has(i);
          return (
            <div key={i} className={styles.operation} ref={el => { methodRefs.current[i] = el; }}>
              <button className={styles.opHeader} onClick={() => toggle(i)}>
                <span className={styles.chevron}>{isOpen ? '\u25BE' : '\u25B8'}</span>
                {method.name}
                <span style={{ fontSize: '0.65rem', color: '#c9a830', marginLeft: 'auto', flexShrink: 0 }}>
                  {method.marks}
                </span>
              </button>
              {isOpen && (
                <div className={styles.opBody}>
                  {onBack && i === linkedIdx && (
                    <button className={styles.backBtnInline} onClick={onBack}>&larr; Back to City</button>
                  )}
                  <p style={{ fontSize: '0.78rem', color: '#b0b8c0', margin: 0 }}>{method.description}</p>
                  <div>
                    <span className={styles.subLabel}>Requirements</span>
                    <ul className={styles.list}>
                      {method.requirements.map((r, j) => <li key={j}>{r}</li>)}
                    </ul>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#8899aa' }}>
                    {method.repeatable ? 'Repeatable' : 'One-time only'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
