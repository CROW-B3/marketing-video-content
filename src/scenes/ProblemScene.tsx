import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, random } from 'remotion';
import { noise2D } from '@remotion/noise';
import { COLORS, FONTS } from '../styles';
import { fadeIn, slideUp } from '../utils';

// ── constants ────────────────────────────────────────────────────────────────

const WARNING = '#ef4444';
const WARNING_DIM = 'rgba(239,68,68,0.35)';

interface Silo {
  label: string;
  icon: React.ReactNode;
}

const SILOS: Silo[] = [
  {
    label: 'Web Analytics',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="18" stroke={COLORS.accent} strokeWidth="2" />
        <ellipse cx="24" cy="24" rx="10" ry="18" stroke={COLORS.accent} strokeWidth="1.5" />
        <line x1="6" y1="24" x2="42" y2="24" stroke={COLORS.accent} strokeWidth="1.5" />
        <line x1="24" y1="6" x2="24" y2="42" stroke={COLORS.accent} strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: 'Social Media',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="10" width="36" height="24" rx="12" stroke={COLORS.accent} strokeWidth="2" />
        <circle cx="16" cy="22" r="2.5" fill={COLORS.accent} />
        <circle cx="24" cy="22" r="2.5" fill={COLORS.accent} />
        <circle cx="32" cy="22" r="2.5" fill={COLORS.accent} />
        <path d="M14 34 L10 40" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Physical Retail',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="18" width="32" height="22" rx="2" stroke={COLORS.accent} strokeWidth="2" />
        <path d="M6 18 L24 6 L42 18" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="19" y="28" width="10" height="12" rx="1" stroke={COLORS.accent} strokeWidth="1.5" />
      </svg>
    ),
  },
];

// ── floating data fragment seeds ─────────────────────────────────────────────

interface DataFragment {
  id: number;
  startX: number;
  startY: number;
  driftX: number;
  driftY: number;
  size: number;
  opacity: number;
  rotation: number;
  isRect: boolean;
}

const DATA_FRAGMENTS: DataFragment[] = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  startX: random(`frag-x-${i}`) * 1920,
  startY: random(`frag-y-${i}`) * 1080,
  driftX: (random(`frag-dx-${i}`) - 0.5) * 120,
  driftY: (random(`frag-dy-${i}`) - 0.5) * 80,
  size: 3 + random(`frag-sz-${i}`) * 6,
  opacity: 0.08 + random(`frag-op-${i}`) * 0.14,
  rotation: random(`frag-rot-${i}`) * 360,
  isRect: random(`frag-shape-${i}`) > 0.5,
}));

// ── scan line constants ──────────────────────────────────────────────────────

const SCAN_LINE_COUNT = 6;
const SCAN_LINES = Array.from({ length: SCAN_LINE_COUNT }, (_, i) => ({
  id: i,
  offset: (i / SCAN_LINE_COUNT) * 1080,
  speed: 0.6 + random(`scan-spd-${i}`) * 0.4,
  opacity: 0.04 + random(`scan-op-${i}`) * 0.06,
}));

// ── helper: staggered silo entrance ──────────────────────────────────────────

function useSiloAnimation(index: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each silo enters 15 frames after the previous one, starting at frame 30.
  const enterFrame = 30 + index * 20;

  const progress = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 30,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [50, 0]);

  return { opacity, translateY };
}

// ── sub-components ───────────────────────────────────────────────────────────

function AuroraBackground() {
  const frame = useCurrentFrame();

  // Red-tinted blob drifting with sine waves
  const redBlobX = 50 + Math.sin(frame * 0.008) * 15;
  const redBlobY = 40 + Math.cos(frame * 0.006) * 12;

  // Dark purple blob with different frequencies
  const purpleBlobX = 55 + Math.sin(frame * 0.005 + 1.5) * 20;
  const purpleBlobY = 55 + Math.cos(frame * 0.007 + 0.8) * 15;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* Red-tinted gradient blob */}
      <div
        style={{
          position: 'absolute',
          left: `${redBlobX}%`,
          top: `${redBlobY}%`,
          transform: 'translate(-50%, -50%)',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Dark purple secondary blob */}
      <div
        style={{
          position: 'absolute',
          left: `${purpleBlobX}%`,
          top: `${purpleBlobY}%`,
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.04) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}

function AmbientGlowOrbs() {
  const frame = useCurrentFrame();

  // Warning-red orb drifting slowly
  const redOrbX = 30 + Math.sin(frame * 0.004) * 8;
  const redOrbY = 60 + Math.cos(frame * 0.003) * 6;

  // Purple orb drifting slowly
  const purpleOrbX = 70 + Math.sin(frame * 0.003 + 2.0) * 10;
  const purpleOrbY = 35 + Math.cos(frame * 0.005 + 1.0) * 8;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* Warning-red glow orb */}
      <div
        style={{
          position: 'absolute',
          left: `${redOrbX}%`,
          top: `${redOrbY}%`,
          transform: 'translate(-50%, -50%)',
          width: 450,
          height: 450,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
          opacity: 0.06,
        }}
      />
      {/* Purple glow orb */}
      <div
        style={{
          position: 'absolute',
          left: `${purpleOrbX}%`,
          top: `${purpleOrbY}%`,
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
          opacity: 0.04,
        }}
      />
    </div>
  );
}

