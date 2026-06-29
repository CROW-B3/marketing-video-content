import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';

// Deep, dimensional data-space: near-black with soft volumetric violet ambient,
// drifting blurred bokeh at varying depths, and a heavy vignette. Atmosphere
// for the cinematic "behind the scenes" — depth, not a flat canvas.
const BOKEH = Array.from({ length: 16 }, (_, i) => ({
  x: random(`bx${i}`) * 1920,
  y: random(`by${i}`) * 1080,
  r: random(`br${i}`) * 80 + 26,
  blur: random(`bl${i}`) * 34 + 16,
  op: random(`bo${i}`) * 0.06 + 0.015,
  drift: random(`bd${i}`) * 0.28 + 0.06,
  hue: random(`bh${i}`) > 0.5 ? '#8b5cf6' : '#7a5bd6',
}));

export const DepthField: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: '#040409', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: '34%', top: '30%', width: 1200, height: 1200, transform: 'translate(-50%, -50%)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.13), transparent 60%)', filter: 'blur(46px)' }} />
      <div style={{ position: 'absolute', left: '74%', top: '64%', width: 1000, height: 1000, transform: 'translate(-50%, -50%)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,79,214,0.10), transparent 60%)', filter: 'blur(54px)' }} />
      {BOKEH.map((b, i) => {
        const y = ((b.y + frame * b.drift) % 1160) - 40;
        return <div key={i} style={{ position: 'absolute', left: b.x, top: y, width: b.r, height: b.r, borderRadius: '50%', background: b.hue, opacity: b.op, filter: `blur(${b.blur}px)` }} />;
      })}
      <AbsoluteFill style={{ background: 'radial-gradient(78% 66% at 50% 50%, transparent 42%, rgba(0,0,0,0.72) 100%)' }} />
    </AbsoluteFill>
  );
};
