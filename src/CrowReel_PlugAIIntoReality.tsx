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
  s1Headline: 'YOUR AI IS SMART.',
  s1Punch: "BUT IT'S MISSING CONTEXT.",

  // Scene 2 – Problem (NEW)
  s2Line1: 'IT CAN GENERATE.',
  s2Line2: 'IT CAN REASON.',
  s2Punch: "BUT IT CAN'T OBSERVE YOUR USERS.",

  // Scene 3 – Crow exposes reality
  s3Headline: 'CROW EXPOSES REALITY',
  s3Chips: ['REST API', 'MCP', 'A2A'] as readonly string[],
  s3Micro: 'SIGNALS ACROSS WEB + SOCIAL + PHYSICAL',
  s3Nodes: ['WEB', 'SOCIAL', 'PHYSICAL'] as readonly string[],
  s3Center: 'CROW',

  // Scene 4 – Agents retrieve patterns
  s4Headline: 'AGENTS RETRIEVE PATTERNS',
  s4Sub: 'THEN RECOMMEND ACTIONS',
  s4Agents: ['AGENT: GROWTH', 'AGENT: SUPPORT', 'AGENT: OPS'] as readonly string[],
  s4Actions: ['NOTIFY', 'ROUTE', 'SUMMARIZE'] as readonly string[],

  // Scene 5 – Trust (NEW)
  s5Headline: 'PRIVACY FIRST.',
  s5Badges: ['RETENTION CONTROLS', 'DELETION ON DEMAND', 'ACCESS CONTROLS'] as readonly string[],
  s5Sub: 'YOU CONTROL YOUR DATA. ALWAYS.',

  // Scene 6 – CTA
  s6Cta: 'BUILD WITH CROW.',
  s6Sub: 'crowai.dev',
  s6End: 'CROW BY B3',
} as const;

// ─── SVG Icons (procedural, no external assets) ─────────────────────────────

const BrainIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = COLORS.text,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C9.5 2 7.5 3.5 7 5.5C5.5 5.5 4 7 4 9c0 1.5.8 2.8 2 3.5-.2.5-.3 1-.3 1.5 0 2.2 1.8 4 4 4h.3c.5 1.2 1.7 2 3 2s2.5-.8 3-2h.3c2.2 0 4-1.8 4-4 0-.5-.1-1-.3-1.5 1.2-.7 2-2 2-3.5 0-2-1.5-3.5-3-3.5C18.5 3.5 16.5 2 14 2h-2z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 2v20" stroke={color} strokeWidth={1} opacity={0.4} />
  </svg>
);

const PlugIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = COLORS.text,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M7 2v6m10-6v6M4 8h16M6 8v4a6 6 0 0 0 12 0V8M12 18v4"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ApiIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = COLORS.text,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx={5} cy={12} r={2.5} stroke={color} strokeWidth={1.5} />
    <circle cx={19} cy={6} r={2.5} stroke={color} strokeWidth={1.5} />
    <circle cx={19} cy={18} r={2.5} stroke={color} strokeWidth={1.5} />
    <path
      d="M7.5 11L16.5 7M7.5 13l9 4"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);

const ShieldIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = COLORS.text,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l8 4v6c0 5.5-3.8 10-8 11-4.2-1-8-5.5-8-11V6l8-4z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Scene 1: Hook ───────────────────────────────────────────────────────────
// Frames 0–114 (0–3.8s)

