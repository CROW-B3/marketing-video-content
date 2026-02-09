import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, random } from 'remotion';
import { noise2D } from '@remotion/noise';

const COLORS = {
  background: '#0a0a0f',
  accent: '#00d4ff',
  accentPurple: '#7c3aed',
  text: '#ffffff',
  textMuted: '#94a3b8',
};

const FONT = 'Inter, system-ui, sans-serif';

// ---------------------------------------------------------------------------
// Pre-computed ambient particles (seeded via Remotion's `random` for determinism)
// ---------------------------------------------------------------------------
interface AmbientParticle {
  startX: number;
  startY: number;
  driftX: number;
  driftY: number;
  size: number;
  opacity: number;
  speed: number;
  hue: number; // 0 = cyan, 1 = purple blend
}

const PARTICLE_COUNT = 40;
const particles: AmbientParticle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  startX: random(`px-${i}`) * 1920,
  startY: random(`py-${i}`) * 1080,
  driftX: (random(`dx-${i}`) - 0.5) * 120,
  driftY: (random(`dy-${i}`) - 0.5) * 80,
  size: 1.5 + random(`sz-${i}`) * 3,
  opacity: 0.08 + random(`op-${i}`) * 0.18,
  speed: 0.3 + random(`sp-${i}`) * 0.7,
  hue: random(`hu-${i}`),
}));

// ---------------------------------------------------------------------------
// Pre-computed ambient glow orbs
// ---------------------------------------------------------------------------
interface GlowOrb {
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  color: string;
}

const glowOrbs: GlowOrb[] = [
  {
    baseX: 960,
    baseY: 460,
    size: 560,
    opacity: 0.05,
    color: 'rgba(0, 212, 255',
  },
  {
    baseX: 400,
    baseY: 750,
    size: 500,
    opacity: 0.04,
    color: 'rgba(124, 58, 237',
  },
];

/**
 * SolutionScene - The "aha moment" scene (~10 seconds / 300 frames at 30fps).
 *
 * Transitions from chaos to order: three data sources (Web, Social, Retail)
 * converge on a central glowing CROW hub, followed by a tagline fade-in.
 */
