import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  COLORS,
  FONTS,
  FPS,
  NoiseOverlay,
  ScanLines,
  Vignette,
  glassCard,
  glassChip,
} from './reel-shared';

// ════════════════════════════════════════════════════════════════════════════
//  CROW BOOTH LOOP — shared toolkit
//  Everything here is engineered for a SEAMLESS 960-frame (32s) loop:
//  every high-contrast ambient oscillation is driven by loopWave() with an
//  INTEGER cycle count over TOTAL, so phase AND velocity match at frame 0/960.
// ════════════════════════════════════════════════════════════════════════════

export const TOTAL = 960;
export const CENTER = { x: 960, y: 540 } as const;

export const ACCENT = {
  web: '#8b5cf6',
  cctv: '#00d4ff',
  social: '#ff2d55',
  core: '#a855f7',
  text: '#ffffff',
  muted: '#a0a0b8',
} as const;

// ─── Math helpers ─────────────────────────────────────────────────────────────

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Loop-locked sine. With an INTEGER `cycles` over `total`, the value AND its
 * derivative are identical at frame 0 and frame `total` for ANY phase — so it
 * is safe to use for high-contrast motion right across the loop seam.
 */
export function loopWave(frame: number, cycles: number, total = TOTAL, phase = 0): number {
  return Math.sin((frame / total) * cycles * Math.PI * 2 + phase);
}

export function loopCos(frame: number, cycles: number, total = TOTAL, phase = 0): number {
  return Math.cos((frame / total) * cycles * Math.PI * 2 + phase);
}

/** Loop-locked oscillation remapped to 0..1. */
export function loop01(frame: number, cycles: number, total = TOTAL, phase = 0): number {
  return (loopWave(frame, cycles, total, phase) + 1) / 2;
}

export function formatNum(n: number): string {
  return Math.floor(n).toLocaleString('en-US');
}