function FloatingFragments() {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {DATA_FRAGMENTS.map((frag) => {
        const progress = interpolate(frame, [0, 300], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        // Use noise2D for organic drift instead of linear movement
        const x = frag.startX + noise2D('frag-x' + frag.id, frame * 0.005, frag.id * 0.3) * frag.driftX;
        const y = frag.startY + noise2D('frag-y' + frag.id, frame * 0.004, frag.id * 0.3) * frag.driftY;
        const rot = frag.rotation + progress * 45;

        // Fragments fade in starting at frame 20, stay visible
        const fragOpacity = interpolate(frame, [20, 40], [0, frag.opacity], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={frag.id}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: frag.isRect ? frag.size * 2.5 : frag.size,
              height: frag.size,
              backgroundColor: frag.id % 3 === 0 ? WARNING_DIM : 'rgba(0,212,255,0.2)',
              borderRadius: frag.isRect ? 1 : frag.size / 2,
              transform: `rotate(${rot}deg)`,
              opacity: fragOpacity,
            }}
          />
        );
      })}
    </div>
  );
}

function ScanLines() {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {SCAN_LINES.map((line) => {
        const yPos = (line.offset + frame * line.speed * 2) % 1120 - 20;

        return (
          <div
            key={line.id}
            style={{
              position: 'absolute',
              left: 0,
              top: yPos,
              width: '100%',
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, rgba(239,68,68,${line.opacity}) 20%, rgba(239,68,68,${line.opacity * 1.5}) 50%, rgba(239,68,68,${line.opacity}) 80%, transparent 100%)`,
            }}
          />
        );
      })}
    </div>
  );
}

function FilmGrain() {
  const frame = useCurrentFrame();

  // Shift the grain pattern every 2 frames for a subtle flicker
  const grainSeed = Math.floor(frame / 2);
  const grainX = random(`grain-x-${grainSeed}`) * 200;
  const grainY = random(`grain-y-${grainSeed}`) * 200;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px',
        backgroundPosition: `${grainX}px ${grainY}px`,
        mixBlendMode: 'overlay',
      }}
    />
  );
}

function SiloCard({ silo, index }: { silo: Silo; index: number }) {
  const frame = useCurrentFrame();
  const { opacity, translateY } = useSiloAnimation(index);

  // Subtle scale pulse after entrance (cycles every 60 frames)
  const enterFrame = 30 + index * 20 + 30; // after entrance animation completes
  const pulsePhase = Math.max(0, frame - enterFrame);
  const scalePulse = pulsePhase > 0
    ? 1 + Math.sin((pulsePhase / 60) * Math.PI * 2) * 0.015
    : 1;

  // Animated inner glow intensity (cycles every 90 frames, offset per card)
  const glowPhase = Math.max(0, frame - (30 + index * 20));
  const glowIntensity = glowPhase > 0
    ? 0.3 + Math.sin((glowPhase / 90) * Math.PI * 2 + index * 1.2) * 0.15
    : 0.3;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scalePulse})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        width: 280,
        height: 200,
        borderRadius: 20,
        border: '1.5px solid rgba(148,163,184,0.2)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: `
          radial-gradient(
            ellipse at 50% 40%,
            rgba(0,212,255,${glowIntensity * 0.08}) 0%,
            rgba(18,18,26,0.5) 60%
          ),
          linear-gradient(
            180deg,
            rgba(18,18,26,0.45) 0%,
            rgba(12,12,18,0.55) 100%
          )
        `,
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.4),
          inset 0 1px 0 rgba(255,255,255,0.06),
          inset 0 0 30px rgba(0,212,255,${glowIntensity * 0.03}),
          0 0 ${20 + glowIntensity * 15}px rgba(0,212,255,${glowIntensity * 0.06})
        `,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {silo.icon}
      </div>
      <span
        style={{
          fontFamily: FONTS.primary,
          fontSize: 22,
          fontWeight: 600,
          color: COLORS.text,
          letterSpacing: '-0.01em',
        }}
      >
        {silo.label}
      </span>
    </div>
  );
}

function BrokenConnection({ index }: { index: number }) {
  const frame = useCurrentFrame();

  // Connections appear after the second silo has entered (index 0-based for the gap).
  const enterFrame = 30 + (index + 1) * 20 + 10;
  const opacity = fadeIn(frame, enterFrame, 15);

  // Dash animation offset for a subtle "broken signal" feel.
  const dashOffset = interpolate(frame, [0, 300], [0, 40]);

  // Pulsing red glow on the X mark (period of ~40 frames)
  const pulsePhase = Math.max(0, frame - enterFrame - 15);
  const pulse = pulsePhase > 0
    ? 0.6 + Math.sin((pulsePhase / 40) * Math.PI * 2) * 0.4
    : 0.6;

  // Subtle shake on the X mark
  const shakeX = pulsePhase > 0
    ? Math.sin((pulsePhase / 8) * Math.PI * 2) * 0.8
    : 0;
  const shakeY = pulsePhase > 0
    ? Math.cos((pulsePhase / 10) * Math.PI * 2) * 0.5
    : 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        opacity,
      }}
    >
      <svg width="80" height="40" viewBox="0 0 80 40">
        {/* dashed broken line */}
        <line
          x1="0"
          y1="20"
          x2="80"
          y2="20"
          stroke={WARNING}
          strokeWidth="2.5"
          strokeDasharray="8 6"
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          opacity={0.7}
        />
        {/* pulsing red glow behind the X */}
        <circle
          cx="40"
          cy="20"
          r={10 + pulse * 4}
          fill="none"
          stroke={WARNING}
          strokeWidth="1"
          opacity={pulse * 0.3}
        />
        {/* "X" mark in the middle with shake */}
        <g transform={`translate(${shakeX}, ${shakeY})`}>
          <line
            x1="34"
            y1="12"
            x2="46"
            y2="28"
            stroke={WARNING}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={0.5 + pulse * 0.5}
          />
          <line
            x1="46"
            y1="12"
            x2="34"
            y2="28"
            stroke={WARNING}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={0.5 + pulse * 0.5}
          />
        </g>
      </svg>
    </div>
  );
}

// ── main scene ───────────────────────────────────────────────────────────────

const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  // ── heading animation (frames 0-20) ──
  const headingOpacity = fadeIn(frame, 0, 20);
  const headingY = slideUp(frame, 0, 20);

  // ── subtitle animation (frames 180-210) ──
  const subtitleOpacity = fadeIn(frame, 180, 25);
  const subtitleY = slideUp(frame, 180, 25);

  // ── pulsing text-shadow for heading ──
  const headingGlowPulse = 0.3 + Math.sin(frame * 0.06) * 0.1;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONTS.primary,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── aurora gradient mesh background ── */}
      <AuroraBackground />

      {/* ── ambient glow orbs ── */}
      <AmbientGlowOrbs />

      {/* ── floating data fragments ── */}
      <FloatingFragments />

      {/* ── animated scan lines ── */}
      <ScanLines />

      {/* ── heading ── */}
      <div
        style={{
          opacity: headingOpacity,
          transform: `translateY(${headingY}px)`,
          marginBottom: 80,
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontFamily: FONTS.primary,
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.accent,
            margin: 0,
            letterSpacing: '-0.03em',
            textAlign: 'center',
            textShadow: `0 0 40px rgba(239, 68, 68, ${headingGlowPulse}), 0 0 80px rgba(239, 68, 68, ${headingGlowPulse * 0.5})`,
          }}
        >
          The Problem
        </h1>
      </div>

      {/* ── silos row ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        {SILOS.map((silo, i) => (
          <React.Fragment key={silo.label}>
            <SiloCard silo={silo} index={i} />
            {i < SILOS.length - 1 && <BrokenConnection index={i} />}
          </React.Fragment>
        ))}
      </div>

      {/* ── subtitle ── */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          marginTop: 70,
          maxWidth: 800,
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontFamily: FONTS.primary,
            fontSize: 28,
            fontWeight: 400,
            color: COLORS.textMuted,
            margin: 0,
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
          }}
        >
          Customer signals remain{' '}
          <span style={{ color: WARNING, fontWeight: 600 }}>fragmented</span>{' '}
          across isolated systems
        </p>
      </div>

      {/* ── film grain overlay ── */}
      <FilmGrain />
    </div>
  );
};

export default ProblemScene;
