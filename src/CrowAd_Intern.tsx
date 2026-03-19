/**
 * CrowAd_Intern — 25-second Intern Script Ad (V2 — Premium Overhaul)
 *
 * Composition : 3840 × 2160 (4K UHD), 60 fps, 1500 frames
 * Render space: All pixel values authored at 1920 × 1080 and scaled ×2
 *               inside a CSS scale(2) wrapper → crisp 4K output.
 *
 * Visual upgrades over V1:
 *   - Premium glassmorphism with specular highlights & animated gradient borders
 *   - SVG stroke draw-on icon animation
 *   - Bloom text (blurred duplicate behind sharp text)
 *   - 3D perspective card entrances
 *   - Drifting gradient mesh background
 *   - Light leak overlay (screen blend)
 *   - Noise-driven organic float (via @remotion/noise)
 *   - Radial node convergence
 *   - Tighter spring timing
 *
 * Scene map (60 fps) — synced to voiceover timestamps:
 *   0    – 240    S1   Hook                          0–4 s
 *   240  – 540    S2   Channels (sequential reveals)  4–9 s
 *     240 (4s) Website · 330 (5.5s) Store · 415 (6.9s) Social
 *   480  – 780    S3   Problem / Pain                8–13 s
 *     480 (8s) "don't know" · 540 (9s) "looking for"
 *     660 (11s) "what they think" · 690 "why they leave"
 *   780  – 1020   S4   Solution convergence          13–17 s
 *   1020 – 1500   S5   CTA / Tagline                 17–25 s
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  spring,
  interpolate,
  random,
  Img,
  Audio,
  staticFile,
} from 'remotion';
import { noise3D } from '@remotion/noise';

// ─── Constants ──────────────────────────────────────────────────────────────

const FPS = 60;
const W = 1920;
const H = 1080;

// CROW brand palette — purple-dominant, clean dark theme (matching crowai.dev)
const C = {
  bg: '#050005',           // Near-black with faint purple undertone
  bgDeep: '#020003',       // Pure deep black
  bgCard: '#0c0812',       // Slightly lifted dark for cards
  // Primary accent: PURPLE (brand dominant)
  purple: '#8b5cf6',
  purpleLight: '#a78bfa',
  purpleGlow: 'rgba(139, 92, 246, 0.45)',
  purpleDim: 'rgba(139, 92, 246, 0.15)',
  // Secondary accent: Pink/Magenta (gradient partner)
  pink: '#d946ef',
  pinkGlow: 'rgba(217, 70, 239, 0.4)',
  // Tertiary accents (for channel differentiation)
  red: '#ff2d55',
  redGlow: 'rgba(255, 45, 85, 0.4)',
  cyan: '#00d4ff',
  cyanGlow: 'rgba(0, 212, 255, 0.35)',
  orange: '#f97316',
  orangeGlow: 'rgba(249, 115, 22, 0.35)',
  // Text
  text: '#ffffff',
  textMuted: '#a8a0c0',
  textDim: '#5c5475',
  // Card
  cardBorder: 'rgba(139, 92, 246, 0.15)',
  cardBorderHover: 'rgba(139, 92, 246, 0.3)',
  // Gradients (matching website hero)
  gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
  gradientFull: 'linear-gradient(135deg, #8b5cf6, #d946ef, #ff2d55)',
} as const;

const FONT = 'Sora, Inter, system-ui, sans-serif';
const FONT_MONO = 'JetBrains Mono, monospace';

// Spring presets — snappy for premium feel
const SNAP = { damping: 12, stiffness: 200 };
const SOFT = { damping: 16, stiffness: 140 };
const BOUNCE = { damping: 10, stiffness: 260 };

// ─── Helpers ────────────────────────────────────────────────────────────────

function sp(frame: number, delay: number, cfg = SNAP, dur = 25) {
  return spring({ frame: frame - delay, fps: FPS, config: cfg, durationInFrames: dur });
}
function fi(frame: number, a: number, b: number, from = 0, to = 1) {
  return interpolate(frame, [a, b], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}
function fo(frame: number, start: number, len = 20) {
  return fi(frame, start, start + len, 1, 0);
}
function breathe(frame: number, speed = 0.04, amp = 0.12): number {
  return Math.sin(frame * speed) * amp + (1 - amp);
}

// Organic float using noise3D
function organicFloat(frame: number, seed: string, amplitude = 12) {
  const x = noise3D(seed + '-x', frame * 0.008, 0, 0) * amplitude;
  const y = noise3D(seed + '-y', 0, frame * 0.008, 0) * amplitude;
  const r = noise3D(seed + '-r', 0, 0, frame * 0.005) * 2;
  return { x, y, rotate: r };
}

// 3D perspective card entrance
function card3D(frame: number, delay: number) {
  const prog = sp(frame, delay, SNAP, 30);
  return {
    transform: `
      perspective(1200px)
      rotateY(${interpolate(prog, [0, 1], [-15, 0])}deg)
      rotateX(${interpolate(prog, [0, 1], [6, 0])}deg)
      translateZ(${interpolate(prog, [0, 1], [-80, 0])}px)
      scale(${interpolate(prog, [0, 1], [0.88, 1])})
    `,
    opacity: interpolate(prog, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
  };
}

// ─── Sparkle / Particle Field (enhanced with depth blur) ────────────────────

const SPARK_COUNT = 200;
interface Spark {
  x: number; y: number; size: number; baseOpacity: number;
  twinkleSpeed: number; twinklePhase: number; driftSpeed: number;
  color: string; layer: number;
}

function buildSparks(): Spark[] {
  return Array.from({ length: SPARK_COUNT }, (_, i) => {
    const cr = random(`sp-c-${i}`);
    let color = C.text;
    if (cr > 0.92) color = C.purpleLight;
    else if (cr > 0.86) color = C.purple;
    else if (cr > 0.81) color = C.pink;
    else if (cr > 0.78) color = C.cyan;

    const layer = random(`sp-l-${i}`) > 0.5 ? 1.3 : 0.5;
    return {
      x: random(`sp-x-${i}`) * W,
      y: random(`sp-y-${i}`) * H,
      size: (random(`sp-s-${i}`) * 2 + 0.3) * (layer > 1 ? 1 : 0.6),
      baseOpacity: random(`sp-o-${i}`) * 0.45 + 0.1,
      twinkleSpeed: random(`sp-ts-${i}`) * 0.1 + 0.04,
      twinklePhase: random(`sp-tp-${i}`) * Math.PI * 2,
      driftSpeed: random(`sp-d-${i}`) * 0.12 + 0.02,
      color,
      layer,
    };
  });
}

let _sparks: Spark[] | null = null;
function getSparks() {
  if (!_sparks) _sparks = buildSparks();
  return _sparks;
}

const SparkleField: React.FC = () => {
  const frame = useCurrentFrame();
  const sparks = getSparks();
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {sparks.map((s, i) => {
        const drift = frame * s.driftSpeed * s.layer;
        const y = ((s.y + drift) % (H + 40)) - 20;
        const twinkle = Math.sin(frame * s.twinkleSpeed + s.twinklePhase) * 0.4 + 0.6;
        const isColored = s.color !== C.text;
        const glowSize = isColored ? s.size * 5 : s.size * 2;
        const blur = s.layer < 1 ? 1.2 : 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.x,
              top: y,
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              backgroundColor: s.color,
              opacity: s.baseOpacity * twinkle,
              boxShadow: `0 0 ${glowSize}px ${s.color}`,
              filter: blur > 0 ? `blur(${blur}px)` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Gradient Mesh Background (Stripe/Linear style — drifting radial layers) ─

const GradientMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d = frame * 0.15;

  return (
    <AbsoluteFill>
      {/* Base — pure dark */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(170deg, ${C.bg} 0%, ${C.bgDeep} 100%)`,
      }} />
      {/* Purple-dominant drifting mesh (matching crowai.dev hero) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 80% 55% at ${50 + Math.sin(d * 0.01) * 10}% ${20 + Math.cos(d * 0.008) * 8}%, ${C.purple}22 0%, transparent 70%),
          radial-gradient(ellipse 60% 70% at ${72 + Math.cos(d * 0.012) * 10}% ${55 + Math.sin(d * 0.009) * 10}%, ${C.pink}14 0%, transparent 60%),
          radial-gradient(ellipse 50% 45% at ${28 + Math.sin(d * 0.007) * 8}% ${70 + Math.cos(d * 0.011) * 6}%, ${C.purple}10 0%, transparent 65%)
        `,
      }} />
      {/* Central purple glow (like the website hero CROW text glow) */}
      <div style={{
        position: 'absolute',
        top: '15%', left: '30%',
        width: 800, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, ${C.purple}12 0%, ${C.pink}06 40%, transparent 70%)`,
        filter: 'blur(90px)',
        transform: `scale(${breathe(frame, 0.02, 0.1)}) translate(${Math.sin(frame * 0.012) * 15}px, ${Math.cos(frame * 0.01) * 10}px)`,
      }} />
      {/* Bottom-left subtle purple wash */}
      <div style={{
        position: 'absolute',
        bottom: '-10%', left: '-5%',
        width: 600, height: 400, borderRadius: '50%',
        background: `radial-gradient(circle, ${C.purple}0c 0%, transparent 60%)`,
        filter: 'blur(70px)',
        transform: `scale(${breathe(frame, 0.025, 0.08)})`,
      }} />
    </AbsoluteFill>
  );
};

// ─── Light Leak Overlay ─────────────────────────────────────────────────────

const LightLeak: React.FC<{ intensity?: number }> = ({ intensity = 0.1 }) => {
  const frame = useCurrentFrame();
  const x = 50 + Math.sin(frame * 0.018) * 30;
  const y = 30 + Math.cos(frame * 0.013) * 20;
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse 35% 55% at ${x}% ${y}%, rgba(139, 92, 246, ${intensity}), transparent 70%)`,
      mixBlendMode: 'screen',
      pointerEvents: 'none',
    }} />
  );
};