/** Fade envelope: 0 → 1 → 0 with eased edges, in global-frame space. */
export function envelope(
  frame: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
): number {
  return (
    interpolate(frame, [inStart, inEnd], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    * interpolate(frame, [outStart, outEnd], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  );
}

// ─── Wide loop-locked starfield (1920×1080) ──────────────────────────────────

const STAR_COUNT = 220;

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twPhase: number;
  twSpeed: number;
  driftAmp: number;
  color: string;
}

function buildStars(seed: string): Star[] {
  return Array.from({ length: STAR_COUNT }, (_, i) => {
    const c = random(`${seed}-c-${i}`);
    let color = '#ffffff';
    if (c > 0.9) color = ACCENT.social;
    else if (c > 0.8) color = ACCENT.web;
    else if (c > 0.72) color = ACCENT.cctv;
    return {
      x: random(`${seed}-x-${i}`) * 1920,
      y: random(`${seed}-y-${i}`) * 1080,
      size: random(`${seed}-s-${i}`) * 2.4 + 0.4,
      baseOpacity: random(`${seed}-o-${i}`) * 0.5 + 0.12,
      twPhase: random(`${seed}-tp-${i}`) * Math.PI * 2,
      twSpeed: random(`${seed}-ts-${i}`) * 0.06 + 0.05,
      driftAmp: random(`${seed}-d-${i}`) * 10 + 4,
      color,
    };
  });
}

const starCache = new Map<string, Star[]>();
function getStars(seed: string): Star[] {
  let s = starCache.get(seed);
  if (!s) {
    s = buildStars(seed);
    starCache.set(seed, s);
  }
  return s;
}

export const WideStarfield: React.FC<{ seed?: string }> = ({ seed = 'booth' }) => {
  const frame = useCurrentFrame();
  const stars = getStars(seed);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {stars.map((s, i) => {
        // Twinkle is high-frequency + low-contrast → sub-perceptual at the seam.
        const twinkle = Math.sin(frame * s.twSpeed + s.twPhase) * 0.35 + 0.65;
        // Drift is loop-locked (1 cycle) → returns to phase 0 at the seam.
        const drift = loopWave(frame, 1, TOTAL, s.twPhase) * s.driftAmp;
        const glow = s.color !== '#ffffff' ? `0 0 ${s.size * 3}px ${s.color}` : 'none';
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y + drift,
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              backgroundColor: s.color,
              opacity: s.baseOpacity * twinkle,
              boxShadow: glow,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Loop-locked aurora blobs ────────────────────────────────────────────────

interface Blob {
  x: number;
  y: number;
  size: number;
  color: string;
  phase: number;
}

function buildBlobs(seed: string): Blob[] {
  const colors = [ACCENT.web, ACCENT.cctv, ACCENT.social, '#1a0a3e', '#2d0a1a'];
  return Array.from({ length: 5 }, (_, i) => ({
    x: random(`${seed}-bx-${i}`) * 80 + 10,
    y: random(`${seed}-by-${i}`) * 80 + 10,
    size: random(`${seed}-bs-${i}`) * 320 + 420,
    color: colors[i % colors.length]!,
    phase: random(`${seed}-bp-${i}`) * Math.PI * 2,
  }));
}

const blobCache = new Map<string, Blob[]>();
function getBlobs(seed: string): Blob[] {
  let b = blobCache.get(seed);
  if (!b) {
    b = buildBlobs(seed);
    blobCache.set(seed, b);
  }
  return b;
}

export const LoopAurora: React.FC<{ seed?: string; opacity?: number }> = ({
  seed = 'booth-aurora',
  opacity = 0.16,
}) => {
  const frame = useCurrentFrame();
  const blobs = getBlobs(seed);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity }}>
      {blobs.map((blob, i) => {
        const xOff = loopWave(frame, 2, TOTAL, blob.phase) * 1.6;
        const yOff = loopCos(frame, 2, TOTAL, blob.phase * 0.7) * 1.3;
        const scale = 1 + loopWave(frame, 1, TOTAL, blob.phase) * 0.1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${blob.x + xOff}%`,
              top: `${blob.y + yOff}%`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              width: blob.size,
              height: blob.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${blob.color}40 0%, ${blob.color}10 40%, transparent 70%)`,
              filter: 'blur(60px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Loop-locked glow orb ────────────────────────────────────────────────────

export const LoopGlowOrb: React.FC<{
  x: number;
  y: number;
  size?: number;
  color?: string;
  cycles?: number;
  phase?: number;
  boost?: number;
}> = ({ x, y, size = 320, color = ACCENT.web, cycles = 3, phase = 0, boost = 0 }) => {
  const frame = useCurrentFrame();
  const xOff = loopWave(frame, cycles, TOTAL, phase) * 18;
  const yOff = loopCos(frame, cycles, TOTAL, phase) * 14;
  const pulse = loop01(frame, cycles, TOTAL, phase) * 0.18 + 0.86 + boost;
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(calc(-50% + ${xOff}px), calc(-50% + ${yOff}px)) scale(${pulse})`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}30 0%, ${color}08 50%, transparent 70%)`,
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }}
    />
  );
};

// ─── Loop-locked accent lines (landscape) ────────────────────────────────────

export const BoothAccentLines: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = loop01(frame, 8) * 0.18 + 0.22;
  // period 80 frames → 12 whole cycles over 960 → seamless wrap.
  const hi = ((frame * 1.5) % 120) / 120 * 100;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: 64, left: 120, right: 120, height: 1 }}>
        <div style={{ width: '100%', height: '100%', background: COLORS.gradient, opacity: pulse }} />
        <div
          style={{
            position: 'absolute',
            top: -1,
            left: `${hi}%`,
            width: 60,
            height: 3,
            background: 'rgba(255,255,255,0.6)',
            borderRadius: 2,
            filter: 'blur(2px)',
            opacity: pulse * 1.6,
          }}
        />
      </div>
      <div style={{ position: 'absolute', bottom: 64, left: 120, right: 120, height: 1 }}>
        <div style={{ width: '100%', height: '100%', background: COLORS.gradient, opacity: pulse * 0.7 }} />
        <div
          style={{
            position: 'absolute',
            top: -1,
            right: `${hi}%`,
            width: 44,
            height: 3,
            background: 'rgba(255,255,255,0.4)',
            borderRadius: 2,
            filter: 'blur(2px)',
            opacity: pulse,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─── Persistent booth background ─────────────────────────────────────────────

export const BoothBackground: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000000' }}>
    <LoopAurora seed="booth-aurora" opacity={0.16} />
    <WideStarfield seed="booth" />
    <LoopGlowOrb x={16} y={24} size={420} color={ACCENT.social} cycles={2} phase={0} />
    <LoopGlowOrb x={84} y={74} size={360} color={ACCENT.web} cycles={3} phase={2} />
    <LoopGlowOrb x={50} y={52} size={300} color={ACCENT.cctv} cycles={2} phase={5} />
    <NoiseOverlay id="booth-noise" />
    <ScanLines opacity={0.02} />
    <BoothAccentLines />
  </AbsoluteFill>
);

// ─── Signal lane (the always-alive peripheral motion) ────────────────────────
//  A horizontal lane: gradient baseline + loop-locked scrolling sparkline that
//  tiles every 192px + two glow dots travelling on a loop-locked sine.

const WAVE_PERIOD = 192;

function buildWavePath(seed: string): string {
  const a1 = random(`${seed}-a1`) * 6 + 7;
  const a2 = random(`${seed}-a2`) * 4 + 3;
  const phi = random(`${seed}-phi`) * Math.PI * 2;
  const pts: string[] = [];
  // x-period 192 (and 64) so a 192px shift is visually identical → seam-safe.
  for (let x = -WAVE_PERIOD; x <= 1920 + WAVE_PERIOD; x += 6) {
    const y
      = Math.sin((x * Math.PI * 2) / WAVE_PERIOD) * a1
      + Math.sin((x * Math.PI * 2) / 64 + phi) * a2;
    pts.push(`${x === -WAVE_PERIOD ? 'M' : 'L'}${x},${y.toFixed(2)}`);
  }
  return pts.join(' ');
}

const wavePathCache = new Map<string, string>();
function getWavePath(seed: string): string {
  let p = wavePathCache.get(seed);
  if (!p) {
    p = buildWavePath(seed);
    wavePathCache.set(seed, p);
  }
  return p;
}

export const SignalLane: React.FC<{
  y: number;
  color: string;
  focus: number;
  seed: string;
}> = ({ y, color, focus, seed }) => {
  const frame = useCurrentFrame();
  const f = clamp(focus, 0, 1);
  if (f <= 0.001) return null;
  const scroll = -(frame % WAVE_PERIOD);
  const path = getWavePath(seed);
  const amp = lerp(0.4, 1, f);
  const dot1X = 960 + loopWave(frame, 1, TOTAL, seed.length) * 760;
  const dot2X = 960 + loopWave(frame, 1, TOTAL, seed.length + 2) * 760;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, height: 2, opacity: f }}>
      {/* baseline */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          top: 0,
          height: 1.5,
          background: `linear-gradient(90deg, transparent, ${color}${f > 0.5 ? '88' : '44'} 20%, ${color}${f > 0.5 ? 'aa' : '55'} 50%, ${color}${f > 0.5 ? '88' : '44'} 80%, transparent)`,
          boxShadow: `0 0 ${12 * f}px ${color}55`,
        }}
      />
      {/* scrolling sparkline */}
      <svg
        width={1920}
        height={120}
        viewBox="0 0 1920 120"
        style={{ position: 'absolute', left: 0, top: -60, overflow: 'visible', opacity: amp * 0.85 }}
      >
        <g transform={`translate(${scroll}, 60)`}>
          <path d={path} fill="none" stroke={color} strokeWidth={f > 0.5 ? 2.4 : 1.4} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${6 * f}px ${color})` }} />
        </g>
      </svg>
      {/* leading glow dots */}
      {[dot1X, dot2X].map((dx, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: dx,
            top: -4,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 16px ${color}, 0 0 32px ${color}aa`,
            opacity: amp * (i === 0 ? 1 : 0.55),
          }}
        />
      ))}
    </div>
  );
};

