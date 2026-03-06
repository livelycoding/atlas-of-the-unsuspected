import { useState, useRef, useCallback } from 'react';
import { locations } from '../data/locations';
import { mapPositions } from '../data/mapPositions';

// Cell dimensions as percentage of container
const CONTAINER_W = 1100;
const CONTAINER_H = CONTAINER_W * 570 / 1024;
const CELL_W_PX = 90;
const CELL_H_PX = 54;
const CELL_W = (CELL_W_PX / CONTAINER_W) * 100; // ~8.18%
const CELL_H = (CELL_H_PX / CONTAINER_H) * 100; // ~8.82%
const PAD = 0.3; // extra padding between cells (%)

interface Pos { x: number; y: number }

const allLocs = locations.map(l => ({ id: l.id, name: l.name }));

function getInitialPositions(): Record<string, Pos> {
  const out: Record<string, Pos> = {};
  for (const loc of allLocs) {
    const p = mapPositions[loc.id];
    if (p) out[loc.id] = { x: p.x, y: p.y };
  }
  return out;
}

function overlaps(a: Pos, b: Pos): { ox: number; oy: number } | null {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  const minDx = CELL_W + PAD;
  const minDy = CELL_H + PAD;
  if (dx < minDx && dy < minDy) {
    return { ox: minDx - dx, oy: minDy - dy };
  }
  return null;
}

function step(
  positions: Record<string, Pos>,
  origins: Record<string, Pos>,
  pinned: Set<string>,
  dt: number,
): { positions: Record<string, Pos>; totalOverlap: number } {
  const ids = Object.keys(positions);
  const forces: Record<string, Pos> = {};
  for (const id of ids) forces[id] = { x: 0, y: 0 };

  let totalOverlap = 0;

  // Repulsion from overlapping pairs
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i], b = ids[j];
      const pa = positions[a], pb = positions[b];
      const ol = overlaps(pa, pb);
      if (!ol) continue;
      totalOverlap += ol.ox + ol.oy;

      if (ol.ox < ol.oy) {
        const sign = pa.x < pb.x ? -1 : 1;
        const push = ol.ox * 0.5;
        // If one is pinned, the other gets the full push
        if (pinned.has(a) && pinned.has(b)) continue;
        if (pinned.has(a)) {
          forces[b].x -= sign * push * 2;
        } else if (pinned.has(b)) {
          forces[a].x += sign * push * 2;
        } else {
          forces[a].x += sign * push;
          forces[b].x -= sign * push;
        }
      } else {
        const sign = pa.y < pb.y ? -1 : 1;
        const push = ol.oy * 0.5;
        if (pinned.has(a) && pinned.has(b)) continue;
        if (pinned.has(a)) {
          forces[b].y -= sign * push * 2;
        } else if (pinned.has(b)) {
          forces[a].y += sign * push * 2;
        } else {
          forces[a].y += sign * push;
          forces[b].y -= sign * push;
        }
      }
    }
  }

  // Spring back toward origin (weaker than repulsion)
  const springK = 0.08;
  for (const id of ids) {
    if (pinned.has(id)) continue;
    const p = positions[id], o = origins[id];
    forces[id].x += (o.x - p.x) * springK;
    forces[id].y += (o.y - p.y) * springK;
  }

  // Apply forces (skip pinned)
  const next: Record<string, Pos> = {};
  for (const id of ids) {
    if (pinned.has(id)) {
      next[id] = positions[id];
    } else {
      next[id] = {
        x: Math.max(CELL_W / 2, Math.min(100 - CELL_W / 2, positions[id].x + forces[id].x * dt)),
        y: Math.max(CELL_H / 2, Math.min(100 - CELL_H / 2, positions[id].y + forces[id].y * dt)),
      };
    }
  }

  return { positions: next, totalOverlap };
}

