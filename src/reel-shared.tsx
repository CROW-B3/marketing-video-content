import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  spring,
  interpolate,
  random,
} from 'remotion';

// ─── Theme ───────────────────────────────────────────────────────────────────

export const COLORS = {
  bg: '#000000',
  bgCard: 'rgba(255, 255, 255, 0.03)',
  text: '#ffffff',
  textMuted: '#a0a0b8',
  red: '#ff2d55',
  redGlow: '#ff2d5560',
  purple: '#8b5cf6',
  purpleGlow: '#8b5cf660',
  cyan: '#00d4ff',
  gradient: 'linear-gradient(135deg, #ff2d55, #8b5cf6)',
  gradientCyan: 'linear-gradient(135deg, #8b5cf6, #00d4ff)',
} as const;

export const FONTS = {
  primary: 'Sora, system-ui, sans-serif',
} as const;

export const SAFE = {
  h: 120,
  top: 120,
  bottom: 250,
} as const;

export const SPRING_SNAP = { damping: 12, stiffness: 200 };
export const SPRING_SOFT = { damping: 18, stiffness: 120 };
export const FPS = 30;

// ─── Animation Helpers ───────────────────────────────────────────────────────

export function whoosh(frame: number, start: number, dur = 10) {
  const prog = spring({
    frame: frame - start,
    fps: FPS,
    config: SPRING_SNAP,
    durationInFrames: dur,
  });
  return {
    opacity: interpolate(prog, [0, 1], [0, 1]),
    translateY: interpolate(prog, [0, 1], [40, 0]),
  };
}

export function glowRamp(frame: number, start: number, dur = 15): number {
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

export function breathe(frame: number, speed = 0.06, amplitude = 0.15): number {
  return Math.sin(frame * speed) * amplitude + (1 - amplitude);
}

// ─── Glass / Card Style Helpers ─────────────────────────────────────────────

export function glassCard(glow = 0): React.CSSProperties {
  return {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 0 ${24 * glow}px ${COLORS.purpleGlow},
      inset 0 1px 0 rgba(255, 255, 255, 0.06)
    `,
  };
}

export function glassChip(glow = 0, accent: string = COLORS.red): React.CSSProperties {
  return {
    background: `${accent}08`,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1.5px solid ${accent}40`,
    boxShadow: `
      0 4px 16px rgba(0, 0, 0, 0.3),
      0 0 ${16 * glow}px ${accent}25,
      inset 0 1px 0 rgba(255, 255, 255, 0.04)
    `,
  };
}

export function gradientBorder(glow = 0): React.CSSProperties {
  return {
    border: '2px solid transparent',
    backgroundImage: `linear-gradient(${COLORS.bg}, ${COLORS.bg}), ${COLORS.gradient}`,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 0 ${20 * glow}px ${COLORS.purpleGlow}
    `,
  };
}

// ─── Enhanced Starfield ─────────────────────────────────────────────────────

const STAR_COUNT = 200;

function buildStars(seed: string) {
  return Array.from({ length: STAR_COUNT }, (_, i) => {
    const colorRand = random(`${seed}-star-c-${i}`);
    let color = COLORS.text;
    if (colorRand > 0.88) color = COLORS.red;
    else if (colorRand > 0.78) color = COLORS.purple;
    else if (colorRand > 0.72) color = COLORS.cyan;

    return {
      x: random(`${seed}-star-x-${i}`) * 1080,
      y: random(`${seed}-star-y-${i}`) * 1920,
      size: random(`${seed}-star-s-${i}`) * 2.5 + 0.3,
      speed: random(`${seed}-star-sp-${i}`) * 0.35 + 0.04,
      baseOpacity: random(`${seed}-star-o-${i}`) * 0.5 + 0.15,
      layer: random(`${seed}-star-l-${i}`) > 0.5 ? 1.4 : 0.5,
      twinklePhase: random(`${seed}-star-tp-${i}`) * Math.PI * 2,
      twinkleSpeed: random(`${seed}-star-ts-${i}`) * 0.08 + 0.06,
      color,
    };
  });
}

const starCache = new Map<string, ReturnType<typeof buildStars>>();
function getStars(seed: string) {
  let stars = starCache.get(seed);
  if (!stars) {
    stars = buildStars(seed);
    starCache.set(seed, stars);
  }
  return stars;
}

export const Starfield: React.FC<{ seed?: string }> = ({ seed = 'shared' }) => {
  const frame = useCurrentFrame();
  const stars = getStars(seed);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {stars.map((s, i) => {
        const drift = frame * s.speed * s.layer;
        const y = ((s.y + drift) % 2040) - 60;
        const twinkle = Math.sin(frame * s.twinkleSpeed + s.twinklePhase) * 0.35 + 0.65;
        const glow = s.color !== COLORS.text ? `0 0 ${s.size * 3}px ${s.color}` : 'none';
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
              boxShadow: glow,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Aurora / Gradient Mesh Background ──────────────────────────────────────

interface AuroraBlob {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  phase: number;
}

function buildBlobs(seed: string): AuroraBlob[] {
  const colors = [COLORS.red, COLORS.purple, '#1a0a3e', COLORS.cyan, '#2d0a1a'];
  return Array.from({ length: 5 }, (_, i) => ({
    x: random(`${seed}-ab-x-${i}`) * 80 + 10,
    y: random(`${seed}-ab-y-${i}`) * 80 + 10,
    size: random(`${seed}-ab-s-${i}`) * 300 + 400,
    color: colors[i % colors.length]!,
    speedX: (random(`${seed}-ab-sx-${i}`) - 0.5) * 0.04,
    speedY: (random(`${seed}-ab-sy-${i}`) - 0.5) * 0.03,
    phase: random(`${seed}-ab-p-${i}`) * Math.PI * 2,
  }));
}

const blobCache = new Map<string, AuroraBlob[]>();
function getBlobs(seed: string) {
  let blobs = blobCache.get(seed);
  if (!blobs) {
    blobs = buildBlobs(seed);
    blobCache.set(seed, blobs);
  }
  return blobs;
}

export const AuroraBackground: React.FC<{ seed?: string; opacity?: number }> = ({
  seed = 'aurora',
  opacity = 0.2,
}) => {
  const frame = useCurrentFrame();
  const blobs = getBlobs(seed);

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity }}>
      {blobs.map((blob, i) => {
        const xOff = Math.sin(frame * blob.speedX + blob.phase) * 10;
        const yOff = Math.cos(frame * blob.speedY + blob.phase * 0.7) * 8;
        const scale = 1 + Math.sin(frame * 0.015 + blob.phase) * 0.1;
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

// ─── Vignette ───────────────────────────────────────────────────────────────

export const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.7 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 70% 60% at center, transparent 30%, rgba(0, 0, 0, ${intensity}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

// ─── Floating Glow Orbs ─────────────────────────────────────────────────────

export const GlowOrb: React.FC<{
  x: number;
  y: number;
  size?: number;
  color?: string;
  speed?: number;
  phase?: number;
}> = ({ x, y, size = 300, color = COLORS.purple, speed = 0.03, phase = 0 }) => {
  const frame = useCurrentFrame();
  const xOff = Math.sin(frame * speed + phase) * 20;
  const yOff = Math.cos(frame * speed * 0.8 + phase) * 15;
  const pulse = breathe(frame, 0.04, 0.2);

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

// ─── Scan Lines ─────────────────────────────────────────────────────────────

export const ScanLines: React.FC<{ opacity?: number }> = ({ opacity = 0.03 }) => {
  const frame = useCurrentFrame();
  const yShift = (frame * 0.5) % 4;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(255, 255, 255, ${opacity}) 2px,
          rgba(255, 255, 255, ${opacity}) 4px
        )`,
        backgroundPosition: `0 ${yShift}px`,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }}
    />
  );
};