// ─── Live counter chip (odometer) ────────────────────────────────────────────

export const CountUp: React.FC<{
  start: number;
  end: number;
  from: number;
  to: number;
  label: string;
  color: string;
  prefix?: string;
  suffix?: string;
}> = ({ start, end, from, to, label, color, prefix = '', suffix = '' }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        ...glassChip(0.5, color),
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 12,
        padding: '14px 26px',
        borderRadius: 14,
      }}
    >
      <span style={{ fontFamily: FONTS.primary, fontSize: 22, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 3 }}>{label}</span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 34,
          fontWeight: 700,
          color,
          letterSpacing: 1,
          filter: `drop-shadow(0 0 12px ${color}66)`,
        }}
      >
        {prefix}
        {formatNum(v)}
        {suffix}
      </span>
    </div>
  );
};

// ─── Typewriter query ─────────────────────────────────────────────────────────

export const TypeQuery: React.FC<{
  text: string;
  start: number;
  end: number;
  color: string;
  size?: number;
}> = ({ text, start, end, color, size = 30 }) => {
  const frame = useCurrentFrame();
  const n = Math.floor(
    interpolate(frame, [start, end], [0, text.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );
  const shown = text.slice(0, n);
  const cursor = Math.sin(frame * 0.4) > 0;
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: size, fontWeight: 500, color: COLORS.text, letterSpacing: 0.3 }}>
      {shown}
      {n < text.length && cursor && <span style={{ color }}>|</span>}
    </span>
  );
};

