import { connections, edgeConnections } from '../data/connections';
import styles from './ConnectionLines.module.css';

interface Props {
  cellPositions: Map<string, { x: number; y: number }>;
  selectedId: string | null;
}

// Shorten a line by a percentage from each end (0.15 = 15% trimmed from each side)
function shorten(
  x1: number, y1: number, x2: number, y2: number, ratio: number
): [number, number, number, number] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return [
    x1 + dx * ratio,
    y1 + dy * ratio,
    x2 - dx * ratio,
    y2 - dy * ratio,
  ];
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
        const [sx1, sy1, sx2, sy2] = isEdge
          ? shorten(from.x, from.y, to.x, to.y, 0.2)
          : shorten(from.x, from.y, to.x, to.y, 0.3);

        return (
          <g key={`${conn.from}-${conn.to}`}>
            {/* Dark outline for contrast */}
            <line
              x1={sx1} y1={sy1} x2={sx2} y2={sy2}
              className={`${styles.outline} ${isEdge ? styles.edgeLine : ''}`}
            />
            {/* Visible line */}
            <line
              x1={sx1} y1={sy1} x2={sx2} y2={sy2}
              className={`${styles.line} ${isHighlighted ? styles.highlighted : ''} ${isEdge ? styles.edgeLine : ''}`}
            />
          </g>
        );
      })}
    </svg>
  );
}