// ─── Light Sweep (shimmer that travels across an element) ───────────────────

export const LightSweep: React.FC<{
  frame: number;
  startFrame: number;
  duration?: number;
  angle?: number;
}> = ({ frame, startFrame, duration = 30, angle = -20 }) => {
  const progress = interpolate(frame, [startFrame, startFrame + duration], [-100, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [startFrame, startFrame + 5, startFrame + duration - 5, startFrame + duration], [0, 0.6, 0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        borderRadius: 'inherit',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: `${progress}%`,
          width: '30%',
          height: '100%',
          background: `linear-gradient(${angle}deg, transparent 0%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.12) 55%, transparent 100%)`,
          opacity,
          transform: `skewX(${angle}deg)`,
        }}
      />
    </div>
  );
};

// ─── Noise Overlay ───────────────────────────────────────────────────────────

export const NoiseOverlay: React.FC<{ id?: string }> = ({ id = 'shared-noise' }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.035, mixBlendMode: 'overlay' }}>
      <svg width="100%" height="100%">
        <filter id={id}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves={3}
            seed={Math.floor(frame / 2)}
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

// ─── Gradient Accent Lines (with traveling highlight) ───────────────────────

export const AccentLines: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.05) * 0.15 + 0.3;
  const highlightPos = (frame * 1.5) % 120;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* Top line */}
      <div style={{ position: 'absolute', top: 60, left: 80, right: 80, height: 1 }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            background: COLORS.gradient,
            opacity: pulse,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -1,
            left: `${highlightPos}%`,
            width: 60,
            height: 3,
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: 2,
            filter: 'blur(2px)',
            opacity: pulse * 1.5,
          }}
        />
      </div>
      {/* Bottom line */}
      <div style={{ position: 'absolute', bottom: SAFE.bottom - 30, left: 80, right: 80, height: 1 }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            background: COLORS.gradient,
            opacity: pulse * 0.7,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -1,
            right: `${highlightPos}%`,
            width: 40,
            height: 3,
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: 2,
            filter: 'blur(2px)',
            opacity: pulse,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene Transition Wipe ──────────────────────────────────────────────────

export const SceneWipe: React.FC<{
  frame: number;
  startFrame: number;
  duration?: number;
  direction?: 'up' | 'down';
}> = ({ frame, startFrame, duration = 8, direction = 'up' }) => {
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const yPos = direction === 'up'
    ? interpolate(progress, [0, 1], [100, -10])
    : interpolate(progress, [0, 1], [-10, 100]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg, transparent ${yPos - 5}%, ${COLORS.red}20 ${yPos}%, ${COLORS.purple}15 ${yPos + 2}%, transparent ${yPos + 5}%)`,
        pointerEvents: 'none',
      }}
    />
  );
};
