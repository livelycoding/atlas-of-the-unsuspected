import { useState, useRef, useEffect, useMemo } from 'react';
import { locations } from '../data/locations';
import styles from './OpportunitySearch.module.css';

interface Props {
  terms: string[];
  onSearch: (terms: string[]) => void;
}

const MAX_TERMS = 3;

export function OpportunitySearch({ terms, onSearch }: Props) {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allOptions = useMemo(() => {
    const set = new Set<string>();
    for (const loc of locations) {
      const o = loc.opportunities;
      for (const s of o.connections) set.add(s);
      for (const s of o.property) set.add(s);
      for (const s of o.items) set.add(s);
      for (const s of o.times) set.add(s);
      for (const s of o.distractions) set.add(s);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, []);

  const filtered = useMemo(() => {
    if (!input) return allOptions.filter(o => !terms.includes(o));
    const lower = input.toLowerCase();
    return allOptions.filter(
      o => !terms.includes(o) && o.toLowerCase().includes(lower)
    );
  }, [input, allOptions, terms]);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Reset highlight when filtered list changes
  useEffect(() => {
    setHighlighted(0);
  }, [filtered]);

  function addTerm(term: string) {
    if (terms.length < MAX_TERMS && !terms.includes(term)) {
      onSearch([...terms, term]);
    }
    setInput('');
    setOpen(false);
    inputRef.current?.focus();
  }

  function removeTerm(term: string) {
    onSearch(terms.filter(t => t !== term));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, filtered.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered.length > 0) {
        addTerm(filtered[highlighted]);
      }
    }
  }

  const isFull = terms.length >= MAX_TERMS;

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.inputRow}>
        {!isFull && (
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Search for Opportunities and Weaknesses..."
            value={input}
            onChange={e => { setInput(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
          />
        )}
        {isFull && (
          <span className={styles.input} style={{ opacity: 0.5, fontSize: '0.68rem' }}>
            Max {MAX_TERMS} filters
          </span>
        )}
      </div>
      {open && !isFull && (
        <div className={styles.dropdown}>
          {filtered.length === 0 && (
            <div className={styles.noResults}>No matching opportunities</div>
          )}
          {filtered.map((opt, i) => (
            <div
              key={opt}
              className={`${styles.option} ${i === highlighted ? styles.optionHighlighted : ''}`}
              onMouseDown={e => { e.preventDefault(); addTerm(opt); }}
              onMouseEnter={() => setHighlighted(i)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
      {terms.length > 0 && (
        <div className={styles.chips}>
          {terms.map(t => (
            <span key={t} className={styles.chip}>
              {t}
              <button className={styles.chipRemove} onClick={() => removeTerm(t)}>
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
