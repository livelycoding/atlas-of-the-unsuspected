import { connections, edgeConnections, directedConnections } from '../data/connections';
import styles from './ConnectionLines.module.css';

interface Props {
  cellPositions: Map<string, { x: number; y: number }>;
  selectedId: string | null;
  removedIds: Set<string>;
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

export function ConnectionLines({ cellPositions, selectedId, removedIds }: Props) {
  if (cellPositions.size === 0) return null;

  const allConnections = [...connections, ...directedConnections, ...edgeConnections];

  return (
    <svg className={styles.svg}>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="2"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="rgba(201, 168, 48, 0.85)" />
        </marker>
        <marker
          id="arrowhead-highlighted"
          markerWidth="8"
          markerHeight="6"
          refX="2"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="rgba(201, 168, 48, 0.9)" />
        </marker>
      </defs>
      {allConnections.map(conn => {
        const from = cellPositions.get(conn.from);
        const to = cellPositions.get(conn.to);
        if (!from || !to) return null;
        if (removedIds.has(conn.from) || removedIds.has(conn.to)) return null;

        const isHighlighted = selectedId === conn.from || selectedId === conn.to;
        const isEdge = edgeConnections.includes(conn);
        const isDirected = directedConnections.includes(conn);
        const ratio = isEdge ? 0.2 : isDirected ? 0.35 : 0.45;
        const [sx1, sy1, sx2, sy2] = shorten(from.x, from.y, to.x, to.y, ratio);

        return (
          <g key={`${conn.from}-${conn.to}`}>
            {/* Dark outline for contrast */}
            <line
              x1={sx1} y1={sy1} x2={sx2} y2={sy2}
              className={`${styles.outline} ${isEdge ? styles.edgeLine : ''} ${isDirected ? styles.directedLine : ''}`}
            />
            {/* Visible line */}
            <line
              x1={sx1} y1={sy1} x2={sx2} y2={sy2}
              className={`${styles.line} ${isHighlighted ? styles.highlighted : ''} ${isEdge ? styles.edgeLine : ''} ${isDirected ? styles.directedLine : ''}`}
              markerEnd={isDirected ? `url(#arrowhead${isHighlighted ? '-highlighted' : ''})` : undefined}
            />
          </g>
        );
      })}
    </svg>
  );
}