// ─── Convergence field (the 3 → 1 money-shot, blur-free) ─────────────────────

interface Streak {
  lane: number;
  startX: number;
  startY: number;
  color: string;
  delay: number;
  curve: number;
}

function buildStreaks(seed: string): Streak[] {
  const lanes = [
    { y: 300, color: ACCENT.web },
    { y: 540, color: ACCENT.cctv },
    { y: 780, color: ACCENT.social },
  ];
  const perLane = 14;
  const out: Streak[] = [];
  for (let l = 0; l < 3; l++) {
    for (let i = 0; i < perLane; i++) {
      out.push({
        lane: l,
        startX: 160 + random(`${seed}-sx-${l}-${i}`) * 900,
        startY: lanes[l]!.y + (random(`${seed}-sy-${l}-${i}`) - 0.5) * 70,
        color: lanes[l]!.color,
        delay: random(`${seed}-dl-${l}-${i}`) * 26,
        curve: (random(`${seed}-cv-${l}-${i}`) - 0.5) * 220,
      });
    }
  }
  return out;
}

const streakCache = new Map<string, Streak[]>();
function getStreaks(seed: string): Streak[] {
  let s = streakCache.get(seed);
  if (!s) {
    s = buildStreaks(seed);
    streakCache.set(seed, s);
  }
  return s;
}