const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------------------------------------------------------------------------
  // Animation helpers
  // ---------------------------------------------------------------------------

  const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

  const springProgress = (delay: number, duration = 30) =>
    spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120 }, durationInFrames: duration });

  // ---------------------------------------------------------------------------
  // Timeline (in frames, 30 fps)
  // ---------------------------------------------------------------------------

  // 0-30: heading fades + slides up
  const headingOpacity = interpolate(frame, [0, 25], [0, 1], clamp);
  const headingY = interpolate(frame, [0, 25], [40, 0], clamp);

  // 30-60: central hub scales in
  const hubScale = frame >= 30 ? springProgress(30, 35) : 0;
  const hubOpacity = interpolate(frame, [30, 50], [0, 1], clamp);

  // Pulsing glow on the hub (subtle sine wave after it appears)
  const pulsePhase = Math.max(0, frame - 60);
  const pulseScale = 1 + 0.04 * Math.sin((pulsePhase / fps) * Math.PI * 2 * 0.8);
  const pulseGlow = 0.6 + 0.3 * Math.sin((pulsePhase / fps) * Math.PI * 2 * 0.8);

  // 55-120: data source nodes appear staggered
  const sourceDelays = [55, 70, 85]; // Web, Social, Retail
  const sourceProgress = sourceDelays.map((d) => ({
    scale: frame >= d ? springProgress(d, 30) : 0,
    opacity: interpolate(frame, [d, d + 20], [0, 1], clamp),
  }));

  // 80-160: connection lines draw from sources to hub
  const lineDelays = [80, 95, 110];
  const lineProgress = lineDelays.map((d) =>
    interpolate(frame, [d, d + 40], [0, 1], clamp),
  );

  // Track when each line just completed (for burst effect)
  const lineBurstProgress = lineDelays.map((d) => {
    const completionFrame = d + 40;
    if (frame < completionFrame) return -1;
    const age = frame - completionFrame;
    if (age > 20) return -1; // burst lasts 20 frames
    return age / 20;
  });

  // 180-240: tagline fades in
  const taglineOpacity = interpolate(frame, [180, 220], [0, 1], clamp);
  const taglineY = interpolate(frame, [180, 220], [30, 0], clamp);

  // ---------------------------------------------------------------------------
  // Orbiting ring rotation (degrees)
  // ---------------------------------------------------------------------------
  const orbitAngle = (frame / fps) * 30; // 30 degrees per second -> slow orbit

  // ---------------------------------------------------------------------------
  // Radial pulse waves from hub (radar ping effect)
  // Emits a new ring every 45 frames once hub is visible
  // ---------------------------------------------------------------------------
  const PULSE_INTERVAL = 45;
  const PULSE_LIFETIME = 60; // frames to fully expand & fade
  const MAX_PULSE_RADIUS = 260;
  const pulseWaves: { progress: number; opacity: number }[] = [];
  if (frame >= 60) {
    // Compute how many pulses have been started
    const elapsed = frame - 60;
    const pulseCount = Math.floor(elapsed / PULSE_INTERVAL) + 1;
    for (let p = 0; p < pulseCount; p++) {
      const pulseStart = 60 + p * PULSE_INTERVAL;
      const age = frame - pulseStart;
      if (age >= 0 && age <= PULSE_LIFETIME) {
        const t = age / PULSE_LIFETIME;
        pulseWaves.push({
          progress: t,
          opacity: interpolate(t, [0, 0.2, 1], [0, 0.5, 0], clamp),
        });
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Aurora gradient mesh blob positions (noise-driven drift)
  // ---------------------------------------------------------------------------
  const auroraCyanX = 960 + noise2D('aurora-cx', frame * 0.003, 0) * 80;
  const auroraCyanY = 460 + noise2D('aurora-cy', frame * 0.003, 1) * 60;
  const auroraPurpleX = 1200 + noise2D('aurora-px', frame * 0.004, 2) * 100;
  const auroraPurpleY = 300 + noise2D('aurora-py', frame * 0.004, 3) * 70;
  const auroraTealX = 700 + noise2D('aurora-tx', frame * 0.0025, 4) * 90;
  const auroraTealY = 700 + noise2D('aurora-ty', frame * 0.0025, 5) * 50;

  // ---------------------------------------------------------------------------
  // Ambient glow orb positions (noise-driven drift)
  // ---------------------------------------------------------------------------
  const orbPositions = glowOrbs.map((orb, i) => ({
    x: orb.baseX + noise2D(`orb-x-${i}`, frame * 0.002, i * 10) * 60,
    y: orb.baseY + noise2D(`orb-y-${i}`, frame * 0.002, i * 10 + 5) * 40,
  }));

  // ---------------------------------------------------------------------------
  // Hub gradient mesh color shift
  // ---------------------------------------------------------------------------
  const hubMeshPhase = noise2D('hub-mesh', frame * 0.005, 0);
  const hubMeshCyanOpacity = interpolate(hubMeshPhase, [-1, 1], [0.08, 0.15]);
  const hubMeshPurpleOpacity = interpolate(hubMeshPhase, [-1, 1], [0.15, 0.08]);

  // ---------------------------------------------------------------------------
  // Layout constants
  // ---------------------------------------------------------------------------

  const centerX = 960;
  const centerY = 460;
  const hubRadius = 75;

  // Source positions: top-left, top-right, bottom-center
  const sources = [
    { label: 'Web', icon: '\u{1F310}', x: centerX - 220, y: centerY - 200 },
    { label: 'Social', icon: '\u{1F4AC}', x: centerX + 220, y: centerY - 200 },
    { label: 'Retail', icon: '\u{1F6D2}', x: centerX, y: centerY + 230 },
  ];

  // ---------------------------------------------------------------------------
  // Connection line SVG helper
  // ---------------------------------------------------------------------------

  const renderConnectionLine = (
    sx: number,
    sy: number,
    ex: number,
    ey: number,
    progress: number,
    index: number,
  ) => {
    // Compute the actual drawn endpoint based on progress
    const dx = ex + (sx - ex) * (1 - progress);
    const dy = ey + (sy - ey) * (1 - progress);

    return (
      <React.Fragment key={`line-group-${index}`}>
        {/* Wide soft glow behind the line */}
        <line
          x1={ex}
          y1={ey}
          x2={dx}
          y2={dy}
          stroke={`url(#lineGradient${index})`}
          strokeWidth={14}
          strokeLinecap="round"
          opacity={progress > 0 ? 0.08 : 0}
          filter="url(#lineBlurWide)"
        />
        {/* Medium glow behind the line */}
        <line
          x1={ex}
          y1={ey}
          x2={dx}
          y2={dy}
          stroke={`url(#lineGradient${index})`}
          strokeWidth={8}
          strokeLinecap="round"
          opacity={progress > 0 ? 0.2 : 0}
          filter="url(#lineBlur)"
        />
        {/* Main crisp line */}
        <line
          x1={ex}
          y1={ey}
          x2={dx}
          y2={dy}
          stroke={`url(#lineGradient${index})`}
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={progress > 0 ? 0.85 : 0}
        />
      </React.Fragment>
    );
  };

  // ---------------------------------------------------------------------------
  // Connection burst particles (appear when line reaches hub)
  // ---------------------------------------------------------------------------
  const BURST_PARTICLE_COUNT = 8;
  const burstParticles = sources.map((src, i) => {
    const bp = lineBurstProgress[i]!;
    if (bp < 0) return null;
    return Array.from({ length: BURST_PARTICLE_COUNT }, (_, j) => {
      const angle = (j / BURST_PARTICLE_COUNT) * Math.PI * 2 + random(`burst-a-${i}-${j}`) * 0.5;
      const dist = 10 + bp * (40 + random(`burst-d-${i}-${j}`) * 30);
      const bx = centerX + Math.cos(angle) * dist;
      const by = centerY + Math.sin(angle) * dist;
      const bopacity = interpolate(bp, [0, 0.3, 1], [0, 0.9, 0], clamp);
      const bsize = 2 + random(`burst-s-${i}-${j}`) * 2;
      return (
        <circle
          key={`burst-${i}-${j}`}
          cx={bx}
          cy={by}
          r={bsize * (1 - bp * 0.5)}
          fill={j % 2 === 0 ? COLORS.accent : COLORS.accentPurple}
          opacity={bopacity}
          filter="url(#dotGlow)"
        />
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

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
        fontFamily: FONT,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ================================================================= */}
      {/* Aurora Gradient Mesh Background                                   */}
      {/* ================================================================= */}
      {/* Cyan blob - large, slow drift centered around the hub */}
      <div
        style={{
          position: 'absolute',
          left: auroraCyanX - 400,
          top: auroraCyanY - 400,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0, 212, 255, 0.07) 0%, transparent 70%)`,
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />
      {/* Purple blob - offset, counter-animated */}
      <div
        style={{
          position: 'absolute',
          left: auroraPurpleX - 350,
          top: auroraPurpleY - 350,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 70%)`,
          pointerEvents: 'none',
          filter: 'blur(50px)',
        }}
      />
      {/* Teal blob - subtle, bottom area */}
      <div
        style={{
          position: 'absolute',
          left: auroraTealX - 300,
          top: auroraTealY - 300,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(6, 182, 212, 0.04) 0%, transparent 70%)`,
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />

      {/* Background radial glow behind hub */}
      <div
        style={{
          position: 'absolute',
          left: centerX - 350,
          top: centerY - 350,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0,212,255,${0.12 * hubOpacity * pulseGlow}) 0%, rgba(124,58,237,${0.08 * hubOpacity * pulseGlow}) 40%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ================================================================= */}
      {/* Ambient Glow Orbs                                                 */}
      {/* ================================================================= */}
      {glowOrbs.map((orb, i) => (
        <div
          key={`glow-orb-${i}`}
          style={{
            position: 'absolute',
            left: orbPositions[i]!.x - orb.size / 2,
            top: orbPositions[i]!.y - orb.size / 2,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color}, ${orb.opacity}) 0%, ${orb.color}, 0) 70%)`,
            pointerEvents: 'none',
            filter: 'blur(80px)',
          }}
        />
      ))}

      {/* ------------------------------------------------------------------- */}
      {/* Floating ambient particles (noise2D driven)                        */}
      {/* ------------------------------------------------------------------- */}
      {particles.map((p, i) => {
        const px = p.startX + noise2D('sol-px' + i, frame * p.speed * 0.01, i * 0.2) * p.driftX;
        const py = p.startY + noise2D('sol-py' + i, frame * p.speed * 0.008, i * 0.2) * p.driftY;
        const flickerOpacity = p.opacity * (0.7 + 0.3 * Math.sin(frame * 0.05 + i * 3));
        const color = p.hue < 0.5
          ? `rgba(0, 212, 255, ${flickerOpacity})`
          : `rgba(124, 58, 237, ${flickerOpacity})`;

        return (
          <div
            key={`particle-${i}`}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 ${p.size * 3}px ${color}`,
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Heading */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          width: '100%',
          textAlign: 'center',
          opacity: headingOpacity,
          transform: `translateY(${headingY}px)`,
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            margin: 0,
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentPurple})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}
        >
          The Solution
        </h1>
      </div>

      {/* SVG layer for connection lines, dots, orbit, pulses */}
      <svg
        width={1920}
        height={1080}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <defs>
          {sources.map((src, i) => (
            <linearGradient
              key={`grad-${i}`}
              id={`lineGradient${i}`}
              x1={src.x}
              y1={src.y}
              x2={centerX}
              y2={centerY}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.9} />
              <stop offset="100%" stopColor={COLORS.accentPurple} stopOpacity={0.9} />
            </linearGradient>
          ))}
          <filter id="dotGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dotGlowStrong" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="lineBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="lineBlurWide" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="pulseBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* ----------------------------------------------------------------- */}
        {/* Radial pulse waves (radar ping)                                   */}
        {/* ----------------------------------------------------------------- */}
        {pulseWaves.map((pw, i) => {
          const r = hubRadius + pw.progress * MAX_PULSE_RADIUS;
          return (
            <circle
              key={`pulse-${i}`}
              cx={centerX}
              cy={centerY}
              r={r}
              fill="none"
              stroke={COLORS.accent}
              strokeWidth={1.5}
              opacity={pw.opacity * hubOpacity}
              filter="url(#pulseBlur)"
            />
          );
        })}

        {/* Connection lines */}
        {sources.map((src, i) =>
          renderConnectionLine(src.x, src.y, centerX, centerY, lineProgress[i]!, i),
        )}

        {/* Animated dots with glowing trail traveling along the lines */}
        {sources.map((src, i) => {
          const lineComplete = lineProgress[i]! >= 1;
          if (!lineComplete) return null;

          const loopDuration = 60;
          const loopProgress = ((frame - lineDelays[i]! - 40) % loopDuration) / loopDuration;
          const dotX = src.x + (centerX - src.x) * loopProgress;
          const dotY = src.y + (centerY - src.y) * loopProgress;

          // Direction vector for tail placement
          const vecX = centerX - src.x;
          const vecY = centerY - src.y;
          const len = Math.sqrt(vecX * vecX + vecY * vecY);
          const normX = vecX / len;
          const normY = vecY / len;

          // Trail: trailing dots that fade out behind the main dot
          const TRAIL_COUNT = 5;
          const trailSpacing = 10;

          return (
            <React.Fragment key={`dot-group-${i}`}>
              {/* Trail glow (wide, soft) */}
              {Array.from({ length: TRAIL_COUNT }, (_, t) => {
                const offset = (t + 1) * trailSpacing;
                const trailX = dotX - normX * offset;
                const trailY = dotY - normY * offset;
                const trailOpacity = 0.3 * (1 - (t + 1) / (TRAIL_COUNT + 1));
                const trailSize = 6 - t * 0.6;
                return (
                  <circle
                    key={`trail-glow-${i}-${t}`}
                    cx={trailX}
                    cy={trailY}
                    r={Math.max(2, trailSize)}
                    fill={COLORS.accent}
                    opacity={trailOpacity}
                    filter="url(#dotGlowStrong)"
                  />
                );
              })}
              {/* Trail dots (rendered back to front) */}
              {Array.from({ length: TRAIL_COUNT }, (_, t) => {
                const offset = (t + 1) * trailSpacing;
                const trailX = dotX - normX * offset;
                const trailY = dotY - normY * offset;
                const trailOpacity = 0.6 * (1 - (t + 1) / (TRAIL_COUNT + 1));
                const trailSize = 3.5 - t * 0.4;
                return (
                  <circle
                    key={`trail-${i}-${t}`}
                    cx={trailX}
                    cy={trailY}
                    r={Math.max(1, trailSize)}
                    fill={COLORS.accent}
                    opacity={trailOpacity}
                    filter="url(#dotGlow)"
                  />
                );
              })}
              {/* Main dot */}
              <circle
                cx={dotX}
                cy={dotY}
                r={5}
                fill={COLORS.accent}
                opacity={0.95}
                filter="url(#dotGlowStrong)"
              />
            </React.Fragment>
          );
        })}

        {/* ----------------------------------------------------------------- */}
        {/* Connection burst particles                                        */}
        {/* ----------------------------------------------------------------- */}
        {burstParticles}

        {/* ----------------------------------------------------------------- */}
        {/* Orbiting dashed ring around hub                                   */}
        {/* ----------------------------------------------------------------- */}
        <g
          transform={`rotate(${orbitAngle}, ${centerX}, ${centerY})`}
          opacity={hubOpacity}
        >
          <ellipse
            cx={centerX}
            cy={centerY}
            rx={hubRadius + 52}
            ry={hubRadius + 52}
            fill="none"
            stroke="url(#orbitGradient)"
            strokeWidth={1.2}
            strokeDasharray="8 12"
            opacity={0.5}
          />
        </g>
        {/* Second orbit ring, counter-rotating, slightly larger */}
        <g
          transform={`rotate(${-orbitAngle * 0.7 + 45}, ${centerX}, ${centerY})`}
          opacity={hubOpacity}
        >
          <ellipse
            cx={centerX}
            cy={centerY}
            rx={hubRadius + 68}
            ry={hubRadius + 68}
            fill="none"
            stroke="url(#orbitGradient2)"
            strokeWidth={0.8}
            strokeDasharray="4 16"
            opacity={0.3}
          />
        </g>
        <defs>
          <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.7} />
            <stop offset="50%" stopColor={COLORS.accentPurple} stopOpacity={0.4} />
            <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="orbitGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.accentPurple} stopOpacity={0.5} />
            <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0.3} />
          </linearGradient>
        </defs>
      </svg>

      {/* ================================================================= */}
      {/* Central CROW hub (enhanced with gradient mesh glow + glassmorphism)*/}
      {/* ================================================================= */}
      <div
        style={{
          position: 'absolute',
          left: centerX - hubRadius,
          top: centerY - hubRadius,
          width: hubRadius * 2,
          height: hubRadius * 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hubOpacity,
          transform: `scale(${hubScale * pulseScale})`,
        }}
      >
        {/* Gradient mesh glow behind hub (shifts cyan <-> purple) */}
        <div
          style={{
            position: 'absolute',
            width: hubRadius * 2 + 100,
            height: hubRadius * 2 + 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(0, 212, 255, ${hubMeshCyanOpacity}) 0%, rgba(124, 58, 237, ${hubMeshPurpleOpacity}) 50%, transparent 70%)`,
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }}
        />
        {/* Outer bloom ring - stronger pulsing */}
        <div
          style={{
            position: 'absolute',
            width: hubRadius * 2 + 50,
            height: hubRadius * 2 + 50,
            borderRadius: '50%',
            border: `2px solid rgba(0, 212, 255, ${0.15 + 0.25 * pulseGlow})`,
            boxShadow: `
              0 0 30px rgba(0, 212, 255, ${0.15 * pulseGlow}),
              0 0 60px rgba(0, 212, 255, ${0.1 * pulseGlow}),
              0 0 100px rgba(124, 58, 237, ${0.12 * pulseGlow})
            `,
          }}
        />
        {/* Inner glow ring */}
        <div
          style={{
            position: 'absolute',
            width: hubRadius * 2 + 30,
            height: hubRadius * 2 + 30,
            borderRadius: '50%',
            border: `2px solid rgba(0, 212, 255, ${0.3 * pulseGlow})`,
            boxShadow: `0 0 40px rgba(0, 212, 255, ${0.2 * pulseGlow}), 0 0 80px rgba(124, 58, 237, ${0.15 * pulseGlow})`,
          }}
        />
        {/* Hub circle (glassmorphism) */}
        <div
          style={{
            width: hubRadius * 2,
            height: hubRadius * 2,
            borderRadius: '50%',
            background: `linear-gradient(135deg, rgba(0,212,255,0.12), rgba(124,58,237,0.12))`,
            border: `2px solid rgba(0, 212, 255, 0.6)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `
              inset 0 0 30px rgba(0, 212, 255, 0.1),
              0 0 20px rgba(0, 212, 255, ${0.25 * pulseGlow}),
              0 0 60px rgba(124, 58, 237, ${0.15 * pulseGlow})
            `,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: '0.08em',
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentPurple})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CROW
          </span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Data source nodes (glassmorphism)                                  */}
      {/* ================================================================= */}
      {sources.map((src, i) => {
        const nodeSize = 110;
        const isActive = lineProgress[i]! > 0;
        const isComplete = lineProgress[i]! >= 1;
        const activeBorderOpacity = 0.3 + 0.4 * (lineProgress[i]! || 0);
        return (
          <div
            key={src.label}
            style={{
              position: 'absolute',
              left: src.x - nodeSize / 2,
              top: src.y - nodeSize / 2,
              width: nodeSize,
              height: nodeSize,
              borderRadius: 16,
              background: 'rgba(18, 18, 26, 0.5)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: `1.5px solid rgba(0, 212, 255, ${activeBorderOpacity})`,
              borderTop: `1.5px solid rgba(255, 255, 255, ${isActive ? 0.15 : 0.08})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              opacity: sourceProgress[i]!.opacity,
              transform: `scale(${sourceProgress[i]!.scale})`,
              boxShadow: isComplete
                ? `0 0 25px rgba(0, 212, 255, 0.2), 0 0 50px rgba(124, 58, 237, 0.12), inset 0 0 20px rgba(0, 212, 255, 0.05)`
                : isActive
                  ? `0 0 15px rgba(0, 212, 255, 0.1), inset 0 0 10px rgba(0, 212, 255, 0.03)`
                  : 'none',
            }}
          >
            <span style={{ fontSize: 28, lineHeight: 1 }}>{src.icon}</span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: COLORS.text,
                letterSpacing: '0.04em',
              }}
            >
              {src.label}
            </span>
          </div>
        );
      })}

      {/* Tagline */}
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          width: '100%',
          textAlign: 'center',
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
        }}
      >
        <p
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: COLORS.textMuted,
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          One platform.{' '}
          <span
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentPurple})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 600,
            }}
          >
            Every customer signal.
          </span>{' '}
          Complete context.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Film grain overlay                                                  */}
      {/* ------------------------------------------------------------------- */}
      <svg
        width={1920}
        height={1080}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          opacity: 0.4,
        }}
      >
        <defs>
          <filter id="filmGrainStatic" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves={4}
              seed={frame}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0"
              in="noise"
              result="monoNoise"
            />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter="url(#filmGrainStatic)"
        />
      </svg>
      {/* Second grain layer with per-frame seed for animated grain */}
      <svg
        width={1920}
        height={1080}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          opacity: 0.3,
          mixBlendMode: 'screen',
        }}
      >
        <defs>
          <filter id="animatedGrain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves={3}
              seed={frame * 2}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.08 0"
              in="noise"
              result="greyNoise"
            />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter="url(#animatedGrain)"
        />
      </svg>
    </div>
  );
};

export default SolutionScene;