export function CollisionResolver({ onDone }: { onDone: () => void }) {
  const [positions, setPositions] = useState(getInitialPositions);
  const [running, setRunning] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [overlap, setOverlap] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pinned, setPinned] = useState<Set<string>>(new Set());
  const originsRef = useRef(getInitialPositions());
  const posRef = useRef(positions);
  const runningRef = useRef(false);
  const pinnedRef = useRef(pinned);
  const mapRef = useRef<HTMLDivElement>(null);

  posRef.current = positions;
  pinnedRef.current = pinned;

  const tick = useCallback(() => {
    if (!runningRef.current) return;
    const stepsPerFrame = 3;
    let cur = posRef.current;
    let lastOverlap = 0;
    for (let s = 0; s < stepsPerFrame; s++) {
      const result = step(cur, originsRef.current, pinnedRef.current, 1);
      cur = result.positions;
      lastOverlap = result.totalOverlap;
    }
    posRef.current = cur;
    setPositions(cur);
    setIteration(i => i + stepsPerFrame);
    setOverlap(lastOverlap);

    if (lastOverlap < 0.01) {
      runningRef.current = false;
      setRunning(false);
      return;
    }
    requestAnimationFrame(tick);
  }, []);

  const handleStart = () => {
    runningRef.current = true;
    setRunning(true);
    requestAnimationFrame(tick);
  };

  const handleStop = () => {
    runningRef.current = false;
    setRunning(false);
  };

  const handleReset = () => {
    runningRef.current = false;
    setRunning(false);
    const init = getInitialPositions();
    setPositions(init);
    posRef.current = init;
    setIteration(0);
    setOverlap(0);
    setSelectedId(null);
    setPinned(new Set());
  };

  const handleCopy = () => {
    const rounded: Record<string, Pos> = {};
    for (const [id, p] of Object.entries(positions)) {
      rounded[id] = { x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10 };
    }
    navigator.clipboard.writeText(JSON.stringify(rounded, null, 2));
  };

  // Click a cell to select it; click again to deselect
  const handleCellClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(prev => prev === id ? null : id);
  };

  // Right-click a cell to pin/unpin
  const handleCellRightClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPinned(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Click on the map background to move the selected cell there
  const handleMapClick = (e: React.MouseEvent) => {
    if (!selectedId || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
    const clamped = {
      x: Math.max(CELL_W / 2, Math.min(100 - CELL_W / 2, x)),
      y: Math.max(CELL_H / 2, Math.min(100 - CELL_H / 2, y)),
    };
    setPositions(prev => ({ ...prev, [selectedId]: clamped }));
    posRef.current = { ...posRef.current, [selectedId]: clamped };
    // Also update origin so spring pulls toward new position
    originsRef.current = { ...originsRef.current, [selectedId]: clamped };
    // Auto-pin manually placed nodes
    setPinned(prev => new Set(prev).add(selectedId));
    setSelectedId(null);
  };

  // Count current overlaps
  const ids = Object.keys(positions);
  let overlapCount = 0;
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      if (overlaps(positions[ids[i]], positions[ids[j]])) overlapCount++;
    }
  }

  const selectedName = selectedId ? allLocs.find(l => l.id === selectedId)?.name : null;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, color: '#c9a830', fontSize: '1rem' }}>
        <span>Iter: {iteration} | Overlaps: {overlapCount} | Energy: {overlap.toFixed(1)} | Pinned: {pinned.size}</span>
        {!running ? (
          <button onClick={handleStart} style={btnStyle('#2a6')}>Start</button>
        ) : (
          <button onClick={handleStop} style={btnStyle('#a62')}>Pause</button>
        )}
        <button onClick={handleReset} style={btnStyle('#555')}>Reset</button>
        <button onClick={handleCopy} style={btnStyle('#26a')}>Copy JSON</button>
        <button onClick={onDone} style={{ ...btnStyle('#833'), marginLeft: 'auto' }}>Close</button>
      </div>
      <div style={{ marginBottom: 8, color: '#8899aa', fontSize: 12 }}>
        {selectedName
          ? <span>Click on the map to place <strong style={{ color: '#fff' }}>{selectedName}</strong> — or click another cell to switch</span>
          : <span>Click a cell to select it, then click the map to move it. Right-click to pin/unpin.</span>
        }
      </div>

      <div
        ref={mapRef}
        onClick={handleMapClick}
        style={{
          position: 'relative',
          width: CONTAINER_W,
          aspectRatio: '1024 / 570',
          backgroundImage: 'url(/exile-map.png)',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          borderRadius: 4,
          cursor: selectedId ? 'crosshair' : 'default',
        }}
      >
        {allLocs.map(loc => {
          const pos = positions[loc.id];
          if (!pos) return null;
          const orig = originsRef.current[loc.id];
          const isSelected = selectedId === loc.id;
          const isPinned = pinned.has(loc.id);
          const hasOverlap = ids.some(
            other => other !== loc.id && positions[other] && overlaps(pos, positions[other])
          );

          let bg: string;
          if (isSelected) bg = 'rgba(50,120,220,0.7)';
          else if (isPinned) bg = hasOverlap ? 'rgba(180,80,30,0.7)' : 'rgba(30,100,140,0.6)';
          else if (hasOverlap) bg = 'rgba(200,50,50,0.6)';
          else bg = 'rgba(50,150,80,0.6)';

          let border: string;
          if (isSelected) border = '2px solid #6af';
          else if (isPinned) border = '2px solid #4cc';
          else border = `1px solid ${hasOverlap ? '#f66' : '#4a8'}`;

          return (
            <div key={loc.id}>
              {/* Ghost showing original position */}
              {orig && (
                <div style={{
                  position: 'absolute',
                  left: `${orig.x}%`, top: `${orig.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: CELL_W_PX, height: CELL_H_PX,
                  border: '1px dashed rgba(255,255,255,0.15)',
                  borderRadius: 3,
                  pointerEvents: 'none',
                }} />
              )}
              {/* Actual cell */}
              <div
                onClick={(e) => handleCellClick(loc.id, e)}
                onContextMenu={(e) => handleCellRightClick(loc.id, e)}
                style={{
                  position: 'absolute',
                  left: `${pos.x}%`, top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: CELL_W_PX, height: CELL_H_PX,
                  background: bg,
                  border,
                  borderRadius: 3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, color: '#fff', textAlign: 'center',
                  cursor: 'pointer',
                  zIndex: isSelected ? 10 : 1,
                  userSelect: 'none',
                }}>
                {isPinned && <span style={{ position: 'absolute', top: -1, right: 2, fontSize: 9, color: '#4cc' }}>P</span>}
                {loc.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function btnStyle(bg: string): React.CSSProperties {
  return { background: bg, color: '#fff', border: 'none', padding: '5px 14px', borderRadius: 3, cursor: 'pointer', fontWeight: 600, fontSize: 13 };
}
