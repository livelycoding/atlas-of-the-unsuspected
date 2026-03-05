import { connections, edgeConnections } from '../data/connections';
import styles from './ConnectionLines.module.css';

interface Props {
  cellPositions: Map<string, { x: number; y: number }>;
  selectedId: string | null;
}

export function ConnectionLines({ cellPositions, selectedId }: Props) {
  if (cellPositions.size === 0) return null;

  const allConnections = [...connections, ...edgeConnections];

  return (
    <svg className={styles.svg}>
      {allConnections.map(conn => {
        const from = cellPositions.get(conn.from);
        const to = cellPositions.get(conn.to);
        if (!from || !to) return null;

        const isHighlighted = selectedId === conn.from || selectedId === conn.to;
        const isEdge = edgeConnections.includes(conn);

        return (
          <line
            key={`${conn.from}-${conn.to}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            className={`${styles.line} ${isHighlighted ? styles.highlighted : ''} ${isEdge ? styles.edgeLine : ''}`}
          />
        );
      })}
    </svg>
  );
}
