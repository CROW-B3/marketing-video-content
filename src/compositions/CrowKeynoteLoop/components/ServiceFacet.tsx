import React from 'react';
import { FONT } from '../../../design';

const ACCENT_LIGHT = '#c4b5fd';

// A soft frosted-glass facet floating in depth. Rack-focuses from blurred to
// sharp as the light reaches it; a minimal label + count fade in. `depth` sets
// its parallax scale; `active` (0..1) its focus + glow.
export const ServiceFacet: React.FC<{
  x: number;
  y: number;
  depth: number;
  label: string;
  sub: string;
  count: string;
  active: number;
}> = ({ x, y, depth, label, sub, count, active }) => {
  const blur = (1 - active) * 9 * depth;
  const op = (0.35 + active * 0.65) * (0.6 + depth * 0.4);
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${depth})`, opacity: op, filter: blur > 0.2 ? `blur(${blur}px)` : undefined, pointerEvents: 'none' }}>
      <div
        style={{
          width: 196,
          padding: '16px 20px',
          borderRadius: 18,
          background: `linear-gradient(160deg, rgba(255,255,255,${0.05 + active * 0.05}), rgba(255,255,255,0.015))`,
          border: `1px solid rgba(255,255,255,${0.08 + active * 0.22})`,
          boxShadow: active > 0.04
            ? `0 0 ${40 * active}px ${ACCENT_LIGHT}40, inset 0 1px 0 rgba(255,255,255,0.1), 0 24px 60px -24px #000`
            : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 60px -28px #000',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: active > 0.4 ? ACCENT_LIGHT : '#454552', boxShadow: active > 0.4 ? `0 0 10px ${ACCENT_LIGHT}` : 'none' }} />
          <span style={{ fontFamily: FONT.family, fontSize: 21, fontWeight: 600, color: '#f5f5f7' }}>{label}</span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: '#82828f', marginTop: 5 }}>{sub}</div>
        <div style={{ height: active > 0.5 ? 'auto' : 0, overflow: 'hidden', opacity: Math.max(0, (active - 0.5) * 2) }}>
          <div style={{ fontFamily: FONT.family, fontSize: 15, fontWeight: 700, color: ACCENT_LIGHT, marginTop: 9 }}>{count}</div>
        </div>
      </div>
    </div>
  );
};
