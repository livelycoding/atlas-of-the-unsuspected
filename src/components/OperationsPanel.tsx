import { useState, useEffect, useRef, useCallback } from 'react';
import { operations } from '../data/operations';
import styles from './OperationsPanel.module.css';

interface Props {
  onClose: () => void;
  initialOperation?: string | null;
  onClearInitial?: () => void;
  onBack?: () => void;
}

export function OperationsPanel({ onClose, initialOperation, onClearInitial, onBack }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [linkedIdx, setLinkedIdx] = useState<number | null>(null);
  const opRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = useCallback((i: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!initialOperation) return;
    const idx = operations.findIndex(op => op.name === initialOperation);
    if (idx === -1) return;
    setExpanded(prev => new Set(prev).add(idx));
    setLinkedIdx(idx);
    requestAnimationFrame(() => {
      opRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    onClearInitial?.();
  }, [initialOperation, onClearInitial]);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>&larr; Back to City</button>
          )}
          <h2 className={styles.title}>Operations Quick Reference</h2>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
      </div>
      <div className={styles.operations}>
        {operations.map((op, i) => {
          const isOpen = expanded.has(i);
          return (
            <div key={i} className={styles.operation} ref={el => { opRefs.current[i] = el; }}>
              <button className={styles.opHeader} onClick={() => toggle(i)}>
                <span className={styles.chevron}>{isOpen ? '\u25BE' : '\u25B8'}</span>
                {op.name}
              </button>
              {isOpen && (
                <div className={styles.opBody}>
                  {onBack && i === linkedIdx && (
                    <button className={styles.backBtnInline} onClick={onBack}>&larr; Back to City</button>
                  )}
                  <div>
                    <span className={styles.subLabel}>Requirements</span>
                    <ul className={styles.list}>
                      {op.requirements.map((r, j) => <li key={j}>{r}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className={styles.subLabel}>Challenges</span>
                    <div className={styles.challenges}>
                      {op.challenges.map((c, j) => (
                        <div key={j} className={styles.challenge}>
                          <span className={styles.challengeLevel}>{c.level}</span>
                          {c.aspects}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className={styles.subLabel}>Rewards</span>
                    <ul className={styles.list}>
                      {op.rewards.map((r, j) => <li key={j}>{r}</li>)}
                    </ul>
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
