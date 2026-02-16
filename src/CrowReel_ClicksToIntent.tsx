import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  spring,
  interpolate,
  random,
  Audio,
  staticFile,
} from 'remotion';
import {
  COLORS,
  FONTS,
  SAFE,
  SPRING_SNAP,
  FPS,
  whoosh,
  glowRamp,
  breathe,
  glassCard,
  glassChip,
  gradientBorder,
  Starfield,
  AuroraBackground,
  Vignette,
  NoiseOverlay,
  AccentLines,
  ScanLines,
  GlowOrb,
  LightSweep,
} from './reel-shared';

// ─── Editable Copy ───────────────────────────────────────────────────────────

const TEXT = {
  // Scene 1 – Hook
  s1Headline: "CLICKS AREN'T INSIGHTS.",
  s1Micro: 'SIGNALS ≠ MEANING',

  // Scene 2 – Problem (NEW)
  s2Headline: 'MOST TOOLS COUNT CLICKS.',
  s2Sub: "COUNTING ISN'T UNDERSTANDING.",
  s2Metrics: ['2,847', '14.3K', '892', '67%'] as readonly string[],
  s2Labels: ['CLICKS', 'PAGE VIEWS', 'SESSIONS', 'BOUNCE'] as readonly string[],

  // Scene 3 – Behavior
  s3Headline: 'CROW CAPTURES REAL BEHAVIOR',
  s3Chips: ['CLICKS', 'FORMS', 'SCROLLS', 'PRODUCT VIEWS'] as readonly string[],
  s3Badge: '<10KB SDK',
  s3Flash: 'BATCHING + OFFLINE QUEUE',

  // Scene 4 – Edge
  s4Headline: 'PROCESSED AT THE EDGE',
  s4Sub: 'GLOBAL WORKERS • ULTRA LOW LATENCY',

  // Scene 5 – Intent
  s5Headline: 'AI TURNS SESSIONS INTO INTENT',
  s5Sub1: 'HUMAN-READABLE INTERACTIONS',
  s5Sub2: '+ INFERRED INTENT',
  s5Cards: ['BROWSE → COMPARE', 'SEARCH → EVALUATE', 'ADD TO CART → HESITATE'] as readonly string[],

  // Scene 6 – CTA
  s6Cta: 'WANT THIS ON YOUR SITE?',
  s6Sub: 'crowai.dev',
  s6End: 'CROW BY B3',
} as const;

// ─── Scene 1: Hook ───────────────────────────────────────────────────────────
// Frames 0–69 (0–2.3s)