export const ConvergenceField: React.FC<{ start: number; end: number; seed?: string }> = ({
  start,
  end,
  seed = 'conv',
}) => {
  const frame = useCurrentFrame();
  const streaks = getStreaks(seed);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {streaks.map((s, i) => {
        const p = interpolate(frame, [start + s.delay, end], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        if (p <= 0) return null;
        const ease = p * p * (3 - 2 * p);
        const x = lerp(s.startX, CENTER.x, ease) + Math.sin(ease * Math.PI) * s.curve;
        const y = lerp(s.startY, CENTER.y, ease) + Math.sin(ease * Math.PI) * (s.curve * 0.4);
        // colour drains to the unified purple→white core near impact
        const toCore = clamp((ease - 0.55) / 0.45, 0, 1);
        const col = ease > 0.85 ? '#f5f5f7' : toCore > 0 ? ACCENT.core : s.color;
        const size = lerp(7, 3, ease);
        const op = interpolate(ease, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: col,
              boxShadow: `0 0 ${10 + 14 * toCore}px ${col}`,
              opacity: op,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── CROW logo lockup (the hook + the loop seam) ─────────────────────────────

export const CrowLogo: React.FC<{ size: number; glow: number; glint?: number }> = ({
  size,
  glow,
  glint = 0,
}) => (
  <div style={{ position: 'relative', width: size, height: size }}>
    <div
      style={{
        position: 'absolute',
        inset: -size * 0.18,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${ACCENT.web}40 0%, ${ACCENT.social}18 45%, transparent 70%)`,
        opacity: glow,
        filter: 'blur(10px)',
      }}
    />
    <Img
      src={staticFile('logo.png')}
      style={{
        position: 'relative',
        width: size,
        height: size,
        objectFit: 'contain',
        filter: `drop-shadow(0 0 ${22 * glow}px ${ACCENT.web}88) drop-shadow(0 0 ${44 * glow}px ${ACCENT.social}40)`,
      }}
    />
    {/* specular eye glint */}
    <div
      style={{
        position: 'absolute',
        left: '58%',
        top: '40%',
        width: size * 0.08,
        height: size * 0.08,
        borderRadius: '50%',
        background: '#ffffff',
        filter: 'blur(2px)',
        opacity: 0.25 * glow + glint * 0.7,
      }}
    />
  </div>
);

// ─── VFX atoms (shared by hero / words / main grade) ─────────────────────────

/** Wide anamorphic lens flare — blurred horizontal light streak + hot core. */
export const AnamorphicFlare: React.FC<{
  cx: number;
  cy: number;
  width: number;
  color?: string;
  intensity: number;
}> = ({ cx, cy, width, color = '#bcd8ff', intensity }) => {
  if (intensity <= 0.001) return null;
  const op = clamp(intensity, 0, 1);
  return (
    <div style={{ position: 'absolute', left: cx, top: cy, transform: 'translate(-50%, -50%)', pointerEvents: 'none', mixBlendMode: 'screen', opacity: op }}>
      <div style={{ position: 'absolute', left: -width / 2, top: -2, width, height: 4, background: `linear-gradient(90deg, transparent, ${color}, #ffffff, ${color}, transparent)`, filter: 'blur(2px)' }} />
      <div style={{ position: 'absolute', left: -width / 2, top: -9, width, height: 18, background: `linear-gradient(90deg, transparent, ${color}88, transparent)`, filter: 'blur(11px)' }} />
      <div style={{ position: 'absolute', left: -45, top: -45, width: 90, height: 90, borderRadius: '50%', background: `radial-gradient(circle, #ffffff, ${color}99, transparent 70%)`, filter: 'blur(6px)' }} />
    </div>
  );
};

interface Spark {
  angle: number;
  dist: number;
  size: number;
}

function buildSparks(seed: string, n: number): Spark[] {
  return Array.from({ length: n }, (_, i) => ({
    angle: random(`${seed}-a-${i}`) * Math.PI * 2,
    dist: random(`${seed}-d-${i}`) * 260 + 90,
    size: random(`${seed}-s-${i}`) * 3 + 1.6,
  }));
}

const sparkCache = new Map<string, Spark[]>();
function getSparks(seed: string, n: number): Spark[] {
  const key = `${seed}-${n}`;
  let s = sparkCache.get(key);
  if (!s) {
    s = buildSparks(seed, n);
    sparkCache.set(key, s);
  }
  return s;
}

/** Radial spark burst from a point (hero ignite). Self-gates to its window. */
export const SparkBurst: React.FC<{
  cx: number;
  cy: number;
  start: number;
  dur?: number;
  color: string;
  seed?: string;
  count?: number;
}> = ({ cx, cy, start, dur = 28, color, seed = 'spark', count = 20 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (p <= 0 || p >= 1) return null;
  const sparks = getSparks(seed, count);
  const ease = 1 - Math.pow(1 - p, 3);
  return (
    <div style={{ position: 'absolute', left: cx, top: cy, pointerEvents: 'none', mixBlendMode: 'screen' }}>
      {sparks.map((s, i) => {
        const d = s.dist * ease;
        const x = Math.cos(s.angle) * d;
        const y = Math.sin(s.angle) * d;
        const op = interpolate(p, [0, 0.2, 1], [1, 1, 0]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: `0 0 9px ${color}, 0 0 18px ${color}`,
              opacity: op,
            }}
          />
        );
      })}
    </div>
  );
};

/** A light-sweep shimmer raking across the full frame. */
export const WordSweep: React.FC<{ start: number; dur?: number; strength?: number }> = ({ start, dur = 28, strength = 0.5 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + dur], [-30, 130], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const op = interpolate(frame, [start, start + 5, start + dur - 6, start + dur], [0, strength, strength, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (op <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          bottom: '-10%',
          left: `${p}%`,
          width: '16%',
          background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.55), transparent)',
          opacity: op,
          filter: 'blur(6px)',
          transform: 'skewX(-12deg)',
        }}
      />
    </div>
  );
};

interface HeroProps {
  /** global frame */
  frame: number;
  /** show the additive ignite flourish (only on the opening pass) */
  flourish: boolean;
}

export const Hero: React.FC<HeroProps> = ({ frame, flourish }) => {
  // Settled bright REST state at both ends — frame 0 == frame 960 lockup.
  const breathe = 1 + loopWave(frame, 4) * 0.012;
  const glow = 0.55 + loop01(frame, 4) * 0.25;
  // Additive one-shot ignite, fires AFTER the seam (f8–56), never at rest.
  const ignite = flourish
    ? interpolate(frame, [8, 22, 46, 62], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const glint = flourish
    ? interpolate(frame, [12, 16, 28], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  // Expanding ignite ring.
  const ringScale = flourish ? interpolate(frame, [8, 44], [0.5, 1.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  const ringOp = flourish ? interpolate(frame, [8, 16, 46], [0, 0.65, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const logoCY = 426;
  const chroma = 1.4 + ignite * 3.5;

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* ignite ring */}
      {ringOp > 0.001 && (
        <div
          style={{
            position: 'absolute',
            left: 960,
            top: logoCY,
            width: 300,
            height: 300,
            transform: `translate(-50%, -50%) scale(${ringScale})`,
            borderRadius: '50%',
            border: `2px solid ${ACCENT.web}`,
            boxShadow: `0 0 40px ${ACCENT.web}, inset 0 0 40px ${ACCENT.social}55`,
            opacity: ringOp,
            mixBlendMode: 'screen',
          }}
        />
      )}
      {flourish && <SparkBurst cx={960} cy={logoCY} start={12} color={ACCENT.web} seed="hero-spark" count={22} />}
      <AnamorphicFlare cx={960} cy={logoCY} width={1000} color="#cfe0ff" intensity={ignite} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${breathe})`,
        }}
      >
        <CrowLogo size={236} glow={glow + ignite * 0.6} glint={glint} />
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 132,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: -2,
            lineHeight: 1.0,
            marginTop: 18,
            textAlign: 'center',
            textShadow: `${chroma}px 0 ${ACCENT.social}99, -${chroma}px 0 ${ACCENT.cctv}99, 0 0 ${36 + ignite * 60}px ${ACCENT.web}66, 0 0 90px rgba(0,0,0,0.6)`,
          }}
        >
          ONE MODEL.
        </div>
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: 6,
            lineHeight: 1.1,
            marginTop: 6,
            opacity: 0.92,
            background: COLORS.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 ${18 * glow}px ${ACCENT.social}40)`,
          }}
        >
          EVERY CHANNEL.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Persistent corner watcher-mark ──────────────────────────────────────────

export const WatcherMark: React.FC<{ opacity: number }> = ({ opacity }) => {
  if (opacity <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: 56,
        left: 140,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity,
      }}
    >
      <CrowLogo size={56} glow={0.7} />
      <span
        style={{
          fontFamily: FONTS.primary,
          fontSize: 26,
          fontWeight: 800,
          color: COLORS.text,
          letterSpacing: 8,
        }}
      >
        CROW
      </span>
    </div>
  );
};

// ─── Big channel word (S3/S4/S5 dominant element) ────────────────────────────

export const ChannelWord: React.FC<{
  word: string;
  sub: string;
  color: string;
  appearAt: number;
  vanishAt: number;
}> = ({ word, sub, color, appearAt, vanishAt }) => {
  const frame = useCurrentFrame();
  const intro = spring({
    frame: frame - appearAt,
    fps: FPS,
    config: { damping: 12, stiffness: 200 },
    durationInFrames: 20,
  });
  const scale = interpolate(intro, [0, 1], [0.82, 1]);
  const op = envelope(frame, appearAt, appearAt + 12, vanishAt, vanishAt + 16);
  const subOp = envelope(frame, appearAt + 12, appearAt + 26, vanishAt, vanishAt + 14);
  const glowPulse = loop01(frame, 12) * 0.3 + 0.7;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: op,
      }}
    >
      <div style={{ position: 'relative', transform: `scale(${scale})`, display: 'flex', justifyContent: 'center' }}>
        {/* bloom duplicate (soft volumetric glow) */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONTS.primary,
            fontSize: 280,
            fontWeight: 800,
            color,
            letterSpacing: -4,
            lineHeight: 1,
            filter: 'blur(28px)',
            opacity: 0.5 * glowPulse,
            transform: 'scale(1.05)',
          }}
        >
          {word}
        </div>
        {/* crisp word with chromatic edge */}
        <div
          style={{
            position: 'relative',
            fontFamily: FONTS.primary,
            fontSize: 280,
            fontWeight: 800,
            color: COLORS.text,
            letterSpacing: -4,
            lineHeight: 1,
            textShadow: `2.5px 0 ${ACCENT.social}70, -2.5px 0 ${ACCENT.cctv}70, 0 0 60px ${color}cc, 0 0 130px ${color}66, 0 6px 40px rgba(0,0,0,0.75)`,
          }}
        >
          {word}
        </div>
      </div>
      <div
        style={{
          fontFamily: FONTS.primary,
          fontSize: 40,
          fontWeight: 700,
          color: COLORS.textMuted,
          letterSpacing: 10,
          marginTop: 18,
          opacity: subOp,
        }}
      >
        {sub}
      </div>
      <WordSweep start={appearAt + 30} dur={26} strength={0.55} />
    </div>
  );
};

export { COLORS, FONTS, FPS, glassCard, glassChip, Vignette };