const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // Line 1: pop in immediately
  const h1Prog = spring({
    frame,
    fps: FPS,
    config: { damping: 10, stiffness: 180 },
    durationInFrames: 12,
  });
  const h1Scale = interpolate(h1Prog, [0, 1], [0.85, 1]);
  const h1Opacity = interpolate(h1Prog, [0, 1], [0, 1]);

  // Line 2: appears 10 frames later
  const h2Prog = spring({
    frame: frame - 10,
    fps: FPS,
    config: { damping: 10, stiffness: 180 },
    durationInFrames: 12,
  });
  const h2Opacity = interpolate(h2Prog, [0, 1], [0, 1]);
  const h2Y = interpolate(h2Prog, [0, 1], [30, 0]);

  const glow = glowRamp(frame, 8, 20);
  const pulse = breathe(frame, 0.08, 0.1);

  // Glitch on punchline
  const glitchActive = frame >= 12 && frame <= 17;
  const glitchX = glitchActive ? Math.sin(frame * 35) * 5 : 0;

  // Flash burst on punchline appear
  const flashOpacity = interpolate(frame, [10, 14, 22], [0, 0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Gradient flare behind punchline
  const flareOpacity = interpolate(frame, [10, 25, 50, 80], [0, 0.3, 0.25, 0.1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* Flash burst */}
      <div
        style={{
          position: 'absolute',
          top: '52%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${COLORS.red}40 0%, transparent 60%)`,
          opacity: flashOpacity,
          filter: 'blur(50px)',
        }}
      />

      {/* Gradient flare */}
      <div
        style={{
          position: 'absolute',
          top: '52%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${pulse})`,
          width: 600,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${COLORS.red}40 0%, ${COLORS.purple}20 50%, transparent 80%)`,
          opacity: flareOpacity,
          filter: 'blur(40px)',
        }}
      />

      {/* Headline 1 */}
      <div
        style={{
          textAlign: 'center',
          padding: `0 ${SAFE.h}px`,
          transform: `scale(${h1Scale})`,
          opacity: h1Opacity,
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
              0 0 ${30 * glow}px ${COLORS.purple}50,
              0 0 ${60 * glow}px ${COLORS.purple}15
            `,
          }}
        >
          {TEXT.s1Headline}
        </div>
      </div>

      {/* Punchline with glitch */}
      <div
        style={{
          position: 'absolute',
          top: '55%',
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: h2Opacity,
          transform: `translateY(${h2Y}px) translateX(${glitchX}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 44,
            fontWeight: 700,
            background: COLORS.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 ${20 * glow}px ${COLORS.red}40)`,
          }}
        >
          {TEXT.s1Punch}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Problem ───────────────────────────────────────────────────────
// Frames 115–274 (3.8–9.2s)

const Scene2_Problem: React.FC = () => {
  const frame = useCurrentFrame();

  const glow = glowRamp(frame, 0, 20);

  // Line 1: "IT CAN GENERATE."
  const l1Prog = spring({
    frame,
    fps: FPS,
    config: { damping: 10, stiffness: 180 },
    durationInFrames: 12,
  });
  const l1Opacity = interpolate(l1Prog, [0, 1], [0, 1]);
  const l1Y = interpolate(l1Prog, [0, 1], [30, 0]);

  // Line 2: "IT CAN REASON."
  const l2Prog = spring({
    frame: frame - 18,
    fps: FPS,
    config: { damping: 10, stiffness: 180 },
    durationInFrames: 12,
  });
  const l2Opacity = interpolate(l2Prog, [0, 1], [0, 1]);
  const l2Y = interpolate(l2Prog, [0, 1], [30, 0]);

  // Punchline: "BUT IT CAN'T OBSERVE YOUR USERS."
  const punchProg = spring({
    frame: frame - 45,
    fps: FPS,
    config: { damping: 10, stiffness: 160 },
    durationInFrames: 15,
  });
  const punchOpacity = interpolate(punchProg, [0, 1], [0, 1]);
  const punchScale = interpolate(punchProg, [0, 1], [0.88, 1]);

  // Glitch on punchline
  const glitchActive = frame >= 48 && frame <= 54;
  const glitchX = glitchActive ? Math.sin(frame * 35) * 5 : 0;

  // Flash burst on punchline
  const flashOpacity = interpolate(frame, [44, 48, 58], [0, 0.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Dim the first two lines after punchline
  const linesDim = interpolate(frame, [50, 65], [1, 0.35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* Flash burst */}
      <div
        style={{
          position: 'absolute',
          top: '58%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${COLORS.red}40 0%, transparent 60%)`,
          opacity: flashOpacity,
          filter: 'blur(50px)',
        }}
      />

      {/* Line 1 */}
      <div
        style={{
          position: 'absolute',
          top: '36%',
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: l1Opacity * linesDim,
          transform: `translateY(${l1Y}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 52,
            fontWeight: 800,
            color: COLORS.text,
            textShadow: `
              0 0 ${20 * glow}px ${COLORS.purple}40,
              0 0 ${40 * glow}px ${COLORS.purple}15
            `,
          }}
        >
          {TEXT.s2Line1}
        </div>
      </div>

      {/* Line 2 */}
      <div
        style={{
          position: 'absolute',
          top: '44%',
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: l2Opacity * linesDim,
          transform: `translateY(${l2Y}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 52,
            fontWeight: 800,
            color: COLORS.text,
            textShadow: `
              0 0 ${20 * glow}px ${COLORS.purple}40,
              0 0 ${40 * glow}px ${COLORS.purple}15
            `,
          }}
        >
          {TEXT.s2Line2}
        </div>
      </div>

      {/* Punchline */}
      <div
        style={{
          position: 'absolute',
          top: '56%',
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: punchOpacity,
          transform: `scale(${punchScale}) translateX(${glitchX}px)`,
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
            filter: `drop-shadow(0 0 ${20 * glow}px ${COLORS.red}40)`,
          }}
        >
          {TEXT.s2Punch}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Crow Exposes Reality ───────────────────────────────────────────
// Frames 275–464 (9.2–15.5s)

// Node positions: 3 source nodes + 1 center node
const SOURCE_NODES = [
  { x: 220, y: 820, label: 'WEB' },
  { x: 540, y: 720, label: 'SOCIAL' },
  { x: 860, y: 820, label: 'PHYSICAL' },
] as const;
const CENTER_NODE = { x: 540, y: 1080 };

const Scene3_Reality: React.FC = () => {
  const frame = useCurrentFrame();

  const hw = whoosh(frame, 0, 12);
  const glow = glowRamp(frame, 0, 20);

  // Chip stagger
  const chipAnims = TEXT.s3Chips.map((_, i) => {
    const delay = 18 + i * 8;
    const prog = spring({
      frame: frame - delay,
      fps: FPS,
      config: SPRING_SNAP,
      durationInFrames: 10,
    });
    return {
      opacity: interpolate(prog, [0, 1], [0, 1]),
      x: interpolate(prog, [0, 1], [-50, 0]),
      scale: interpolate(prog, [0, 1], [0.85, 1]),
    };
  });

  // Micro-subtext
  const microFade = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Source nodes appear
  const nodeAnims = SOURCE_NODES.map((_, i) => {
    const delay = 25 + i * 10;
    const prog = spring({
      frame: frame - delay,
      fps: FPS,
      config: SPRING_SNAP,
      durationInFrames: 12,
    });
    return {
      scale: interpolate(prog, [0, 1], [0.3, 1]),
      opacity: interpolate(prog, [0, 1], [0, 1]),
    };
  });

  // Center node appears
  const centerProg = spring({
    frame: frame - 55,
    fps: FPS,
    config: { damping: 10, stiffness: 160 },
    durationInFrames: 15,
  });
  const centerScale = interpolate(centerProg, [0, 1], [0.3, 1]);
  const centerOpacity = interpolate(centerProg, [0, 1], [0, 1]);

  // Lines draw from source nodes to center (staggered)
  const lineDraws = SOURCE_NODES.map((_, i) => {
    const lineStart = 60 + i * 8;
    return interpolate(frame, [lineStart, lineStart + 25], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  });

  // Traveling pulse dots along lines
  const pulsePhase = (frame % 40) / 40;

  // Data particles flowing along connections
  const dataParticles = SOURCE_NODES.flatMap((node, ni) => {
    return Array.from({ length: 3 }, (_, pi) => {
      const phase = ((frame * 0.03 + pi * 0.33 + ni * 0.2) % 1);
      const dx = CENTER_NODE.x - node.x;
      const dy = CENTER_NODE.y - node.y;
      return {
        x: node.x + dx * phase,
        y: node.y + dy * phase,
        opacity: Math.sin(phase * Math.PI) * 0.6 * (lineDraws[ni] ?? 0),
        color: ni === 0 ? COLORS.red : ni === 1 ? COLORS.purple : COLORS.cyan,
      };
    });
  });

  return (
    <AbsoluteFill>
      {/* Data particles */}
      {dataParticles.map((p, i) => (
        <div
          key={`dp-${i}`}
          style={{
            position: 'absolute',
            left: p.x - 3,
            top: p.y - 3,
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 12px ${p.color}`,
          }}
        />
      ))}

      {/* Node graph SVG */}
      <svg
        width={1080}
        height={1920}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="cr02-lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.red} />
            <stop offset="50%" stopColor={COLORS.purple} />
            <stop offset="100%" stopColor={COLORS.cyan} />
          </linearGradient>
          <filter id="cr02-nodeGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Connection lines with draw animation */}
        {SOURCE_NODES.map((node, i) => {
          const draw = lineDraws[i]!;
          return (
            <g key={`line-${i}`}>
              {/* Glow line */}
              <line
                x1={node.x}
                y1={node.y}
                x2={node.x + (CENTER_NODE.x - node.x) * draw}
                y2={node.y + (CENTER_NODE.y - node.y) * draw}
                stroke="url(#cr02-lineGrad)"
                strokeWidth={4}
                opacity={0.15}
              />
              {/* Main line */}
              <line
                x1={node.x}
                y1={node.y}
                x2={node.x + (CENTER_NODE.x - node.x) * draw}
                y2={node.y + (CENTER_NODE.y - node.y) * draw}
                stroke="url(#cr02-lineGrad)"
                strokeWidth={2}
                opacity={0.6}
              />
              {/* Traveling pulse dot */}
              {draw > 0.3 && (
                <circle
                  cx={node.x + (CENTER_NODE.x - node.x) * ((pulsePhase + i * 0.33) % 1)}
                  cy={node.y + (CENTER_NODE.y - node.y) * ((pulsePhase + i * 0.33) % 1)}
                  r={5}
                  fill={i === 0 ? COLORS.red : i === 1 ? COLORS.purple : COLORS.cyan}
                  opacity={0.8}
                />
              )}
            </g>
          );
        })}

        {/* Source nodes with glow */}
        {SOURCE_NODES.map((node, i) => {
          const a = nodeAnims[i]!;
          const nodeColor = i === 0 ? COLORS.red : i === 1 ? COLORS.purple : COLORS.cyan;
          return (
            <g
              key={`node-${i}`}
              transform={`translate(${node.x}, ${node.y}) scale(${a.scale})`}
              opacity={a.opacity}
            >
              {/* Outer glow */}
              <circle r={48} fill={`${nodeColor}08`} stroke="none" />
              {/* Glass circle */}
              <circle r={36} fill={`${COLORS.bg}cc`} stroke={nodeColor} strokeWidth={2} opacity={0.9} />
              <circle r={36} fill={`${nodeColor}08`} stroke="none" />
              {/* Inner highlight */}
              <circle r={34} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              {/* Label */}
              <text
                y={5}
                textAnchor="middle"
                fill={COLORS.text}
                fontFamily={FONTS.primary}
                fontSize={16}
                fontWeight={600}
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {/* Center CROW node */}
        <g
          transform={`translate(${CENTER_NODE.x}, ${CENTER_NODE.y}) scale(${centerScale})`}
          opacity={centerOpacity}
        >
          {/* Outer glow */}
          <circle
            r={70}
            fill={`${COLORS.purple}06`}
            stroke="none"
          />
          {/* Glass circle */}
          <circle r={52} fill={`${COLORS.bg}cc`} stroke="url(#cr02-lineGrad)" strokeWidth={3} />
          <circle
            r={52}
            fill={`${COLORS.purple}0a`}
            stroke="none"
          />
          {/* Inner highlight */}
          <circle r={50} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
          {/* Pulsing glow ring */}
          <circle
            r={62}
            fill="none"
            stroke={COLORS.purple}
            strokeWidth={1.5}
            opacity={0.2 + Math.sin(frame * 0.1) * 0.12}
          />
          <circle
            r={68}
            fill="none"
            stroke={COLORS.cyan}
            strokeWidth={0.5}
            opacity={0.1 + Math.sin(frame * 0.08 + 1) * 0.05}
          />
          <text
            y={6}
            textAnchor="middle"
            fill={COLORS.text}
            fontFamily={FONTS.primary}
            fontSize={22}
            fontWeight={800}
          >
            {TEXT.s3Center}
          </text>
        </g>
      </svg>

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 280,
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
          top: 460,
          left: SAFE.h,
          right: SAFE.h,
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
        }}
      >
        {TEXT.s3Chips.map((chip, i) => (
          <div
            key={chip}
            style={{
              opacity: chipAnims[i]!.opacity,
              transform: `translateX(${chipAnims[i]!.x}px) scale(${chipAnims[i]!.scale})`,
              padding: '12px 28px',
              borderRadius: 40,
              ...glassChip(glow, COLORS.purple),
              fontFamily: FONTS.primary,
              fontSize: 22,
              fontWeight: 700,
              color: COLORS.text,
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {chip}
            <LightSweep frame={frame} startFrame={25 + i * 10} duration={20} />
          </div>
        ))}
      </div>

      {/* Micro-subtext */}
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: microFade,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 20,
            fontWeight: 500,
            color: COLORS.textMuted,
            letterSpacing: 1,
            textShadow: `0 0 10px ${COLORS.purple}20`,
          }}
        >
          {TEXT.s3Micro}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Agents Retrieve Patterns ───────────────────────────────────────
// Frames 465–689 (15.5–23s)

const AGENT_CARDS = [
  { x: 540, y: 700, label: 'AGENT: GROWTH' },
  { x: 540, y: 900, label: 'AGENT: SUPPORT' },
  { x: 540, y: 1100, label: 'AGENT: OPS' },
] as const;

// Central node that agents pull from (positioned at top of the visual area)
const CENTRAL_Y = 500;

const Scene4_Agents: React.FC = () => {
  const frame = useCurrentFrame();

  const hw = whoosh(frame, 0, 12);
  const glow = glowRamp(frame, 0, 20);

  // Subtext
  const subFade = interpolate(frame, [14, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Agent cards slide up staggered
  const cardAnims = AGENT_CARDS.map((_, i) => {
    const delay = 20 + i * 12;
    const prog = spring({
      frame: frame - delay,
      fps: FPS,
      config: { damping: 12, stiffness: 180 },
      durationInFrames: 12,
    });
    return {
      opacity: interpolate(prog, [0, 1], [0, 1]),
      y: interpolate(prog, [0, 1], [60, 0]),
      scale: interpolate(prog, [0, 1], [0.88, 1]),
    };
  });

  // Lines connect from central node to cards
  const lineAnims = AGENT_CARDS.map((_, i) => {
    const lineStart = 35 + i * 12;
    return interpolate(frame, [lineStart, lineStart + 20], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  });

  // Action stamps cycle: appear one at a time after cards are in
  const actionStartFrame = 80;
  const actionIndex = Math.floor(
    interpolate(frame, [actionStartFrame, actionStartFrame + 60], [0, TEXT.s4Actions.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const currentAction = TEXT.s4Actions[Math.min(actionIndex, TEXT.s4Actions.length - 1)];
  const actionFade =
    frame >= actionStartFrame
      ? interpolate((frame - actionStartFrame) % 20, [0, 3, 17, 20], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
      : 0;

  // Subtle float
  const float = Math.sin(frame * 0.06) * 3;

  // Pulse on central node
  const centralPulse = Math.sin(frame * 0.12) * 0.15 + 0.85;

  // Data particles from center to cards
  const agentParticles = AGENT_CARDS.flatMap((card, ci) => {
    return Array.from({ length: 2 }, (_, pi) => {
      const phase = ((frame * 0.025 + pi * 0.5 + ci * 0.33) % 1);
      const dy = card.y - CENTRAL_Y;
      return {
        x: 540 + Math.sin(phase * Math.PI * 2) * 3,
        y: CENTRAL_Y + 28 + dy * phase,
        opacity: Math.sin(phase * Math.PI) * 0.5 * (lineAnims[ci] ?? 0),
        color: ci === 0 ? COLORS.red : ci === 1 ? COLORS.purple : COLORS.cyan,
      };
    });
  });

  return (
    <AbsoluteFill>
      {/* Particles */}
      {agentParticles.map((p, i) => (
        <div
          key={`ap-${i}`}
          style={{
            position: 'absolute',
            left: p.x - 3,
            top: p.y - 3,
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}

      {/* Connection lines + central reference node */}
      <svg
        width={1080}
        height={1920}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="cr02-agentLine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.purple} />
            <stop offset="50%" stopColor={COLORS.red} />
            <stop offset="100%" stopColor={COLORS.cyan} />
          </linearGradient>
        </defs>

        {/* Central CROW node (small reference) */}
        <circle
          cx={540}
          cy={CENTRAL_Y}
          r={32}
          fill={`${COLORS.bg}cc`}
          stroke={COLORS.purple}
          strokeWidth={2}
          opacity={centralPulse}
        />
        <circle
          cx={540}
          cy={CENTRAL_Y}
          r={32}
          fill={`${COLORS.purple}0a`}
          stroke="none"
        />
        {/* Pulsing outer ring */}
        <circle
          cx={540}
          cy={CENTRAL_Y}
          r={40}
          fill="none"
          stroke={COLORS.purple}
          strokeWidth={1}
          opacity={0.1 + Math.sin(frame * 0.1) * 0.08}
        />
        <text
          x={540}
          y={CENTRAL_Y + 5}
          textAnchor="middle"
          fill={COLORS.text}
          fontFamily={FONTS.primary}
          fontSize={14}
          fontWeight={700}
        >
          CROW
        </text>

        {/* Lines from center to cards */}
        {AGENT_CARDS.map((card, i) => {
          const draw = lineAnims[i]!;
          const dy = card.y - CENTRAL_Y;
          return (
            <g key={`al-${i}`}>
              {/* Glow line */}
              <line
                x1={540}
                y1={CENTRAL_Y + 32}
                x2={540}
                y2={CENTRAL_Y + 32 + dy * draw}
                stroke="url(#cr02-agentLine)"
                strokeWidth={4}
                opacity={0.12}
              />
              {/* Main line */}
              <line
                x1={540}
                y1={CENTRAL_Y + 32}
                x2={540}
                y2={CENTRAL_Y + 32 + dy * draw}
                stroke="url(#cr02-agentLine)"
                strokeWidth={1.5}
                opacity={0.5}
                strokeDasharray="6 4"
              />
            </g>
          );
        })}
      </svg>

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 250,
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
              0 0 ${30 * glow}px ${COLORS.purple}60,
              0 0 ${60 * glow}px ${COLORS.purple}20
            `,
          }}
        >
          {TEXT.s4Headline}
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: FONTS.primary,
            fontSize: 26,
            fontWeight: 500,
            color: COLORS.textMuted,
            opacity: subFade,
            textShadow: `0 0 10px ${COLORS.purple}20`,
          }}
        >
          {TEXT.s4Sub}
        </div>
      </div>

      {/* Glassmorphism agent cards */}
      {AGENT_CARDS.map((card, i) => {
        const a = cardAnims[i]!;
        const accentColor = i === 0 ? COLORS.red : i === 1 ? COLORS.purple : COLORS.cyan;
        return (
          <div
            key={`ac-${i}`}
            style={{
              position: 'absolute',
              left: card.x - 320,
              top: card.y - 36 + a.y + float,
              width: 640,
              opacity: a.opacity,
              transform: `scale(${a.scale})`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '22px 32px',
                borderRadius: 20,
                ...glassCard(glow),
                ...gradientBorder(glow),
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Icon with glow */}
              <div style={{ filter: `drop-shadow(0 0 6px ${accentColor})` }}>
                {i === 0 && <BrainIcon size={30} color={accentColor} />}
                {i === 1 && <PlugIcon size={30} color={accentColor} />}
                {i === 2 && <ApiIcon size={30} color={accentColor} />}
              </div>
              <div
                style={{
                  fontFamily: FONTS.primary,
                  fontSize: 24,
                  fontWeight: 700,
                  color: COLORS.text,
                  letterSpacing: 1,
                }}
              >
                {card.label}
              </div>
              <LightSweep frame={frame} startFrame={25 + i * 15} duration={22} />
            </div>
          </div>
        );
      })}

      {/* Action stamp - glass style */}
      {frame >= actionStartFrame && (
        <div
          style={{
            position: 'absolute',
            top: 1260,
            left: SAFE.h,
            right: SAFE.h,
            textAlign: 'center',
            opacity: actionFade,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '12px 40px',
              borderRadius: 12,
              ...glassChip(glow * actionFade, COLORS.red),
              fontFamily: FONTS.primary,
              fontSize: 22,
              fontWeight: 700,
              color: COLORS.text,
              textTransform: 'uppercase',
              letterSpacing: 3,
            }}
          >
            {currentAction}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─── Scene 5: Trust ─────────────────────────────────────────────────────────
// Frames 690–859 (23–28.6s)

const Scene5_Trust: React.FC = () => {
  const frame = useCurrentFrame();

  const hw = whoosh(frame, 0, 12);
  const glow = glowRamp(frame, 0, 20);

  // Shield icon animation
  const shieldProg = spring({
    frame: frame - 5,
    fps: FPS,
    config: { damping: 10, stiffness: 160 },
    durationInFrames: 15,
  });
  const shieldScale = interpolate(shieldProg, [0, 1], [0.3, 1]);
  const shieldOpacity = interpolate(shieldProg, [0, 1], [0, 1]);

  // Badge stagger
  const badgeAnims = TEXT.s5Badges.map((_, i) => {
    const delay = 20 + i * 12;
    const prog = spring({
      frame: frame - delay,
      fps: FPS,
      config: SPRING_SNAP,
      durationInFrames: 12,
    });
    return {
      opacity: interpolate(prog, [0, 1], [0, 1]),
      y: interpolate(prog, [0, 1], [40, 0]),
      scale: interpolate(prog, [0, 1], [0.85, 1]),
    };
  });

  // Subtext
  const subFade = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const pulse = breathe(frame, 0.08, 0.1);

  return (
    <AbsoluteFill>
      {/* Shield icon centered */}
      <div
        style={{
          position: 'absolute',
          top: 360,
          left: '50%',
          transform: `translateX(-50%) scale(${shieldScale * pulse})`,
          opacity: shieldOpacity,
        }}
      >
        <div
          style={{
            filter: `drop-shadow(0 0 20px ${COLORS.cyan}60)`,
          }}
        >
          <ShieldIcon size={100} color={COLORS.cyan} />
        </div>
      </div>

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 520,
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
            fontSize: 62,
            fontWeight: 900,
            color: COLORS.text,
            lineHeight: 1.1,
            textShadow: `
              0 0 ${30 * glow}px ${COLORS.cyan}60,
              0 0 ${60 * glow}px ${COLORS.cyan}20
            `,
          }}
        >
          {TEXT.s5Headline}
        </div>
      </div>

      {/* Trust badges */}
      <div
        style={{
          position: 'absolute',
          top: 720,
          left: SAFE.h,
          right: SAFE.h,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          alignItems: 'center',
        }}
      >
        {TEXT.s5Badges.map((badge, i) => {
          const a = badgeAnims[i]!;
          return (
            <div
              key={`badge-${i}`}
              style={{
                opacity: a.opacity,
                transform: `translateY(${a.y}px) scale(${a.scale})`,
                padding: '18px 40px',
                borderRadius: 16,
                ...glassCard(glow),
                ...gradientBorder(glow),
                fontFamily: FONTS.primary,
                fontSize: 22,
                fontWeight: 600,
                color: COLORS.text,
                letterSpacing: 1,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {badge}
              <LightSweep frame={frame} startFrame={25 + i * 15} duration={22} />
            </div>
          );
        })}
      </div>

      {/* Sub */}
      <div
        style={{
          position: 'absolute',
          top: 1080,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: subFade,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 22,
            fontWeight: 500,
            color: COLORS.textMuted,
            letterSpacing: 2,
            textShadow: `0 0 10px ${COLORS.cyan}20`,
          }}
        >
          {TEXT.s5Sub}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: CTA ────────────────────────────────────────────────────────────
// Frames 860–999 (28.7–33.3s)

const Scene6_CTA: React.FC = () => {
  const frame = useCurrentFrame();

  const ctaHw = whoosh(frame, 0, 10);

  // DM subtext
  const subProg = spring({
    frame: frame - 8,
    fps: FPS,
    config: SPRING_SNAP,
    durationInFrames: 10,
  });
  const subOpacity = interpolate(subProg, [0, 1], [0, 1]);
  const subY = interpolate(subProg, [0, 1], [20, 0]);

  // End card
  const endFade = interpolate(frame, [28, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Logo ring
  const ringProg = spring({
    frame: frame - 4,
    fps: FPS,
    config: SPRING_SNAP,
    durationInFrames: 12,
  });
  const ringScale = interpolate(ringProg, [0, 1], [0.5, 1]);
  const ringOpacity = interpolate(ringProg, [0, 1], [0, 1]);

  const glow = glowRamp(frame, 0, 15);
  const ringRotate = interpolate(frame, [0, 90], [0, 30]);
  const pulse = breathe(frame, 0.1, 0.08);

  // Divider expand
  const dividerW = interpolate(frame, [16, 30], [0, 240], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Confetti celebration
  const confettiCount = 18;
  const confetti = Array.from({ length: confettiCount }, (_, i) => {
    const angle = (i / confettiCount) * Math.PI * 2;
    const dist = interpolate(frame, [6, 35], [0, random(`cr02-cf-d-${i}`) * 280 + 80], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const opacity = interpolate(frame, [6, 18, 45], [0, 0.6, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return {
      x: 540 + Math.cos(angle) * dist,
      y: 510 + Math.sin(angle) * dist * 0.6,
      opacity,
      size: random(`cr02-cf-sz-${i}`) * 4 + 2,
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

      {/* Backdrop glow */}
      <div
        style={{
          position: 'absolute',
          top: 440,
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

      {/* Logo ring */}
      <div
        style={{
          position: 'absolute',
          top: 440,
          left: '50%',
          transform: `translateX(-50%) scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      >
        <svg width={160} height={160} viewBox="0 0 160 160">
          <defs>
            <linearGradient id="cr02-ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={COLORS.red} />
              <stop offset="50%" stopColor={COLORS.purple} />
              <stop offset="100%" stopColor={COLORS.cyan} />
            </linearGradient>
          </defs>
          {/* Outer glow */}
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
            stroke="url(#cr02-ringGrad)"
            strokeWidth={3}
            strokeDasharray="8 4"
            transform={`rotate(${ringRotate} 80 80)`}
          />
          <circle cx={80} cy={80} r={52} fill={`${COLORS.purple}12`} stroke="none" />
          {/* Inner highlight */}
          <circle cx={80} cy={80} r={50} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
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

      {/* CTA headline */}
      <div
        style={{
          position: 'absolute',
          top: 660,
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
            fontSize: 62,
            fontWeight: 900,
            color: COLORS.text,
            lineHeight: 1.1,
            textShadow: `
              0 0 ${40 * glow}px ${COLORS.red}60,
              0 0 ${80 * glow}px ${COLORS.red}20
            `,
          }}
        >
          {TEXT.s6Cta}
        </div>
      </div>

      {/* DM subtext */}
      <div
        style={{
          position: 'absolute',
          top: 820,
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
          top: 900,
          left: '50%',
          transform: 'translateX(-50%)',
          width: dividerW,
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

export const CrowReel_PlugAIIntoReality: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Background layers */}
      <AuroraBackground seed="cr02-aurora" opacity={0.18} />
      <Starfield seed="cr02" />
      <NoiseOverlay id="cr02-noise" />
      <ScanLines opacity={0.02} />

      {/* Floating orbs for depth */}
      <GlowOrb x={80} y={25} size={320} color={COLORS.purple} speed={0.02} phase={0} />
      <GlowOrb x={20} y={65} size={280} color={COLORS.red} speed={0.025} phase={3} />

      {/* Accent lines */}
      <AccentLines />

      {/* Scenes */}
      <Sequence from={0} durationInFrames={115}>
        <Scene1_Hook />
      </Sequence>

      <Sequence from={115} durationInFrames={160}>
        <Scene2_Problem />
      </Sequence>

      <Sequence from={275} durationInFrames={190}>
        <Scene3_Reality />
      </Sequence>

      <Sequence from={465} durationInFrames={225}>
        <Scene4_Agents />
      </Sequence>

      <Sequence from={690} durationInFrames={170}>
        <Scene5_Trust />
      </Sequence>

      <Sequence from={860} durationInFrames={140}>
        <Scene6_CTA />
      </Sequence>

      {/* Vignette on top */}
      <Vignette intensity={0.65} />

      {/* Background music (lower volume to let voice be heard) */}
      <Audio src={staticFile('audio/reel-2 audio')} volume={0.35} />

      {/* Voiceover segments – timed to each scene with duration caps */}
      <Sequence from={3} durationInFrames={110}>
        <Audio src={staticFile('audio/r2-s1-hook.mp3')} volume={1} />
      </Sequence>
      <Sequence from={118} durationInFrames={152}>
        <Audio src={staticFile('audio/r2-s2-problem.mp3')} volume={1} />
      </Sequence>
      <Sequence from={279} durationInFrames={182}>
        <Audio src={staticFile('audio/r2-s3-reality.mp3')} volume={1} />
      </Sequence>
      <Sequence from={469} durationInFrames={218}>
        <Audio src={staticFile('audio/r2-s4-agents.mp3')} volume={1} />
      </Sequence>
      <Sequence from={694} durationInFrames={164}>
        <Audio src={staticFile('audio/r2-s5-trust.mp3')} volume={1} />
      </Sequence>
      <Sequence from={864} durationInFrames={132}>
        <Audio src={staticFile('audio/r2-s6-cta.mp3')} volume={1} />
      </Sequence>
    </AbsoluteFill>
  );
};