const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();

  const headlineProg = spring({
    frame,
    fps: FPS,
    config: { damping: 10, stiffness: 180 },
    durationInFrames: 15,
  });
  const headlineScale = interpolate(headlineProg, [0, 1], [0.82, 1]);
  const headlineOpacity = interpolate(headlineProg, [0, 1], [0, 1]);

  const microFade = interpolate(frame, [18, 32], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const microY = interpolate(frame, [18, 32], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const arcProgress = interpolate(frame, [5, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const arcLength = 942;

  const glow = glowRamp(frame, 0, 20);
  const pulse = breathe(frame, 0.08, 0.1);

  // Glitch effect on headline
  const glitchActive = frame >= 3 && frame <= 8;
  const glitchX = glitchActive ? Math.sin(frame * 40) * 4 : 0;
  const glitchOpacity = glitchActive ? 0.6 + Math.random() * 0.4 : 1;

  // Flash burst on appear
  const flashOpacity = interpolate(frame, [0, 3, 8], [0.8, 0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* Flash burst */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${COLORS.red}50 0%, ${COLORS.purple}20 40%, transparent 70%)`,
          opacity: flashOpacity,
          filter: 'blur(60px)',
        }}
      />

      {/* Animated arc */}
      <svg
        width={800}
        height={800}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -55%) scale(${pulse})`,
          opacity: 0.4 * glow,
        }}
        viewBox="0 0 800 800"
      >
        <defs>
          <linearGradient id="cr01-arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.red} />
            <stop offset="50%" stopColor={COLORS.purple} />
            <stop offset="100%" stopColor={COLORS.cyan} />
          </linearGradient>
        </defs>
        <path
          d="M 100 400 A 300 300 0 0 1 700 400"
          fill="none"
          stroke="url(#cr01-arcGrad)"
          strokeWidth={3}
          strokeDasharray={arcLength}
          strokeDashoffset={arcLength * (1 - arcProgress)}
          strokeLinecap="round"
        />
        <path
          d="M 700 420 A 300 300 0 0 1 100 420"
          fill="none"
          stroke="url(#cr01-arcGrad)"
          strokeWidth={2}
          strokeDasharray={arcLength}
          strokeDashoffset={arcLength * (1 - arcProgress * 0.7)}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* Third arc for more depth */}
        <path
          d="M 150 380 A 280 280 0 0 1 650 380"
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={1}
          strokeDasharray={arcLength}
          strokeDashoffset={arcLength * (1 - arcProgress * 0.5)}
          strokeLinecap="round"
          opacity={0.2}
        />
      </svg>

      {/* Headline with glitch */}
      <div
        style={{
          transform: `scale(${headlineScale}) translateX(${glitchX}px)`,
          opacity: headlineOpacity * glitchOpacity,
          textAlign: 'center',
          padding: `0 ${SAFE.h}px`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 72,
            fontWeight: 900,
            color: COLORS.text,
            lineHeight: 1.1,
            textShadow: `
              0 0 ${40 * glow}px ${COLORS.red}60,
              0 0 ${80 * glow}px ${COLORS.red}20
            `,
          }}
        >
          {TEXT.s1Headline}
        </div>
      </div>

      {/* Micro subtext */}
      <div
        style={{
          position: 'absolute',
          top: '56%',
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: microFade,
          transform: `translateY(${microY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 28,
            fontWeight: 500,
            color: COLORS.textMuted,
            letterSpacing: 6,
            textShadow: `0 0 20px ${COLORS.purple}30`,
          }}
        >
          {TEXT.s1Micro}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Problem ───────────────────────────────────────────────────────
// Frames 70–209 (2.3–7s)

const Scene2_Problem: React.FC = () => {
  const frame = useCurrentFrame();

  const hw = whoosh(frame, 0, 12);
  const glow = glowRamp(frame, 0, 20);

  // Subtext fade
  const subFade = interpolate(frame, [20, 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subY = interpolate(frame, [20, 36], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Metric counters animate up
  const metricAnims = TEXT.s2Metrics.map((_, i) => {
    const delay = 10 + i * 10;
    const prog = spring({
      frame: frame - delay,
      fps: FPS,
      config: { damping: 12, stiffness: 160 },
      durationInFrames: 12,
    });
    return {
      opacity: interpolate(prog, [0, 1], [0, 1]),
      y: interpolate(prog, [0, 1], [40, 0]),
      scale: interpolate(prog, [0, 1], [0.8, 1]),
    };
  });

  // Strikethrough / dismissal effect on the metrics
  const strikeProgress = interpolate(frame, [70, 95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const strikeOpacity = interpolate(frame, [70, 80], [0, 0.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Dim the metrics after strike
  const metricDim = interpolate(frame, [80, 100], [1, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 360,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: hw.opacity,
          transform: `translateY(${hw.translateY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 58,
            fontWeight: 900,
            color: COLORS.text,
            lineHeight: 1.15,
            textShadow: `
              0 0 ${30 * glow}px ${COLORS.red}60,
              0 0 ${60 * glow}px ${COLORS.red}20
            `,
          }}
        >
          {TEXT.s2Headline}
        </div>
      </div>

      {/* Metric cards grid */}
      <div
        style={{
          position: 'absolute',
          top: 620,
          left: SAFE.h,
          right: SAFE.h,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 24,
          justifyContent: 'center',
        }}
      >
        {TEXT.s2Metrics.map((metric, i) => {
          const a = metricAnims[i]!;
          return (
            <div
              key={`metric-${i}`}
              style={{
                opacity: a.opacity * metricDim,
                transform: `translateY(${a.y}px) scale(${a.scale})`,
                width: 200,
                padding: '24px 16px',
                borderRadius: 16,
                ...glassCard(glow),
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.primary,
                  fontSize: 36,
                  fontWeight: 800,
                  color: COLORS.text,
                }}
              >
                {metric}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: FONTS.primary,
                  fontSize: 14,
                  fontWeight: 500,
                  color: COLORS.textMuted,
                  letterSpacing: 2,
                }}
              >
                {TEXT.s2Labels[i]}
              </div>
              {/* Strikethrough line */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  width: `${strikeProgress * 100}%`,
                  height: 3,
                  background: COLORS.red,
                  opacity: strikeOpacity,
                  boxShadow: `0 0 12px ${COLORS.red}`,
                }}
              />
              <LightSweep frame={frame} startFrame={15 + i * 10} duration={20} />
            </div>
          );
        })}
      </div>

      {/* Subtext - the punchline */}
      <div
        style={{
          position: 'absolute',
          top: 1000,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: subFade,
          transform: `translateY(${subY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 40,
            fontWeight: 700,
            background: COLORS.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 ${15 * glow}px ${COLORS.red}40)`,
          }}
        >
          {TEXT.s2Sub}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Behavior ───────────────────────────────────────────────────────
// Frames 210–459 (7–15.3s)

const Scene3_Behavior: React.FC = () => {
  const frame = useCurrentFrame();

  const hw = whoosh(frame, 0, 12);

  const chipAnimations = TEXT.s3Chips.map((_, i) => {
    const delay = 15 + i * 8;
    const prog = spring({
      frame: frame - delay,
      fps: FPS,
      config: SPRING_SNAP,
      durationInFrames: 10,
    });
    return {
      opacity: interpolate(prog, [0, 1], [0, 1]),
      x: interpolate(prog, [0, 1], [-60, 0]),
      scale: interpolate(prog, [0, 1], [0.85, 1]),
    };
  });

  const badgeProg = spring({
    frame: frame - 20,
    fps: FPS,
    config: SPRING_SNAP,
    durationInFrames: 10,
  });
  const badgeOpacity = interpolate(badgeProg, [0, 1], [0, 1]);
  const badgeScale = interpolate(badgeProg, [0, 1], [0.8, 1]);

  const flashOpacity = interpolate(frame, [85, 95, 120, 130], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const glow = glowRamp(frame, 0, 20);

  // Data flow particles
  const particleCount = 12;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const speed = random(`cr01-p-sp-${i}`) * 0.8 + 0.3;
    const startX = random(`cr01-p-sx-${i}`) * 600 + 240;
    const phase = random(`cr01-p-ph-${i}`) * 200;
    const yProgress = ((frame * speed + phase) % 120) / 120;
    return {
      x: startX + Math.sin(yProgress * Math.PI * 2 + i) * 30,
      y: 550 + yProgress * 250,
      opacity: Math.sin(yProgress * Math.PI) * 0.5,
      size: random(`cr01-p-sz-${i}`) * 3 + 2,
      color: i % 2 === 0 ? COLORS.red : COLORS.purple,
    };
  });

  return (
    <AbsoluteFill>
      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={`fp-${i}`}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 380,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: hw.opacity,
          transform: `translateY(${hw.translateY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 58,
            fontWeight: 900,
            color: COLORS.text,
            lineHeight: 1.15,
            textShadow: `
              0 0 ${30 * glow}px ${COLORS.purple}60,
              0 0 ${60 * glow}px ${COLORS.purple}20
            `,
          }}
        >
          {TEXT.s3Headline}
        </div>
      </div>

      {/* Glass chips */}
      <div
        style={{
          position: 'absolute',
          top: 640,
          left: SAFE.h,
          right: SAFE.h,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          justifyContent: 'center',
        }}
      >
        {TEXT.s3Chips.map((chip, i) => (
          <div
            key={chip}
            style={{
              opacity: chipAnimations[i]!.opacity,
              transform: `translateX(${chipAnimations[i]!.x}px) scale(${chipAnimations[i]!.scale})`,
              padding: '14px 30px',
              borderRadius: 40,
              ...glassChip(glow, COLORS.red),
              fontFamily: FONTS.primary,
              fontSize: 24,
              fontWeight: 600,
              color: COLORS.text,
              whiteSpace: 'nowrap',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {chip}
            <LightSweep frame={frame} startFrame={30 + i * 10} duration={20} />
          </div>
        ))}
      </div>

      {/* Badge - glassmorphism */}
      <div
        style={{
          position: 'absolute',
          top: SAFE.top,
          right: SAFE.h,
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
        }}
      >
        <div
          style={{
            padding: '10px 24px',
            borderRadius: 30,
            ...gradientBorder(glow),
            fontFamily: FONTS.primary,
            fontSize: 18,
            fontWeight: 700,
            color: COLORS.text,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {TEXT.s3Badge}
          <LightSweep frame={frame} startFrame={25} duration={25} />
        </div>
      </div>

      {/* Flash subtext */}
      <div
        style={{
          position: 'absolute',
          bottom: SAFE.bottom + 40,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: flashOpacity,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 20,
            fontWeight: 500,
            color: COLORS.textMuted,
            letterSpacing: 3,
            textShadow: `0 0 12px ${COLORS.purple}40`,
          }}
        >
          {TEXT.s3Flash}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Edge ───────────────────────────────────────────────────────────
// Frames 460–619 (15.3–20.6s)

const GRID_COLS = 9;
const GRID_ROWS = 7;
const networkNodes = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => {
  const col = i % GRID_COLS;
  const row = Math.floor(i / GRID_COLS);
  const jitterX = (random(`cr01-nj-x-${i}`) - 0.5) * 30;
  const jitterY = (random(`cr01-nj-y-${i}`) - 0.5) * 30;
  return {
    x: 140 + col * ((1080 - 280) / (GRID_COLS - 1)) + jitterX,
    y: 780 + row * 110 + jitterY,
    visible: random(`cr01-nv-${i}`) > 0.35,
    connections: [] as number[],
  };
});

networkNodes.forEach((node, i) => {
  if (!node.visible) return;
  networkNodes.forEach((other, j) => {
    if (i >= j || !other.visible) return;
    const dx = node.x - other.x;
    const dy = node.y - other.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 180 && random(`cr01-cn-${i}-${j}`) > 0.35) {
      node.connections.push(j);
    }
  });
});

const Scene4_Edge: React.FC = () => {
  const frame = useCurrentFrame();

  const hw = whoosh(frame, 0, 12);

  const subFade = interpolate(frame, [15, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const pulseX = interpolate(frame, [20, 100], [0, 1080], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const glow = glowRamp(frame, 0, 20);

  // Ripple effect emanating from center
  const rippleRadius = interpolate(frame, [30, 90], [0, 600], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rippleOpacity = interpolate(frame, [30, 60, 90], [0, 0.3, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <svg
        width={1080}
        height={1920}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="cr01-lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.red} />
            <stop offset="50%" stopColor={COLORS.purple} />
            <stop offset="100%" stopColor={COLORS.cyan} />
          </linearGradient>
          <radialGradient id="cr01-nodeGlow">
            <stop offset="0%" stopColor={COLORS.red} stopOpacity={0.6} />
            <stop offset="100%" stopColor={COLORS.red} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Ripple effect */}
        <circle
          cx={540}
          cy={1100}
          r={rippleRadius}
          fill="none"
          stroke={COLORS.purple}
          strokeWidth={2}
          opacity={rippleOpacity}
        />
        <circle
          cx={540}
          cy={1100}
          r={rippleRadius * 0.7}
          fill="none"
          stroke={COLORS.red}
          strokeWidth={1}
          opacity={rippleOpacity * 0.5}
        />

        {/* Connection lines with glow */}
        {networkNodes.map((node, i) =>
          node.connections.map((j) => {
            const other = networkNodes[j]!;
            const lineFade = interpolate(frame, [8, 28], [0, 0.35], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <line
                key={`l-${i}-${j}`}
                x1={node.x}
                y1={node.y}
                x2={other.x}
                y2={other.y}
                stroke="url(#cr01-lineGrad)"
                strokeWidth={1.5}
                opacity={lineFade}
              />
            );
          }),
        )}

        {/* Nodes with glow */}
        {networkNodes.map((node, i) => {
          if (!node.visible) return null;
          const nodeFade = interpolate(frame, [5 + i * 0.3, 18 + i * 0.3], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const distFromPulse = Math.abs(node.x - pulseX);
          const pulseHit = distFromPulse < 80 ? (1 - distFromPulse / 80) * 0.8 : 0;
          return (
            <g key={`n-${i}`}>
              {/* Glow halo */}
              {pulseHit > 0 && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={18}
                  fill="url(#cr01-nodeGlow)"
                  opacity={pulseHit * nodeFade}
                />
              )}
              {/* Node dot */}
              <circle
                cx={node.x}
                cy={node.y}
                r={4}
                fill={pulseHit > 0.3 ? COLORS.red : COLORS.text}
                opacity={nodeFade * 0.85}
              />
              {/* Outer ring on hit */}
              {pulseHit > 0.3 && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={8}
                  fill="none"
                  stroke={COLORS.red}
                  strokeWidth={1}
                  opacity={pulseHit * nodeFade * 0.6}
                />
              )}
            </g>
          );
        })}

        {/* Pulse sweep line */}
        {frame >= 20 && frame <= 100 && (
          <line
            x1={pulseX}
            y1={730}
            x2={pulseX}
            y2={1500}
            stroke={COLORS.red}
            strokeWidth={2}
            opacity={0.4}
          />
        )}
      </svg>

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 320,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: hw.opacity,
          transform: `translateY(${hw.translateY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 58,
            fontWeight: 900,
            color: COLORS.text,
            lineHeight: 1.15,
            textShadow: `
              0 0 ${30 * glow}px ${COLORS.purple}60,
              0 0 ${60 * glow}px ${COLORS.purple}20
            `,
          }}
        >
          {TEXT.s4Headline}
        </div>
        <div
          style={{
            marginTop: 24,
            fontFamily: FONTS.primary,
            fontSize: 26,
            fontWeight: 500,
            color: COLORS.textMuted,
            letterSpacing: 3,
            opacity: subFade,
            textShadow: `0 0 12px ${COLORS.purple}30`,
          }}
        >
          {TEXT.s4Sub}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Intent ─────────────────────────────────────────────────────────
// Frames 620–809 (20.7–27s)

const EVENT_DOT_COUNT = 30;
const eventDots = Array.from({ length: EVENT_DOT_COUNT }, (_, i) => ({
  startX: random(`cr01-ed-sx-${i}`) * 700 + 190,
  startY: random(`cr01-ed-sy-${i}`) * 500 + 650,
  size: random(`cr01-ed-sz-${i}`) * 4 + 2,
}));

const CARD_TARGETS = [
  { x: 540, y: 740, w: 700 },
  { x: 540, y: 960, w: 700 },
  { x: 540, y: 1180, w: 700 },
];

const Scene5_Intent: React.FC = () => {
  const frame = useCurrentFrame();

  const hw = whoosh(frame, 0, 12);

  const converge = interpolate(frame, [15, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cardsProg = spring({
    frame: frame - 40,
    fps: FPS,
    config: { damping: 14, stiffness: 160 },
    durationInFrames: 15,
  });
  const cardsOpacity = interpolate(cardsProg, [0, 1], [0, 1]);
  const cardsScale = interpolate(cardsProg, [0, 1], [0.9, 1]);

  const sub1Fade = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sub2Fade = interpolate(frame, [18, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const float = Math.sin(frame * 0.08) * 4;
  const glow = glowRamp(frame, 0, 20);

  return (
    <AbsoluteFill>
      {/* Converging particles with glow trail */}
      {converge < 1 &&
        eventDots.map((dot, i) => {
          const target = CARD_TARGETS[i % 3]!;
          const x = interpolate(converge, [0, 1], [dot.startX, target.x]);
          const y = interpolate(converge, [0, 1], [dot.startY, target.y]);
          const dotOpacity = interpolate(converge, [0.7, 1], [0.7, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const color = i % 2 === 0 ? COLORS.red : COLORS.purple;
          return (
            <div
              key={`ed-${i}`}
              style={{
                position: 'absolute',
                left: x - dot.size / 2,
                top: y - dot.size / 2,
                width: dot.size,
                height: dot.size,
                borderRadius: '50%',
                backgroundColor: color,
                opacity: dotOpacity,
                boxShadow: `0 0 ${dot.size * 3}px ${color}`,
              }}
            />
          );
        })}

      {/* Headline area */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: hw.opacity,
          transform: `translateY(${hw.translateY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 54,
            fontWeight: 900,
            color: COLORS.text,
            lineHeight: 1.15,
            textShadow: `
              0 0 ${30 * glow}px ${COLORS.red}60,
              0 0 ${60 * glow}px ${COLORS.red}20
            `,
          }}
        >
          {TEXT.s5Headline}
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: FONTS.primary,
            fontSize: 24,
            fontWeight: 500,
            color: COLORS.textMuted,
            opacity: sub1Fade,
            textShadow: `0 0 10px ${COLORS.purple}20`,
          }}
        >
          {TEXT.s5Sub1}
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: FONTS.primary,
            fontSize: 24,
            fontWeight: 600,
            background: COLORS.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: sub2Fade,
          }}
        >
          {TEXT.s5Sub2}
        </div>
      </div>

      {/* Glassmorphism intent cards */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: cardsOpacity,
          transform: `scale(${cardsScale}) translateY(${float}px)`,
        }}
      >
        {TEXT.s5Cards.map((card, i) => {
          const t = CARD_TARGETS[i]!;
          return (
            <div
              key={`card-${i}`}
              style={{
                position: 'absolute',
                left: t.x - t.w / 2,
                top: t.y - 36,
                width: t.w,
                padding: '24px 36px',
                borderRadius: 20,
                ...glassCard(glow),
                ...gradientBorder(glow),
                fontFamily: FONTS.primary,
                fontSize: 26,
                fontWeight: 600,
                color: COLORS.text,
                textAlign: 'center',
                letterSpacing: 1,
                overflow: 'hidden',
              }}
            >
              {card}
              <LightSweep frame={frame} startFrame={10 + i * 12} duration={22} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: CTA ────────────────────────────────────────────────────────────
// Frames 810–949 (27–31.7s)

const Scene6_CTA: React.FC = () => {
  const frame = useCurrentFrame();

  const ctaHw = whoosh(frame, 0, 10);

  const subProg = spring({
    frame: frame - 8,
    fps: FPS,
    config: SPRING_SNAP,
    durationInFrames: 10,
  });
  const subOpacity = interpolate(subProg, [0, 1], [0, 1]);
  const subY = interpolate(subProg, [0, 1], [20, 0]);

  const endFade = interpolate(frame, [16, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ringProg = spring({
    frame: frame - 4,
    fps: FPS,
    config: SPRING_SNAP,
    durationInFrames: 12,
  });
  const ringScale = interpolate(ringProg, [0, 1], [0.5, 1]);
  const ringOpacity = interpolate(ringProg, [0, 1], [0, 1]);

  const glow = glowRamp(frame, 0, 15);
  const ringRotate = interpolate(frame, [0, 60], [0, 25]);
  const pulse = breathe(frame, 0.1, 0.08);

  // Confetti-like celebration particles
  const confettiCount = 20;
  const confetti = Array.from({ length: confettiCount }, (_, i) => {
    const angle = (i / confettiCount) * Math.PI * 2;
    const dist = interpolate(frame, [8, 40], [0, random(`cr01-cf-d-${i}`) * 300 + 100], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const opacity = interpolate(frame, [8, 20, 50], [0, 0.7, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return {
      x: 540 + Math.cos(angle) * dist,
      y: 570 + Math.sin(angle) * dist * 0.6,
      opacity,
      size: random(`cr01-cf-sz-${i}`) * 4 + 2,
      color: i % 3 === 0 ? COLORS.red : i % 3 === 1 ? COLORS.purple : COLORS.cyan,
    };
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* Celebration particles */}
      {confetti.map((p, i) => (
        <div
          key={`cf-${i}`}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}

      {/* Gradient backdrop glow */}
      <div
        style={{
          position: 'absolute',
          top: 500,
          left: '50%',
          transform: `translateX(-50%) scale(${pulse})`,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.purple}25 0%, ${COLORS.red}10 40%, transparent 70%)`,
          filter: 'blur(50px)',
          opacity: glow,
        }}
      />

      {/* Animated ring */}
      <div
        style={{
          position: 'absolute',
          top: 500,
          left: '50%',
          transform: `translateX(-50%) scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      >
        <svg width={160} height={160} viewBox="0 0 160 160">
          <defs>
            <linearGradient id="cr01-ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={COLORS.red} />
              <stop offset="50%" stopColor={COLORS.purple} />
              <stop offset="100%" stopColor={COLORS.cyan} />
            </linearGradient>
          </defs>
          {/* Outer glow ring */}
          <circle
            cx={80}
            cy={80}
            r={72}
            fill="none"
            stroke={COLORS.purple}
            strokeWidth={1}
            opacity={0.15 * glow}
          />
          {/* Main ring */}
          <circle
            cx={80}
            cy={80}
            r={62}
            fill="none"
            stroke="url(#cr01-ringGrad)"
            strokeWidth={3}
            strokeDasharray="8 4"
            transform={`rotate(${ringRotate} 80 80)`}
          />
          <circle
            cx={80}
            cy={80}
            r={52}
            fill={`${COLORS.purple}12`}
            stroke="none"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: -30,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.purple}20 0%, transparent 70%)`,
            opacity: glow * pulse,
          }}
        />
      </div>

      {/* CTA text */}
      <div
        style={{
          position: 'absolute',
          top: 720,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: ctaHw.opacity,
          transform: `translateY(${ctaHw.translateY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 58,
            fontWeight: 900,
            color: COLORS.text,
            lineHeight: 1.15,
            textShadow: `
              0 0 ${40 * glow}px ${COLORS.red}60,
              0 0 ${80 * glow}px ${COLORS.red}20
            `,
          }}
        >
          {TEXT.s6Cta}
        </div>
      </div>

      {/* DM subtext with gradient */}
      <div
        style={{
          position: 'absolute',
          top: 920,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 40,
            fontWeight: 700,
            background: COLORS.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 4,
            filter: `drop-shadow(0 0 ${15 * glow}px ${COLORS.red}40)`,
          }}
        >
          {TEXT.s6Sub}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          position: 'absolute',
          top: 1000,
          left: '50%',
          transform: 'translateX(-50%)',
          width: interpolate(frame, [14, 26], [0, 240], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          height: 2,
          background: COLORS.gradient,
          opacity: endFade,
          borderRadius: 1,
          boxShadow: `0 0 8px ${COLORS.red}40`,
        }}
      />

      {/* End card */}
      <div
        style={{
          position: 'absolute',
          bottom: SAFE.bottom + 60,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: endFade,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 22,
            fontWeight: 600,
            color: COLORS.textMuted,
            letterSpacing: 6,
            textTransform: 'uppercase',
            textShadow: `0 0 12px ${COLORS.purple}30`,
          }}
        >
          {TEXT.s6End}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition ────────────────────────────────────────────────────────

export const CrowReel_ClicksToIntent: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Background layers */}
      <AuroraBackground seed="cr01-aurora" opacity={0.18} />
      <Starfield seed="cr01" />
      <NoiseOverlay id="cr01-noise" />
      <ScanLines opacity={0.02} />

      {/* Floating orbs for depth */}
      <GlowOrb x={15} y={30} size={350} color={COLORS.red} speed={0.02} phase={0} />
      <GlowOrb x={80} y={70} size={280} color={COLORS.purple} speed={0.025} phase={2} />

      {/* Accent lines */}
      <AccentLines />

      {/* Scenes */}
      <Sequence from={0} durationInFrames={70}>
        <Scene1_Hook />
      </Sequence>

      <Sequence from={70} durationInFrames={140}>
        <Scene2_Problem />
      </Sequence>

      <Sequence from={210} durationInFrames={250}>
        <Scene3_Behavior />
      </Sequence>

      <Sequence from={460} durationInFrames={160}>
        <Scene4_Edge />
      </Sequence>

      <Sequence from={620} durationInFrames={190}>
        <Scene5_Intent />
      </Sequence>

      <Sequence from={810} durationInFrames={140}>
        <Scene6_CTA />
      </Sequence>

      {/* Vignette on top */}
      <Vignette intensity={0.65} />

      {/* Background music (lower volume to let voice be heard) */}
      <Audio src={staticFile('audio/reel-1 audio')} volume={0.35} />

      {/* Voiceover segments – timed to each scene with duration caps */}
      <Sequence from={3} durationInFrames={50}>
        <Audio src={staticFile('audio/r1-s1-hook.mp3')} volume={1} />
      </Sequence>
      <Sequence from={73} durationInFrames={118}>
        <Audio src={staticFile('audio/r1-s2-problem.mp3')} volume={1} />
      </Sequence>
      <Sequence from={214} durationInFrames={235}>
        <Audio src={staticFile('audio/r1-s3-behavior.mp3')} volume={1} />
      </Sequence>
      <Sequence from={464} durationInFrames={145}>
        <Audio src={staticFile('audio/r1-s4-edge.mp3')} volume={1} />
      </Sequence>
      <Sequence from={624} durationInFrames={179}>
        <Audio src={staticFile('audio/r1-s5-intent.mp3')} volume={1} />
      </Sequence>
      <Sequence from={814} durationInFrames={128}>
        <Audio src={staticFile('audio/r1-s6-cta.mp3')} volume={1} />
      </Sequence>
    </AbsoluteFill>
  );
};