// ─── Vignette ───────────────────────────────────────────────────────────────

const CinematicVignette: React.FC<{ intensity?: number }> = ({ intensity = 0.8 }) => (
  <AbsoluteFill style={{
    background: `
      radial-gradient(ellipse 65% 55% at 50% 50%, transparent 30%, rgba(5, 0, 10, ${intensity}) 100%),
      radial-gradient(ellipse 120% 80% at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.3) 100%)
    `,
    pointerEvents: 'none',
  }} />
);

// ─── Scan Lines ─────────────────────────────────────────────────────────────

const ScanLines: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{
      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.012) 2px, rgba(255, 255, 255, 0.012) 4px)`,
      backgroundPosition: `0 ${(frame * 0.3) % 4}px`,
      pointerEvents: 'none', mixBlendMode: 'overlay',
    }} />
  );
};

// ─── Film Grain ─────────────────────────────────────────────────────────────

const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.03, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
      <svg width="100%" height="100%">
        <filter id="intern-grain2">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={4} seed={Math.floor(frame / 2)} />
        </filter>
        <rect width="100%" height="100%" filter="url(#intern-grain2)" />
      </svg>
    </AbsoluteFill>
  );
};

// ─── Bloom Text (duplicate-and-blur behind sharp text) ──────────────────────

const BloomText: React.FC<{
  children: React.ReactNode;
  size?: number; weight?: number; glow?: number; color?: string;
  gradient?: boolean; style?: React.CSSProperties;
}> = ({ children, size = 52, weight = 700, glow = 0, color = C.text, gradient, style }) => {
  const baseStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: size,
    fontWeight: weight,
    textAlign: 'center' as const,
    lineHeight: 1.25,
    letterSpacing: '-0.025em',
    whiteSpace: 'pre-line' as const,
    ...style,
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bloom layer — blurred duplicate */}
      <div style={{
        ...baseStyle,
        position: 'absolute', top: 0, left: 0, right: 0,
        color: gradient ? C.purple : color,
        filter: `blur(${10 + glow * 16}px)`,
        opacity: 0.45 * glow,
        transform: 'scale(1.04)',
        pointerEvents: 'none',
      }}>
        {children}
      </div>
      {/* Sharp text on top */}
      <div style={{
        ...baseStyle,
        position: 'relative',
        ...(gradient ? {
          background: C.gradientFull,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: `drop-shadow(0 0 ${18 * glow}px ${C.purpleGlow})`,
        } : {
          color,
          textShadow: `
            0 0 ${15 * glow}px rgba(255, 255, 255, ${0.4 * glow}),
            0 0 ${40 * glow}px ${C.purpleGlow}
          `,
        }),
      }}>
        {children}
      </div>
    </div>
  );
};

// ─── Premium Glass Card ─────────────────────────────────────────────────────

function premiumGlass(glow = 0, accent = C.purple): React.CSSProperties {
  return {
    background: `linear-gradient(160deg, ${C.bgCard} 0%, rgba(8, 4, 14, 0.95) 100%)`,
    backdropFilter: 'blur(20px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
    border: `1px solid ${C.cardBorder}`,
    borderTop: `1px solid rgba(139, 92, 246, ${0.12 + glow * 0.12})`,
    borderRadius: 16,
    boxShadow: `
      0 8px 40px rgba(0, 0, 0, 0.7),
      0 0 ${25 * glow}px ${accent}20,
      0 0 ${60 * glow}px ${accent}08,
      inset 0 1px 0 rgba(255, 255, 255, 0.04)
    `,
  };
}

// ─── Specular Highlight (glass top-edge reflection) ─────────────────────────

const SpecularHighlight: React.FC = () => (
  <div style={{
    position: 'absolute',
    top: 0, left: '15%', right: '15%',
    height: 1,
    background: `linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.25), rgba(255, 255, 255, 0.15), rgba(139, 92, 246, 0.25), transparent)`,
    borderRadius: '50%',
    filter: 'blur(0.5px)',
    pointerEvents: 'none',
  }} />
);

// ─── Animated Gradient Border ───────────────────────────────────────────────

const GradientBorderCard: React.FC<{
  children: React.ReactNode;
  borderRadius?: number;
  borderWidth?: number;
  glow?: number;
  frame: number;
  style?: React.CSSProperties;
}> = ({ children, borderRadius = 24, borderWidth = 1.5, glow = 0, frame, style }) => {
  const angle = (frame * 1.5) % 360;
  return (
    <div style={{
      position: 'relative',
      borderRadius,
      padding: borderWidth,
      background: `conic-gradient(from ${angle}deg, ${C.purple}70, ${C.pink}50, ${C.purple}30, ${C.purpleLight}50, ${C.purple}70)`,
      filter: glow > 0 ? `drop-shadow(0 0 ${8 * glow}px ${C.purpleGlow})` : undefined,
      ...style,
    }}>
      <div style={{
        borderRadius: borderRadius - borderWidth,
        background: `linear-gradient(160deg, ${C.bgCard}, rgba(5, 2, 10, 0.98))`,
        width: '100%', height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {children}
      </div>
    </div>
  );
};

// ─── Light Sweep ────────────────────────────────────────────────────────────

const LightSweep: React.FC<{ frame: number; start: number; dur?: number }> = ({
  frame, start, dur = 35,
}) => {
  const progress = fi(frame, start, start + dur, -100, 200);
  const opacity = interpolate(
    frame, [start, start + 6, start + dur - 6, start + dur],
    [0, 0.4, 0.4, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: 'inherit' }}>
      <div style={{
        position: 'absolute', top: 0, left: `${progress}%`,
        width: '20%', height: '100%',
        background: `linear-gradient(-25deg, transparent 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 55%, transparent 100%)`,
        opacity, transform: 'skewX(-25deg)',
      }} />
    </div>
  );
};

// ─── SVG Draw-On Icon ───────────────────────────────────────────────────────

const DrawOnPath: React.FC<{
  d: string; frame: number; delay: number; dur?: number;
  color: string; strokeWidth?: number; pathLength?: number;
  fill?: string; fillDelay?: number;
}> = ({ d, frame, delay, dur = 30, color, strokeWidth = 2.2, pathLength = 300, fill, fillDelay = 15 }) => {
  const prog = sp(frame, delay, { damping: 18, stiffness: 100 }, dur);
  const offset = interpolate(prog, [0, 1], [pathLength, 0]);
  const glowProg = fi(frame, delay + dur * 0.6, delay + dur, 0, 1);
  const fillOpacity = fill ? fi(frame, delay + fillDelay, delay + fillDelay + 15, 0, 0.12) : 0;

  return (
    <>
      {fill && (
        <path d={d} fill={fill} opacity={fillOpacity} />
      )}
      <path
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={pathLength}
        strokeDashoffset={offset}
        filter={glowProg > 0 ? `drop-shadow(0 0 ${5 * glowProg}px ${color}80)` : undefined}
      />
    </>
  );
};

// ─── Channel Icons (Draw-On SVG) ────────────────────────────────────────────

const IconGlobe: React.FC<{ frame: number; delay: number; color: string; size?: number }> = ({
  frame, delay, color, size = 72,
}) => (
  <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
    <DrawOnPath d="M36 4 A32 32 0 1 1 35.99 4" frame={frame} delay={delay} color={color} pathLength={210} dur={35} />
    <DrawOnPath d="M36 4 C48 4 56 20 56 36 S48 68 36 68 C24 68 16 52 16 36 S24 4 36 4" frame={frame} delay={delay + 5} color={color} pathLength={180} strokeWidth={1.5} dur={30} />
    <DrawOnPath d="M5 28 H67" frame={frame} delay={delay + 10} color={color} pathLength={62} strokeWidth={1.2} dur={18} />
    <DrawOnPath d="M5 44 H67" frame={frame} delay={delay + 13} color={color} pathLength={62} strokeWidth={1.2} dur={18} />
    <DrawOnPath d="M36 4 V68" frame={frame} delay={delay + 8} color={color} pathLength={64} strokeWidth={1.2} dur={18} />
    {/* Center pulse dot */}
    <circle cx="36" cy="36" r={3} fill={color} opacity={fi(frame, delay + 25, delay + 35)} />
  </svg>
);

const IconStore: React.FC<{ frame: number; delay: number; color: string; size?: number }> = ({
  frame, delay, color, size = 72,
}) => (
  <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
    {/* Roof */}
    <DrawOnPath d="M8 30 L36 8 L64 30" frame={frame} delay={delay} color={color} pathLength={120} dur={25} />
    {/* Awning */}
    <DrawOnPath d="M8 30 Q16 38 24 30 Q32 38 36 30 Q42 38 48 30 Q56 38 64 30" frame={frame} delay={delay + 8} color={color} pathLength={100} strokeWidth={1.8} dur={22} />
    {/* Body */}
    <DrawOnPath d="M12 30 V64 H60 V30" frame={frame} delay={delay + 12} color={color} pathLength={120} strokeWidth={1.8} dur={20} fill={color} fillDelay={20} />
    {/* Door */}
    <DrawOnPath d="M30 64 V46 H42 V64" frame={frame} delay={delay + 18} color={color} pathLength={60} strokeWidth={1.8} dur={15} />
    {/* Windows */}
    <DrawOnPath d="M16 36 H26 V46 H16 Z" frame={frame} delay={delay + 20} color={color} pathLength={40} strokeWidth={1.3} dur={12} fill={color} fillDelay={10} />
    <DrawOnPath d="M46 36 H56 V46 H46 Z" frame={frame} delay={delay + 22} color={color} pathLength={40} strokeWidth={1.3} dur={12} fill={color} fillDelay={10} />
    {/* Door knob */}
    <circle cx="40" cy="56" r={1.5} fill={color} opacity={fi(frame, delay + 30, delay + 35)} />
  </svg>
);

const IconSocial: React.FC<{ frame: number; delay: number; color: string; size?: number }> = ({
  frame, delay, color, size = 72,
}) => (
  <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
    {/* Main bubble */}
    <DrawOnPath
      d="M12 16 H48 A7 7 0 0 1 55 23 V37 A7 7 0 0 1 48 44 H28 L18 52 V44 H12 A7 7 0 0 1 5 37 V23 A7 7 0 0 1 12 16 Z"
      frame={frame} delay={delay} color={color} pathLength={200} dur={30} fill={color} fillDelay={18}
    />
    {/* Dots */}
    <circle cx="22" cy="30" r={2.8} fill={color} opacity={fi(frame, delay + 16, delay + 22)} />
    <circle cx="33" cy="30" r={2.8} fill={color} opacity={fi(frame, delay + 18, delay + 24)} />
    <circle cx="44" cy="30" r={2.8} fill={color} opacity={fi(frame, delay + 20, delay + 26)} />
    {/* Secondary bubble */}
    <DrawOnPath
      d="M36 40 H56 A5 5 0 0 1 61 45 V55 A5 5 0 0 1 56 60 H52 V66 L46 60 H36 A5 5 0 0 1 31 55 V45 A5 5 0 0 1 36 40 Z"
      frame={frame} delay={delay + 14} color={color} pathLength={120} strokeWidth={1.6} dur={22} fill={color} fillDelay={15}
    />
    {/* Heart in secondary */}
    <DrawOnPath
      d="M46 49 C46 47 48 45 50 45 S54 47 54 49 C54 47 56 45 58 45 S62 47 62 49 C62 53 54 57 54 57 S46 53 46 49 Z"
      frame={frame} delay={delay + 24} color={color} pathLength={60} strokeWidth={1.3} dur={15}
    />
  </svg>
);

// ─── CROW Icon (convergence center) ─────────────────────────────────────────

const CrowIcon: React.FC<{ glow?: number; size?: number }> = ({ glow = 0, size = 110 }) => {
  const frame = useCurrentFrame();
  const pulse = breathe(frame, 0.05, 0.1);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* Glow halo */}
      <div style={{
        position: 'absolute', inset: -30,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${C.purple}25 0%, ${C.pink}10 40%, transparent 70%)`,
        filter: 'blur(20px)',
        opacity: glow, transform: `scale(${pulse})`,
      }} />
      <svg width={size} height={size} viewBox="0 0 110 110" fill="none">
        <defs>
          <linearGradient id="crowG" x1="0" y1="0" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={C.purpleLight} />
            <stop offset="50%" stopColor={C.purple} />
            <stop offset="100%" stopColor={C.pink} />
          </linearGradient>
        </defs>
        {/* Outer ring */}
        <circle cx="55" cy="55" r="48" stroke="url(#crowG)" strokeWidth="2.5" opacity={0.7 + glow * 0.3} />
        {/* Inner ring */}
        <circle cx="55" cy="55" r="35" stroke="url(#crowG)" strokeWidth="1.2" opacity={0.3 + glow * 0.2} />
        {/* CROW text */}
        <text
          x="55" y="60"
          textAnchor="middle"
          fontFamily={FONT}
          fontSize="24"
          fontWeight="800"
          fill="url(#crowG)"
          letterSpacing="0.06em"
        >
          CROW
        </text>
        {/* Cardinal dots */}
        {[0, 90, 180, 270].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 55 + 48 * Math.cos(rad);
          const cy = 55 + 48 * Math.sin(rad);
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={3}
              fill={[C.purple, C.pink, C.cyan, C.purpleLight][i]}
              opacity={0.6 + glow * 0.4}
            />
          );
        })}
      </svg>
    </div>
  );
};

