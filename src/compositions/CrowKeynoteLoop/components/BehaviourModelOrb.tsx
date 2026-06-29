import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SPRING } from '../../../design';
import { LightStream } from './LightStream';

// The "one behaviour model" — three signal-streams flow in and weave into ONE
// luminous liquid-glass orb: specular sheen drifting across the surface (Apple
// "Liquid Glass"), a breathing core, soft depth. Replaces the flat braid panel.
const ACCENT = '#8b5cf6';
const ACCENT_LIGHT = '#c4b5fd';
const CX = 960;
const CY = 497;
const SIZE = 300;
const SRC = [
  { x: 430, y: 286, bend: 70 },
  { x: 1500, y: 320, bend: -70 },
  { x: 980, y: 854, bend: 60 },
];

function ramp(f: number, a: number, b: number): number {
  return interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}

export const BehaviourModelOrb: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const formed = ramp(f, appearAt + 28, appearAt + 58);
  const settle = spring({ frame: f - (appearAt + 30), fps, config: SPRING.gentle });
  const scale = interpolate(settle, [0, 1], [0.72, 1]) * (1 + Math.sin(f * 0.06) * 0.018 * formed);
  const bodyOp = ramp(f, appearAt + 18, appearAt + 44);
  const glow = 0.45 + 0.45 * formed + Math.sin(f * 0.05) * 0.1 * formed;
  const spec = f * 0.022;
  const specX = Math.cos(spec) * 36;
  const specY = Math.sin(spec * 1.3) * 28;
  const coreP = 0.6 + 0.4 * Math.sin(f * 0.08);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* three signals streaming in */}
      {SRC.map((s, i) => (
        <LightStream key={i} from={{ x: s.x, y: s.y }} to={{ x: CX, y: CY }} bend={s.bend} start={appearAt + i * 4} dur={36} frame={f} depth={0.9} />
      ))}

      <div style={{ position: 'absolute', left: CX, top: CY, width: SIZE, height: SIZE, marginLeft: -SIZE / 2, marginTop: -SIZE / 2, transform: `scale(${scale})`, opacity: bodyOp }}>
        {/* outer glow */}
        <div style={{ position: 'absolute', inset: -70, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT}55, transparent 64%)`, filter: 'blur(34px)', opacity: glow }} />
        {/* glass body */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `radial-gradient(circle at 38% 30%, rgba(255,255,255,0.55), ${ACCENT_LIGHT}cc 28%, ${ACCENT} 58%, #271548 86%)`,
            boxShadow: `inset 0 0 60px rgba(255,255,255,0.18), inset -22px -26px 70px ${ACCENT}99, 0 0 ${70 * glow}px ${ACCENT}aa`,
            border: '1px solid rgba(255,255,255,0.16)',
          }}
        />
        {/* drifting specular highlight (liquid glass) */}
        <div style={{ position: 'absolute', left: '28%', top: '22%', width: '36%', height: '27%', transform: `translate(${specX}px, ${specY}px)`, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.92), transparent 70%)', filter: 'blur(7px)' }} />
        {/* secondary sheen */}
        <div style={{ position: 'absolute', left: '58%', top: '64%', width: '22%', height: '16%', transform: `translate(${-specX * 0.6}px, ${-specY * 0.6}px)`, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT_LIGHT}cc, transparent 70%)`, filter: 'blur(8px)' }} />
        {/* breathing core */}
        <div style={{ position: 'absolute', inset: '35%', borderRadius: '50%', background: `radial-gradient(circle, #ffffff, ${ACCENT_LIGHT} 58%, transparent)`, opacity: coreP * formed, filter: 'blur(5px)' }} />
        {/* rim light */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: `inset 0 2px 1px rgba(255,255,255,0.5)`, opacity: 0.6 }} />
      </div>
    </AbsoluteFill>
  );
};
