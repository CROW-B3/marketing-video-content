import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { NoiseOverlay } from './reel-shared';
import {
  ACCENT,
  CENTER,
  clamp,
  lerp,
  loop01,
  loopCos,
  loopWave,
  TOTAL,
} from './booth-shared';

// ════════════════════════════════════════════════════════════════════════════
//  Cinematic VFX layer — energy streaks, god-rays, shockwave, colour grade.
// ════════════════════════════════════════════════════════════════════════════

// ─── Energy streaks (the 3 → 1 money-shot, light-trail style) ────────────────

interface EStreak {
  startX: number;
  startY: number;
  color: string;
  delay: number;
  curve: number;
}

function buildEStreaks(seed: string): EStreak[] {
  const lanes = [
    { y: 300, color: ACCENT.web },
    { y: 540, color: ACCENT.cctv },
    { y: 780, color: ACCENT.social },
  ];
  const perLane = 22;
  const out: EStreak[] = [];
  for (let l = 0; l < 3; l++) {
    for (let i = 0; i < perLane; i++) {
      out.push({
        startX: 150 + random(`${seed}-sx-${l}-${i}`) * 940,
        startY: lanes[l]!.y + (random(`${seed}-sy-${l}-${i}`) - 0.5) * 86,
        color: lanes[l]!.color,
        delay: random(`${seed}-dl-${l}-${i}`) * 30,
        curve: (random(`${seed}-cv-${l}-${i}`) - 0.5) * 260,
      });
    }
  }
  return out;
}

const eStreakCache = new Map<string, EStreak[]>();
function getEStreaks(seed: string): EStreak[] {
  let s = eStreakCache.get(seed);
  if (!s) {
    s = buildEStreaks(seed);
    eStreakCache.set(seed, s);
  }
  return s;
}

export const EnergyStreaks: React.FC<{ start: number; end: number; seed?: string }> = ({
  start,
  end,
  seed = 'estreak',
}) => {
  const frame = useCurrentFrame();
  const streaks = getEStreaks(seed);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {streaks.map((s, i) => {
        const span = end - (start + s.delay);
        const t = clamp((frame - (start + s.delay)) / span, 0, 1);
        if (t <= 0) return null;
        const posAt = (u: number): { x: number; y: number } => {
          const e = u * u * (3 - 2 * u);
          return {
            x: lerp(s.startX, CENTER.x, e) + Math.sin(e * Math.PI) * s.curve,
            y: lerp(s.startY, CENTER.y, e) + Math.sin(e * Math.PI) * s.curve * 0.4,
          };
        };
        const p1 = posAt(t);
        const p0 = posAt(Math.max(0, t - 0.06));
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const len = Math.min(190, Math.hypot(dx, dy) * 2.3 + 10);
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
        const toCore = clamp((t - 0.5) / 0.5, 0, 1);
        const col = t > 0.9 ? '#ffffff' : toCore > 0.15 ? ACCENT.core : s.color;
        const op = interpolate(t, [0, 0.1, 0.92, 1], [0, 1, 1, 0]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p1.x,
              top: p1.y,
              width: len,
              height: t > 0.7 ? 3 : 2,
              transform: `translate(-100%, -50%) rotate(${ang}deg)`,
              transformOrigin: '100% 50%',
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${col})`,
              boxShadow: `0 0 ${8 + 12 * toCore}px ${col}`,
              opacity: op,
              mixBlendMode: 'screen',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── God-ray burst from a point ──────────────────────────────────────────────

export const LightRays: React.FC<{
  cx: number;
  cy: number;
  intensity: number;
  size?: number;
  color?: string;
}> = ({ cx, cy, intensity, size = 1500, color = '#cfe0ff' }) => {
  const frame = useCurrentFrame();
  if (intensity <= 0.001) return null;
  const rot = loopWave(frame, 1) * 7;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: cy,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) rotate(${rot}deg)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        opacity: clamp(intensity, 0, 1),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `repeating-conic-gradient(from 0deg, ${color}55 0deg, transparent 2.6deg, transparent 11deg)`,
          maskImage: 'radial-gradient(circle, black 0%, transparent 62%)',
          WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 62%)',
          filter: 'blur(3px)',
        }}
      />
    </div>
  );
};

// ─── Shockwave rings ─────────────────────────────────────────────────────────

export const Shockwave: React.FC<{
  cx: number;
  cy: number;
  start: number;
  color?: string;
  maxR?: number;
}> = ({ cx, cy, start, color = '#ffffff', maxR = 560 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {[0, 9].map((off, i) => {
        const p = interpolate(frame, [start + off, start + off + 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        if (p <= 0 || p >= 1) return null;
        const r = p * maxR;
        const op = interpolate(p, [0, 0.15, 1], [0, 0.6, 0]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx,
              top: cy,
              width: r * 2,
              height: r * 2,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: `${3 * (1 - p) + 1}px solid ${color}`,
              boxShadow: `0 0 26px ${color}, inset 0 0 26px ${color}`,
              opacity: op,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </>
  );
};

// ─── Global cinematic grade (light leaks · chromatic edge · grain) ───────────

export const CinematicGrade: React.FC = () => {
  const frame = useCurrentFrame();
  const leakA = loop01(frame, 1) * 0.04 + 0.03;
  const leakB = loop01(frame, 1, TOTAL, 2.1) * 0.04 + 0.03;
  return (
    <>
      {/* drifting light leaks */}
      <AbsoluteFill style={{ mixBlendMode: 'screen', pointerEvents: 'none', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            left: `${-12 + loopWave(frame, 1) * 4}%`,
            top: '-16%',
            width: 980,
            height: 980,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,120,80,0.55), transparent 60%)',
            opacity: leakA,
            filter: 'blur(46px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: `${-14 + loopCos(frame, 1) * 4}%`,
            bottom: '-20%',
            width: 1080,
            height: 1080,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(80,150,255,0.55), transparent 60%)',
            opacity: leakB,
            filter: 'blur(46px)',
          }}
        />
      </AbsoluteFill>
      {/* chromatic-edge aberration */}
      <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: 0.5 }}>
        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 7px 0 70px -22px rgba(255,0,90,0.6), inset -7px 0 70px -22px rgba(0,200,255,0.6), inset 0 8px 70px -22px rgba(120,90,255,0.5)' }} />
      </AbsoluteFill>
      {/* fine film grain */}
      <NoiseOverlay id="grade-grain" />
    </>
  );
};