// ─── Connection Line (curved, animated) ─────────────────────────────────────

const ConnectionLine: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  progress: number; color: string;
}> = ({ x1, y1, x2, y2, progress, color }) => {
  const mx = (x1 + x2) / 2 + (y2 - y1) * 0.25;
  const my = (y1 + y2) / 2 - (x2 - x1) * 0.25;
  const pathLen = 400;
  const offset = interpolate(progress, [0, 1], [pathLen, 0]);

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: W, height: H, pointerEvents: 'none' }}
      viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id={`cl-${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path
        d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
        stroke={`url(#cl-${x1}-${y1})`}
        strokeWidth={2}
        fill="none"
        strokeDasharray={pathLen}
        strokeDashoffset={offset}
        filter={progress > 0.5 ? `drop-shadow(0 0 4px ${color}60)` : undefined}
      />
      {/* Traveling dot */}
      {progress > 0.1 && progress < 0.95 && (() => {
        const t = progress;
        const dotX = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
        const dotY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;
        return <circle cx={dotX} cy={dotY} r={4} fill={color} opacity={0.9} filter={`drop-shadow(0 0 6px ${color})`} />;
      })()}
    </svg>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// ─── SCENE 1: HOOK ──────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

const Scene1_Hook: React.FC<{ frame: number }> = ({ frame }) => {
  // 0s – 4s (frames 0–240)
  const sceneOut = fo(frame, 200, 40);

  // Single pop-in: the whole sentence appears together with a bouncy scale
  const popProg = sp(frame, 15, BOUNCE, 22);
  const popScale = interpolate(popProg, [0, 1], [0.7, 1]);
  const popY = interpolate(popProg, [0, 1], [40, 0]);
  const glowRamp = fi(frame, 30, 160, 0, 1);

  return (
    <AbsoluteFill style={{ opacity: sceneOut, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Ambient glow behind text */}
      <div style={{
        position: 'absolute', width: 700, height: 400, borderRadius: '50%',
        background: `radial-gradient(circle, ${C.purple}20 0%, ${C.pink}0a 40%, transparent 70%)`,
        filter: 'blur(60px)',
        transform: `scale(${breathe(frame, 0.03, 0.15)})`,
        opacity: popProg,
      }} />

      {/* Single pop-in text block */}
      <div style={{
        opacity: popProg,
        transform: `translateY(${popY}px) scale(${popScale})`,
        maxWidth: 900,
        textAlign: 'center',
      }}>
        <BloomText size={56} weight={700} glow={glowRamp}>
          Your customers interact with{'\n'}your business in many places.
        </BloomText>
      </div>

      {/* Accent divider — snaps in after text */}
      <div style={{
        position: 'absolute', bottom: 300, left: '50%',
        transform: 'translateX(-50%)',
        width: fi(frame, 40, 80) * 350,
        height: 2,
        opacity: popProg,
        background: `linear-gradient(90deg, transparent, ${C.purple}60, ${C.pink}50, transparent)`,
        borderRadius: 1,
        boxShadow: `0 0 12px ${C.purpleGlow}`,
      }} />
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// ─── SCENE 2: CHANNELS (Full-screen sequential reveals) ────────────────────
// ═════════════════════════════════════════════════════════════════════════════

const channelData = [
  {
    label: 'On your website',
    sub: 'Every click, scroll, and journey — tracked.',
    Icon: IconGlobe,
    color: C.cyan,
    accent: C.cyanGlow,
    chips: ['Clicks', 'Scrolls', 'Journeys', 'Heatmaps'],
    position: 'left' as const,  // icon left, text right
  },
  {
    label: 'Inside your store',
    sub: 'Foot traffic, dwell time, real behavior.',
    Icon: IconStore,
    color: C.red,
    accent: C.redGlow,
    chips: ['Visits', 'Footfall', 'Behavior', 'Dwell Time'],
    position: 'right' as const, // icon right, text left
  },
  {
    label: 'And on social media',
    sub: 'Mentions, sentiment, the conversations that matter.',
    Icon: IconSocial,
    color: C.purple,
    accent: C.purpleGlow,
    chips: ['Mentions', 'Sentiment', 'Trends', 'Reach'],
    position: 'left' as const,
  },
] as const;

// 4s=Website(240), 5.5s=Store(330), ~6.9s=Social(415), ends ~9s(540)
// Website stays until 330, Store stays until 415, then Social follows
const CH_DUR = 130;
const CH_STARTS = [0, 90, 175]; // local frames: Website=0(global 240), Store=90(global 330), Social=175(global 415)

const Scene2_Channels: React.FC<{ frame: number }> = ({ frame }) => {
  // Scene runs 4s–9s (frames 240–540)
  const localFrame = frame - 240;
  const sceneIn = fi(localFrame, 0, 12);
  const sceneOut = fo(localFrame, 259, 20); // fully invisible by localFrame 279 (global 519)
  const opacity = Math.min(sceneIn, sceneOut);

  return (
    <AbsoluteFill style={{ opacity }}>
      {channelData.map((ch, i) => {
        // Website=0(4s), Store=90(5.5s), Social=150(6.5s)
        const chStart = CH_STARTS[i];
        // Fade out starts when the NEXT channel fades in — clean handoff, no double-up
        const nextChStart = (i < channelData.length - 1) ? CH_STARTS[i + 1] : chStart + CH_DUR;
        const fadeOutEnd = nextChStart + 15;
        if (localFrame < chStart - 10 || localFrame > fadeOutEnd + 10) return null;

        // Snap in (10 frames), fade out over 15 frames when next channel enters
        const chIn = fi(localFrame, chStart, chStart + 10, 0, 1);
        const chOut = (i < channelData.length - 1)
          ? fo(localFrame, nextChStart - 5, 20)  // start fading 5 frames BEFORE next enters
          : fo(localFrame, chStart + CH_DUR - 20, 20); // last channel fades with scene
        const chOpacity = Math.min(chIn, chOut);

        // Icon entrance — scale + slide from side
        const iconProg = sp(localFrame, chStart + 2, BOUNCE, 20);
        const iconScale = interpolate(iconProg, [0, 1], [0.3, 1]);
        const iconSlide = interpolate(iconProg, [0, 1], [ch.position === 'left' ? -80 : 80, 0]);

        // Text entrance — slide from opposite side
        const textProg = sp(localFrame, chStart + 8, SOFT, 22);
        const textSlide = interpolate(textProg, [0, 1], [ch.position === 'left' ? 60 : -60, 0]);

        // Glow ramp
        const glowProg = fi(localFrame, chStart + 12, chStart + 50, 0, 1);
        const float = organicFloat(localFrame, `ch2-${i}`, 5);

        // Icon placement
        const iconX = ch.position === 'left' ? '28%' : '72%';
        const textX = ch.position === 'left' ? '62%' : '38%';

        return (
          <AbsoluteFill key={i} style={{ opacity: chOpacity }}>
            {/* Large ambient glow behind icon */}
            <div style={{
              position: 'absolute',
              left: iconX, top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 350, height: 350, borderRadius: '50%',
              background: `radial-gradient(circle, ${ch.accent} 0%, transparent 65%)`,
              filter: 'blur(50px)',
              opacity: glowProg * 0.5,
              pointerEvents: 'none',
            }} />

            {/* Icon — large, centered on its side */}
            <div style={{
              position: 'absolute',
              left: iconX, top: '50%',
              transform: `translate(-50%, calc(-50% + ${float.y}px)) scale(${iconScale}) translateX(${iconSlide}px)`,
              opacity: iconProg,
            }}>
              <ch.Icon frame={localFrame} delay={chStart + 3} color={ch.color} size={130} />
            </div>

            {/* Text + chips — on the opposite side */}
            <div style={{
              position: 'absolute',
              left: textX, top: '50%',
              transform: `translate(-50%, -50%) translateX(${textSlide}px)`,
              opacity: textProg,
              display: 'flex', flexDirection: 'column',
              alignItems: ch.position === 'left' ? 'flex-start' : 'flex-end',
              gap: 18, maxWidth: 480,
            }}>
              {/* Label */}
              <BloomText size={48} weight={700} glow={glowProg} color={C.text}
                style={{ textAlign: ch.position === 'left' ? 'left' : 'right' }}>
                {ch.label}
              </BloomText>

              {/* Subtitle */}
              <div style={{
                fontFamily: FONT, fontSize: 18, fontWeight: 400,
                color: C.textMuted, lineHeight: 1.5,
                textAlign: ch.position === 'left' ? 'left' : 'right',
                opacity: fi(localFrame, chStart + 15, chStart + 30),
              }}>
                {ch.sub}
              </div>

              {/* Accent line */}
              <div style={{
                width: fi(localFrame, chStart + 18, chStart + 40) * 200,
                height: 2, borderRadius: 1,
                background: `linear-gradient(${ch.position === 'left' ? '90deg' : '270deg'}, ${ch.color}80, transparent)`,
                boxShadow: `0 0 8px ${ch.accent}`,
              }} />

              {/* Chips row */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 8,
                justifyContent: ch.position === 'left' ? 'flex-start' : 'flex-end',
              }}>
                {ch.chips.map((chip, ci) => {
                  const chipStart = chStart + 22 + ci * 5;
                  const chipProg = sp(localFrame, chipStart, SNAP, 14);
                  return (
                    <div key={ci} style={{
                      fontFamily: FONT_MONO, fontSize: 12, fontWeight: 500,
                      color: ch.color, letterSpacing: '0.04em',
                      padding: '6px 16px', borderRadius: 8,
                      background: `${ch.color}08`,
                      border: `1px solid ${ch.color}25`,
                      boxShadow: `0 0 ${6 * glowProg}px ${ch.color}12`,
                      opacity: chipProg,
                      transform: `translateY(${interpolate(chipProg, [0, 1], [12, 0])}px)`,
                    }}>
                      {chip}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decorative ring behind icon */}
            <div style={{
              position: 'absolute',
              left: iconX, top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 220, height: 220, borderRadius: '50%',
              border: `1px solid ${ch.color}15`,
              opacity: glowProg * 0.5,
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              left: iconX, top: '50%',
              transform: `translate(-50%, -50%) rotate(${localFrame * 0.3}deg)`,
              width: 280, height: 280, borderRadius: '50%',
              border: `1px dashed ${ch.color}0c`,
              opacity: glowProg * 0.3,
              pointerEvents: 'none',
            }} />
          </AbsoluteFill>
        );
      })}

      {/* Progress dots at bottom — show which channel we're on */}
      <div style={{
        position: 'absolute', bottom: 80, width: '100%',
        display: 'flex', justifyContent: 'center', gap: 14,
      }}>
        {channelData.map((ch, i) => {
          const chStart = CH_STARTS[i];
          const active = localFrame >= chStart && localFrame < chStart + CH_DUR;
          const past = localFrame >= chStart + CH_DUR;
          return (
            <div key={i} style={{
              width: active ? 28 : 8,
              height: 8, borderRadius: 4,
              background: active ? ch.color : past ? `${ch.color}60` : `${C.textDim}40`,
              boxShadow: active ? `0 0 10px ${ch.accent}` : 'none',
              transition: 'width 0.2s',
            }} />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// ─── SCENE 3: PROBLEM ───────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

// 8s(480)="But you don't know", 9.77s(586)="what they're looking for,"
// 11s(660)="or what they think," + "why they leave."
const problemLines = [
  { text: "But you don't know", delay: 8, size: 50 },          // 8s → localFrame 8
  { text: "what they're looking for,", delay: 106, size: 48 },  // 9.77s → globalFrame 586
  { text: 'or what they think,', delay: 180, size: 48 },        // 11s → localFrame 180
  { text: 'why they leave.', delay: 244, size: 58 },            // ~12.1s → global frame 724
];

const Scene3_Problem: React.FC<{ frame: number }> = ({ frame }) => {
  // 8s – 13s (frames 480–780)
  const localFrame = frame - 480;
  const sceneIn = fi(localFrame, 0, 20);
  const sceneOut = fo(localFrame, 297, 20);
  const opacity = Math.min(sceneIn, sceneOut);

  const dangerPulse = fi(localFrame, 60, 297, 0, 0.35);
  const dangerBreathe = breathe(localFrame, 0.07, 0.18);

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Purple warning vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 80% 70% at center, transparent 35%, rgba(139, 92, 246, ${dangerPulse * dangerBreathe}) 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Floating "?" orbs */}
      {[
        { x: 120, y: 180, d: 35, s: 0.7 },
        { x: 1700, y: 220, d: 60, s: 0.8 },
        { x: 170, y: 720, d: 90, s: 0.55 },
        { x: 1680, y: 700, d: 115, s: 0.7 },
        { x: 960, y: 130, d: 50, s: 0.45 },
        { x: 500, y: 800, d: 140, s: 0.5 },
        { x: 1400, y: 850, d: 155, s: 0.4 },
      ].map((q, i) => {
        const qProg = sp(localFrame, q.d, { damping: 22, stiffness: 80 }, 25);
        const float = organicFloat(localFrame, `q-${i}`, 12);
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: q.x + float.x, top: q.y + float.y,
              opacity: qProg * 0.35,
              transform: `scale(${q.s}) rotate(${float.rotate * 4}deg)`,
            }}
          >
            <svg width={60} height={60} viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="26" stroke={C.purple} strokeWidth="1.8" opacity="0.5" fill={`${C.purple}06`} />
              <text x="30" y="38" textAnchor="middle" fontFamily={FONT} fontSize="28" fontWeight="700" fill={C.purple} opacity="0.7">?</text>
            </svg>
          </div>
        );
      })}

      {/* Main text block */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 20,
      }}>
        {problemLines.map((line, i) => {
          const lProg = sp(localFrame, line.delay, SOFT, 20);
          const lY = interpolate(lProg, [0, 1], [28, 0]);
          const lGlow = fi(localFrame, line.delay + 12, line.delay + 40, 0, 0.85);
          const isLast = i === problemLines.length - 1;

          return (
            <div
              key={i}
              style={{
                opacity: lProg,
                transform: `translateY(${lY}px)`,
              }}
            >
              <BloomText
                size={line.size}
                weight={isLast ? 800 : 600}
                glow={lGlow}
                color={isLast ? C.purple : C.text}
                gradient={isLast}
              >
                {line.text}
              </BloomText>
            </div>
          );
        })}
      </div>

      {/* Subtle warning scan lines */}
      {localFrame > 150 && (
        <>
          <div style={{
            position: 'absolute', top: '18%', left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent 10%, ${C.purple}${Math.round(fi(localFrame, 150, 250, 0, 30)).toString(16).padStart(2, '0')} 50%, transparent 90%)`,
          }} />
          <div style={{
            position: 'absolute', bottom: '22%', left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent 15%, ${C.purple}${Math.round(fi(localFrame, 170, 270, 0, 20)).toString(16).padStart(2, '0')} 50%, transparent 85%)`,
          }} />
        </>
      )}
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// ─── SCENE 4: SOLUTION ──────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

const Scene4_Solution: React.FC<{ frame: number }> = ({ frame }) => {
  // 13s – 17s (frames 780–1020)
  const localFrame = frame - 780;
  const sceneIn = fi(localFrame, 0, 20);
  const sceneOut = fo(localFrame, 210, 30);
  const opacity = Math.min(sceneIn, sceneOut);

  const centerX = 960;
  const centerY = 420;
  const nodeRadius = 300;

  // Nodes positioned radially
  const nodes = [
    { angle: -90, color: C.cyan, label: 'WEB' },
    { angle: 30, color: C.red, label: 'STORE' },
    { angle: 150, color: C.purple, label: 'SOCIAL' },
  ];

  const crowProg = sp(localFrame, 25, SNAP, 28);
  const crowGlow = fi(localFrame, 35, 140, 0, 1);
  const lineProgress = fi(localFrame, 60, 160, 0, 1);

  // Pulse waves
  const pulseCount = 3;

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Radial pulse waves */}
      {Array.from({ length: pulseCount }, (_, i) => {
        const waveFrame = (localFrame - 45 + i * 30) % 100;
        const waveR = fi(waveFrame, 0, 70, 0, 1) * 450;
        const waveO = fi(waveFrame, 0, 70, 0.25, 0);
        return (
          <div key={i} style={{
            position: 'absolute', left: centerX, top: centerY,
            width: waveR, height: waveR, borderRadius: '50%',
            border: `1.5px solid ${C.purple}`,
            transform: 'translate(-50%, -50%)',
            opacity: localFrame > 45 ? waveO : 0,
            pointerEvents: 'none',
          }} />
        );
      })}

      {/* Connection lines + Radial nodes (lines follow converging nodes) */}
      {nodes.map((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const convergeFactor = fi(localFrame, 100, 220, 0, 0.25);
        const nx = centerX + nodeRadius * (1 - convergeFactor) * Math.cos(rad);
        const ny = centerY + nodeRadius * (1 - convergeFactor) * Math.sin(rad);

        return (
          <ConnectionLine
            key={`line-${i}`}
            x1={nx} y1={ny} x2={centerX} y2={centerY}
            progress={lineProgress} color={node.color}
          />
        );
      })}

      {nodes.map((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const convergeFactor = fi(localFrame, 100, 220, 0, 0.25);
        const nx = centerX + nodeRadius * (1 - convergeFactor) * Math.cos(rad);
        const ny = centerY + nodeRadius * (1 - convergeFactor) * Math.sin(rad);

        const nodeProg = sp(localFrame, 8, SNAP, 22);
        const float = organicFloat(localFrame, `node-${i}`, 5);

        return (
          <div key={i} style={{
            position: 'absolute', left: nx + float.x, top: ny + float.y,
            transform: `translate(-50%, -50%) scale(${interpolate(nodeProg, [0, 1], [0.4, 1])})`,
            opacity: nodeProg,
          }}>
            {/* Node card — glass style */}
            <div style={{
              background: `rgba(255, 255, 255, 0.06)`,
              backdropFilter: 'blur(24px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
              border: `1px solid rgba(255, 255, 255, 0.12)`,
              borderTop: `1px solid rgba(255, 255, 255, 0.18)`,
              borderRadius: 18,
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.3),
                0 0 ${25 * lineProgress}px ${node.color}15,
                inset 0 1px 0 rgba(255, 255, 255, 0.08)
              `,
              padding: '22px 36px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              position: 'relative',
            }}>
              <SpecularHighlight />
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                backgroundColor: node.color,
                boxShadow: `0 0 16px ${node.color}`,
                opacity: 0.8 + lineProgress * 0.2,
              }} />
              <div style={{
                fontFamily: FONT, fontSize: 17, fontWeight: 700,
                color: node.color, letterSpacing: '0.12em',
                textShadow: `0 0 10px ${node.color}50`,
              }}>
                {node.label}
              </div>
            </div>
          </div>
        );
      })}

      {/* Center CROW icon — hero highlight */}
      <div style={{
        position: 'absolute', left: centerX, top: centerY,
        transform: `translate(-50%, -50%) scale(${interpolate(crowProg, [0, 1], [0.2, 1])})`,
        opacity: crowProg,
      }}>
        {/* Outer glow ring to highlight CROW as the focal point */}
        <div style={{
          position: 'absolute', inset: -60,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.purpleGlow} 0%, ${C.pinkGlow} 40%, transparent 70%)`,
          filter: 'blur(30px)',
          opacity: crowGlow * 0.8,
          pointerEvents: 'none',
        }} />
        <CrowIcon glow={crowGlow} size={220} />
      </div>

      {/* Heading text */}
      <div style={{
        position: 'absolute', bottom: 140, width: '100%',
        display: 'flex', justifyContent: 'center',
        opacity: sp(localFrame, 50, SOFT, 25),
        transform: `translateY(${interpolate(sp(localFrame, 50, SOFT, 25), [0, 1], [25, 0])}px)`,
      }}>
        <BloomText size={58} weight={700} glow={fi(localFrame, 70, 160, 0, 1)}>
          CROW brings all that into one place.
        </BloomText>
      </div>

      {/* Convergence shockwave burst */}
      {localFrame > 120 && localFrame < 175 && (
        <div style={{
          position: 'absolute', left: centerX, top: centerY,
          width: fi(localFrame, 120, 175, 0, 1) * 700,
          height: fi(localFrame, 120, 175, 0, 1) * 700,
          borderRadius: '50%',
          border: `2px solid ${C.purpleLight}`,
          transform: 'translate(-50%, -50%)',
          opacity: fo(localFrame, 140, 35),
          boxShadow: `0 0 30px ${C.purpleGlow}`,
          pointerEvents: 'none',
        }} />
      )}
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// ─── SCENE 5: CTA ───────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

const Scene5_CTA: React.FC<{ frame: number }> = ({ frame }) => {
  // 17s – 25s (frames 1020–1500)
  const localFrame = frame - 1020;
  const sceneIn = fi(localFrame, 0, 20);

  const crowLetters = ['C', 'R', 'O', 'W'];
  const LETTER_STAGGER = 7;
  const tagProg = sp(localFrame, 65, SOFT, 22);
  const tagGlow = fi(localFrame, 80, 140, 0, 1);
  const burstProg = fi(localFrame, 25, 90, 0, 1);
  const burstRot = localFrame * 0.12;
  const logoProg = sp(localFrame, 3, BOUNCE, 22);

  return (
    <AbsoluteFill style={{ opacity: sceneIn }}>
      {/* Starburst (inner fast) */}
      <div style={{
        position: 'absolute', left: '50%', top: '40%',
        transform: `translate(-50%, -50%) rotate(${burstRot}deg)`,
        opacity: burstProg * 0.2,
      }}>
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0, left: -1,
            width: 2, height: fi(localFrame, 25 + i, 70 + i, 0, 1) * 380,
            background: `linear-gradient(180deg, ${C.purple}30, transparent)`,
            transformOrigin: '50% 0%',
            transform: `rotate(${(360 / 24) * i}deg)`,
          }} />
        ))}
      </div>

      {/* Starburst (outer slow) */}
      <div style={{
        position: 'absolute', left: '50%', top: '40%',
        transform: `translate(-50%, -50%) rotate(${-burstRot * 0.4}deg)`,
        opacity: burstProg * 0.08,
      }}>
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0, left: -0.5,
            width: 1, height: fi(localFrame, 40 + i * 2, 100 + i * 2, 0, 1) * 520,
            background: `linear-gradient(180deg, ${C.pink}20, transparent)`,
            transformOrigin: '50% 0%',
            transform: `rotate(${(360 / 16) * i}deg)`,
          }} />
        ))}
      </div>

      {/* Logo */}
      <div style={{
        position: 'absolute', left: '50%', top: '22%',
        transform: `translate(-50%, -50%) scale(${interpolate(logoProg, [0, 1], [0.4, 1])})`,
        opacity: logoProg,
        filter: `drop-shadow(0 0 20px ${C.purpleGlow})`,
      }}>
        <Img src={staticFile('logo.png')} style={{ width: 100, height: 100 }} />
      </div>

      {/* CROW letters */}
      <div style={{
        position: 'absolute', top: '36%', width: '100%',
        display: 'flex', justifyContent: 'center', gap: 10,
      }}>
        {crowLetters.map((letter, i) => {
          const lStart = 12 + i * LETTER_STAGGER;
          const lProg = sp(localFrame, lStart, BOUNCE, 16);
          const lGlow = fi(localFrame, lStart + 12, lStart + 40, 0, 1);
          return (
            <div key={i} style={{
              opacity: lProg,
              transform: `scale(${interpolate(lProg, [0, 1], [0.5, 1])})`,
            }}>
              <span style={{
                fontFamily: FONT, fontSize: 120, fontWeight: 900,
                background: C.gradientFull,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: `drop-shadow(0 0 ${22 * lGlow}px ${C.purpleGlow}) drop-shadow(0 0 ${50 * lGlow}px ${C.pinkGlow})`,
                letterSpacing: '-0.02em',
              }}>
                {letter}
              </span>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{
        position: 'absolute', top: '55%', left: '50%',
        transform: 'translateX(-50%)',
        width: fi(localFrame, 50, 80) * 420,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${C.purple}70, ${C.pink}60, ${C.purpleLight}40, transparent)`,
        borderRadius: 1,
        boxShadow: `0 0 10px ${C.purpleGlow}`,
      }} />

      {/* Tagline */}
      <div style={{
        position: 'absolute', top: '61%', width: '100%',
        display: 'flex', justifyContent: 'center',
        opacity: tagProg,
        transform: `translateY(${interpolate(tagProg, [0, 1], [18, 0])}px)`,
      }}>
        <BloomText size={50} weight={600} glow={tagGlow}>
          Understand your customers.
        </BloomText>
      </div>

      {/* CTA badge */}
      <div style={{
        position: 'absolute', top: '75%', width: '100%',
        display: 'flex', justifyContent: 'center',
        opacity: fi(localFrame, 90, 115),
      }}>
        <div style={{
          ...premiumGlass(fi(localFrame, 100, 140), C.purple),
          padding: '14px 44px', borderRadius: 14,
          position: 'relative',
        }}>
          <SpecularHighlight />
          <span style={{
            fontFamily: FONT_MONO, fontSize: 20, fontWeight: 600,
            color: C.purpleLight, letterSpacing: '0.06em',
            textShadow: `0 0 12px ${C.purpleGlow}`,
          }}>
            crowai.dev
          </span>
          <LightSweep frame={localFrame} start={110} dur={30} />
        </div>
      </div>

      {/* Rising sparkles */}
      {Array.from({ length: 25 }, (_, i) => {
        const pStart = 15 + i * 5;
        const pProg = fi(localFrame, pStart, pStart + 110, 0, 1);
        const px = W * 0.15 + random(`cta-px-${i}`) * W * 0.7;
        const py = H - pProg * (H * 0.85 + random(`cta-ph-${i}`) * H * 0.15);
        const drift = Math.sin(localFrame * 0.025 + i) * 25;
        const pSize = random(`cta-ps-${i}`) * 3.5 + 1;
        const pColor = [C.purple, C.pink, C.purpleLight, C.cyan][i % 4];
        return (
          <div key={i} style={{
            position: 'absolute', left: px + drift, top: py,
            width: pSize, height: pSize, borderRadius: '50%',
            backgroundColor: pColor,
            opacity: pProg * (1 - pProg) * 2.5 * 0.5,
            boxShadow: `0 0 ${pSize * 4}px ${pColor}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// ─── MAIN COMPOSITION ───────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

export const CrowAd_Intern: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Voiceover audio — synced to scene timestamps */}
      <Audio src={staticFile('audio/samanthaad-1_2QGqWFdk.wav')} volume={0.95} />

      {/* ×2 scale wrapper: 1920×1080 → 3840×2160 */}
      <div style={{
        width: W, height: H,
        transform: 'scale(2)',
        transformOrigin: 'top left',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Background stack */}
        <GradientMesh />
        <SparkleField />
        <CinematicVignette intensity={0.75} />
        <LightLeak intensity={0.08} />
        <ScanLines />

        {/* Scene layers */}
        {/* S1: 0-4s (0-240) */}
        {frame < 260 && <Scene1_Hook frame={frame} />}
        {/* S2: 4-8.7s (240-520) — fully invisible by frame 519 */}
        {frame >= 220 && frame < 520 && <Scene2_Channels frame={frame} />}
        {/* S3: 8-13.3s (480-797) — fully gone by frame 797 */}
        {frame >= 520 && frame < 798 && <Scene3_Problem frame={frame} />}
        {/* S4: 13.3-17s (798-1020) */}
        {frame >= 798 && frame < 1050 && <Scene4_Solution frame={frame} />}
        {/* S5: 17-25s (1020-1500) */}
        {frame >= 1000 && <Scene5_CTA frame={frame} />}

        {/* Global overlays */}
        <FilmGrain />

        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 28, left: 50, right: 50, height: 1,
          background: `linear-gradient(90deg, transparent, ${C.purple}25, ${C.pink}18, transparent)`,
          opacity: breathe(frame, 0.03, 0.3),
        }} />
        {/* Bottom accent line */}
        <div style={{
          position: 'absolute', bottom: 28, left: 50, right: 50, height: 1,
          background: `linear-gradient(90deg, transparent, ${C.purple}15, ${C.purpleLight}10, transparent)`,
          opacity: breathe(frame, 0.025, 0.25),
        }} />
      </div>
    </AbsoluteFill>
  );
};
