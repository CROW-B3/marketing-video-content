import React from 'react';

export interface Pt {
  x: number;
  y: number;
}

function qbez(p0: Pt, p1: Pt, p2: Pt, t: number): Pt {
  const u = 1 - t;
  return { x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x, y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y };
}
function qlen(p0: Pt, p1: Pt, p2: Pt): number {
  return Math.hypot(p1.x - p0.x, p1.y - p0.y) + Math.hypot(p2.x - p1.x, p2.y - p1.y);
}
function smooth(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}
function ctrlOf(from: Pt, to: Pt, bend: number): Pt {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: mx + (-dy / len) * bend, y: my + (dx / len) * bend };
}

// A beam of light drawing along a curve with a bright traveling head + soft
// glow. width/opacity scale with `depth` (parallax). Set `reverse` for the
// returning beam.
export const LightStream: React.FC<{
  from: Pt;
  to: Pt;
  bend: number;
  start: number;
  dur: number;
  frame: number;
  depth?: number;
  color?: string;
  reverse?: boolean;
}> = ({ from, to, bend, start, dur, frame, depth = 1, color = '#c4b5fd', reverse = false }) => {
  if (frame < start) return null;
  const a = reverse ? to : from;
  const b = reverse ? from : to;
  const ctrl = ctrlOf(a, b, reverse ? -bend : bend);
  const prog = smooth((frame - start) / dur);
  const len = qlen(a, ctrl, b);
  const head = qbez(a, ctrl, b, prog);
  const path = `M${a.x},${a.y} Q${ctrl.x},${ctrl.y} ${b.x},${b.y}`;
  const w = 1.2 * depth;
  const drawn = prog >= 0.999;
  const fade = reverse ? (1 - smooth((frame - (start + dur)) / 26)) : 1;
  return (
    <>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <path d={path} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" opacity={(drawn ? 0.28 : 0.55) * depth * fade} strokeDasharray={len} strokeDashoffset={len * (1 - prog)} style={{ filter: `drop-shadow(0 0 ${5 * depth}px ${color})` }} />
      </svg>
      {prog < 0.999 && (
        <div style={{ position: 'absolute', left: head.x, top: head.y, width: 9 * depth, height: 9 * depth, marginLeft: -4.5 * depth, marginTop: -4.5 * depth, borderRadius: '50%', background: '#fff', boxShadow: `0 0 ${10 * depth}px ${color}, 0 0 ${22 * depth}px ${color}, 0 0 ${40 * depth}px ${color}88`, opacity: depth }} />
      )}
    </>
  );
};
