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
  SPRING_SOFT,
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

// ─── Editable Copy ────────────────────────────────────────────────────────────

const TEXT = {
  // Scene 1 – 3 Months Later
  s1Tag: '— 3 MONTHS LATER —',
  s1Headline: 'THE PRODUCT THAT\nCHANGED EVERYTHING.',

  // Scene 2 – Problem
  s2Headline: 'YOUR DATA IS EVERYWHERE.',
  s2Sub: "BUT YOU CAN'T SEE IT.",
  s2Channels: ['WEB CLICKS', 'STORE VISITS', 'SOCIAL BUZZ'] as readonly string[],
  s2Sub2: 'DISCONNECTED. UNREADABLE. USELESS.',

  // Scene 3 – CROW Unifies
  s3Eyebrow: 'INTRODUCING',
  s3Logo: 'CROW',
  s3Sub: 'COGNITIVE REASONING OBSERVATION WATCHER',
  s3Channels: ['WEB', 'SOCIAL', 'PHYSICAL'] as readonly string[],
  s3Center: 'ONE\nINTELLIGENT\nPLATFORM',

  // Scene 4 – AI Intelligence
  s4Headline: 'ASK ANYTHING.\nGET ANSWERS INSTANTLY.',
  s4Query: '"Why did sales drop on Thursday?"',
  s4Response: 'CROW analyzed 14,847 interactions across web, 2 store locations, and 3 social channels. A 34% spike in competitor mentions began Wednesday evening, correlating with a 12% drop in product page dwell time.',
  s4Chips: ['MULTI-AGENT AI', 'EDGE PROCESSED', 'NATURAL LANGUAGE'] as readonly string[],

  // Scene 5 – Numbers
  s5Tag: 'BUILT FOR SCALE',
  s5Stats: [
    { value: '100K+', label: 'EVENTS/SEC' },
    { value: '<50ms', label: 'INGESTION' },
    { value: '300+', label: 'EDGE NODES' },
    { value: '99.9%', label: 'UPTIME SLA' },
  ] as readonly { value: string; label: string }[],
  s5Sub: 'POWERED BY CLOUDFLARE\'S GLOBAL EDGE NETWORK',

  // Scene 6 – CTA
  s6Cta: 'SEE WHAT YOUR\nCUSTOMERS REALLY DO.',
  s6Sub: 'crowai.dev',
  s6End: 'CROW  ·  BY B3',
} as const;

// ─── Scene 1: 3 Months Later ──────────────────────────────────────────────────
// Frames 0–120 (4s) — freeze-frame reveal with dramatic stamp

const Scene1_ThreeMonthsLater: React.FC = () => {
  const frame = useCurrentFrame();

  // Film-grain freeze-frame effect: slight desaturation at start
  const grainOpacity = interpolate(frame, [0, 20], [0.18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Timestamp tag slams in
  const tagW = whoosh(frame, 4, 12);
  const tagGlow = glowRamp(frame, 4, 25);

  // Headline: two words stagger in
  const line1W = whoosh(frame, 22, 14);
  const line2W = whoosh(frame, 34, 14);

  // Underline sweeps across
  const underlineW = interpolate(frame, [50, 80], [0, 560], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Whole thing fades out at end
  const sceneOut = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOut }}>
      {/* Film grain layer */}
      <AbsoluteFill
        style={{
          background: 'rgba(0,0,0,0)',
          opacity: grainOpacity,
          mixBlendMode: 'overlay',
        }}
      >
        <svg width="100%" height="100%">
          <filter id="s1-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
          <rect width="100%" height="100%" filter="url(#s1-grain)" opacity="1" />
        </svg>
      </AbsoluteFill>

      {/* Timestamp tag */}
      <div
        style={{
          position: 'absolute',
          top: 380,
          left: '50%',
          transform: `translateX(-50%) translateY(${tagW.translateY}px)`,
          opacity: tagW.opacity,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ width: 80, height: 2, background: COLORS.gradient, opacity: tagGlow }} />
        <span
          style={{
            fontFamily: FONTS.primary,
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.textMuted,
            letterSpacing: 8,
            textTransform: 'uppercase',
            filter: `drop-shadow(0 0 ${12 * tagGlow}px ${COLORS.red}60)`,
          }}
        >
          {TEXT.s1Tag}
        </span>
        <div style={{ width: 80, height: 2, background: COLORS.gradient, opacity: tagGlow }} />
      </div>

      {/* Main headline — 2 lines staggered */}
      <div
        style={{
          position: 'absolute',
          top: 440,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
        }}
      >
        {['THE PRODUCT THAT', 'CHANGED EVERYTHING.'].map((line, i) => {
          const w = i === 0 ? line1W : line2W;
          const isHighlight = i === 1;
          return (
            <div
              key={i}
              style={{
                opacity: w.opacity,
                transform: `translateY(${w.translateY}px)`,
                fontFamily: FONTS.primary,
                fontSize: 96,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: -2,
                ...(isHighlight
                  ? {
                      background: COLORS.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: `drop-shadow(0 0 ${30 * tagGlow}px ${COLORS.red}50)`,
                    }
                  : {
                      color: COLORS.text,
                    }),
              }}
            >
              {line}
            </div>
          );
        })}
      </div>

      {/* Animated underline */}
      <div
        style={{
          position: 'absolute',
          top: 660,
          left: '50%',
          transform: 'translateX(-50%)',
          width: underlineW,
          height: 3,
          background: COLORS.gradient,
          borderRadius: 2,
          boxShadow: `0 0 12px ${COLORS.red}50`,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 2: The Problem ─────────────────────────────────────────────────────
// Frames 120–300 (6s)

const Scene2_Problem: React.FC = () => {
  const frame = useCurrentFrame();

  const headlineW = whoosh(frame, 6, 14);
  const subW = whoosh(frame, 22, 12);

  // Scattered channel chips animate in with chaos
  const chipOpacities = TEXT.s2Channels.map((_, i) =>
    interpolate(frame, [30 + i * 14, 46 + i * 14], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const chipX = TEXT.s2Channels.map((_, i) => {
    const spread = spring({
      frame: frame - (30 + i * 14),
      fps: FPS,
      config: { damping: 8, stiffness: 90 },
      durationInFrames: 20,
    });
    const targets = [-340, 0, 340];
    return interpolate(spread, [0, 1], [random(`prob-chip-x-${i}`) * 200 - 100, targets[i]]);
  });
  const chipY = TEXT.s2Channels.map((_, i) => {
    const spread = spring({
      frame: frame - (30 + i * 14),
      fps: FPS,
      config: { damping: 8, stiffness: 90 },
      durationInFrames: 20,
    });
    const targets = [30, -30, 30];
    return interpolate(spread, [0, 1], [random(`prob-chip-y-${i}`) * 140 - 70, targets[i]]);
  });

  // Red "X" slash lines across scattered chips
  const slashOpacity = glowRamp(frame, 90, 20);

  const sub2W = whoosh(frame, 104, 12);

  const sceneOut = interpolate(frame, [165, 180], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOut }}>
      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 280,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: headlineW.opacity,
          transform: `translateY(${headlineW.translateY}px)`,
          fontFamily: FONTS.primary,
          fontSize: 72,
          fontWeight: 900,
          color: COLORS.text,
          letterSpacing: -1,
        }}
      >
        {TEXT.s2Headline}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 380,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: subW.opacity,
          transform: `translateY(${subW.translateY}px)`,
          fontFamily: FONTS.primary,
          fontSize: 36,
          fontWeight: 600,
          color: COLORS.textMuted,
          letterSpacing: 3,
        }}
      >
        {TEXT.s2Sub}
      </div>

      {/* Scattered / orbiting chips */}
      <div
        style={{
          position: 'absolute',
          top: 480,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {TEXT.s2Channels.map((ch, i) => {
          const accentColors = [COLORS.cyan, COLORS.red, COLORS.purple];
          const accent = accentColors[i];
          return (
            <div
              key={ch}
              style={{
                position: 'absolute',
                opacity: chipOpacities[i],
                transform: `translate(${chipX[i]}px, ${chipY[i]}px)`,
                ...glassChip(0.5, accent),
                padding: '16px 32px',
                borderRadius: 12,
                fontFamily: FONTS.primary,
                fontSize: 22,
                fontWeight: 700,
                color: accent,
                letterSpacing: 3,
                whiteSpace: 'nowrap',
              }}
            >
              {ch}
            </div>
          );
        })}

        {/* Slash disconnection lines */}
        <svg
          style={{
            position: 'absolute',
            width: 800,
            height: 160,
            opacity: slashOpacity,
            top: 0,
            left: 0,
          }}
          viewBox="0 0 800 160"
        >
          <line x1="100" y1="40" x2="350" y2="120" stroke={COLORS.red} strokeWidth="2" opacity="0.4" strokeDasharray="8 4" />
          <line x1="700" y1="40" x2="450" y2="120" stroke={COLORS.red} strokeWidth="2" opacity="0.4" strokeDasharray="8 4" />
          <line x1="400" y1="20" x2="400" y2="140" stroke={COLORS.red} strokeWidth="1.5" opacity="0.3" strokeDasharray="6 4" />
        </svg>
      </div>

      {/* Sub2 */}
      <div
        style={{
          position: 'absolute',
          top: 680,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: sub2W.opacity,
          transform: `translateY(${sub2W.translateY}px)`,
          fontFamily: FONTS.primary,
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.red,
          letterSpacing: 5,
        }}
      >
        {TEXT.s2Sub2}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: CROW Unifies ────────────────────────────────────────────────────
// Frames 300–540 (8s)

const Scene3_CrowUnifies: React.FC = () => {
  const frame = useCurrentFrame();

  const eyeW = whoosh(frame, 4, 10);
  const logoGlow = glowRamp(frame, 10, 30);
  const logoPulse = breathe(frame, 0.04, 0.08);

  const logoScale = spring({
    frame: frame - 8,
    fps: FPS,
    config: { damping: 9, stiffness: 120 },
    durationInFrames: 30,
  });
  const logoScaleVal = interpolate(logoScale, [0, 1], [0.7, 1]);

  // Three channel nodes orbit in
  const nodeDelays = [14, 28, 42];
  const nodeAngles = [-120, 0, 120]; // degrees from top
  const nodeRadius = 260;

  const nodeProgresses = nodeDelays.map((delay) =>
    spring({
      frame: frame - delay,
      fps: FPS,
      config: SPRING_SNAP,
      durationInFrames: 22,
    })
  );

  const nodeColors = [COLORS.cyan, COLORS.red, COLORS.purple];

  // Connecting lines
  const linesOpacity = glowRamp(frame, 60, 20);

  // Center text
  const centerW = whoosh(frame, 68, 14);

  const subW = whoosh(frame, 82, 12);

  const sceneOut = interpolate(frame, [225, 240], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOut }}>
      {/* Eyebrow */}
      <div
        style={{
          position: 'absolute',
          top: 130,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: eyeW.opacity,
          transform: `translateY(${eyeW.translateY}px)`,
          fontFamily: FONTS.primary,
          fontSize: 20,
          fontWeight: 700,
          color: COLORS.textMuted,
          letterSpacing: 10,
        }}
      >
        {TEXT.s3Eyebrow}
      </div>

      {/* CROW Logo in center */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${logoScaleVal})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.red}28 0%, ${COLORS.purple}18 60%, transparent 100%)`,
            border: `2px solid ${COLORS.red}60`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `
              0 0 ${40 * logoGlow * logoPulse}px ${COLORS.red}50,
              0 0 ${80 * logoGlow * logoPulse}px ${COLORS.purple}25,
              inset 0 0 40px ${COLORS.red}10
            `,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.primary,
              fontSize: 52,
              fontWeight: 900,
              background: COLORS.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 4,
              filter: `drop-shadow(0 0 ${20 * logoGlow}px ${COLORS.red}60)`,
            }}
          >
            {TEXT.s3Logo}
          </span>
        </div>

        <div
          style={{
            opacity: centerW.opacity,
            transform: `translateY(${centerW.translateY}px)`,
            fontFamily: FONTS.primary,
            fontSize: 18,
            fontWeight: 700,
            color: COLORS.textMuted,
            letterSpacing: 2,
            textAlign: 'center',
            whiteSpace: 'pre-line',
            lineHeight: 1.5,
          }}
        >
          {TEXT.s3Center}
        </div>
      </div>

      {/* Orbital channel nodes */}
      {TEXT.s3Channels.map((ch, i) => {
        const prog = nodeProgresses[i];
        const angleDeg = nodeAngles[i] - 90; // offset so 0 is top
        const rad = (angleDeg * Math.PI) / 180;
        const cx = 960; // center X of 1920
        const cy = 540; // center Y of 1080
        const nx = cx + nodeRadius * Math.cos(rad);
        const ny = cy + nodeRadius * Math.sin(rad);
        const opacity = interpolate(prog, [0, 1], [0, 1]);
        const scale = interpolate(prog, [0, 1], [0.4, 1]);
        const color = nodeColors[i];

        return (
          <React.Fragment key={ch}>
            {/* Connector line */}
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                opacity: linesOpacity * opacity,
                pointerEvents: 'none',
              }}
              viewBox="0 0 1920 1080"
            >
              <line
                x1={cx}
                y1={cy}
                x2={nx}
                y2={ny}
                stroke={color}
                strokeWidth="1.5"
                opacity="0.35"
                strokeDasharray="6 4"
              />
              <circle cx={nx} cy={ny} r={4} fill={color} opacity="0.6" />
            </svg>

            {/* Node chip */}
            <div
              style={{
                position: 'absolute',
                left: nx - 72,
                top: ny - 30,
                width: 144,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity,
                transform: `scale(${scale})`,
                ...glassChip(0.6, color),
                borderRadius: 14,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.primary,
                  fontSize: 20,
                  fontWeight: 800,
                  color,
                  letterSpacing: 4,
                }}
              >
                {ch}
              </span>
            </div>
          </React.Fragment>
        );
      })}

      {/* Sub tagline */}
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: subW.opacity,
          transform: `translateY(${subW.translateY}px)`,
          fontFamily: FONTS.primary,
          fontSize: 20,
          fontWeight: 600,
          color: COLORS.textMuted,
          letterSpacing: 4,
        }}
      >
        {TEXT.s3Sub}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: AI Intelligence ─────────────────────────────────────────────────
// Frames 540–720 (6s)

const Scene4_AI: React.FC = () => {
  const frame = useCurrentFrame();

  const headlineW = whoosh(frame, 4, 14);

  // Query card types in letter by letter
  const queryLen = TEXT.s4Query.length;
  const typedCount = Math.floor(
    interpolate(frame, [22, 80], [0, queryLen], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const typedText = TEXT.s4Query.slice(0, typedCount);
  const cursorBlink = Math.sin(frame * 0.4) > 0;

  // Response card fades in
  const responseOpacity = interpolate(frame, [82, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const responseY = interpolate(frame, [82, 110], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Chip row
  const chipDelays = [116, 128, 140];
  const chipOpacities = chipDelays.map((d) =>
    interpolate(frame, [d, d + 14], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const sceneOut = interpolate(frame, [165, 180], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOut }}>
      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 160,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: headlineW.opacity,
          transform: `translateY(${headlineW.translateY}px)`,
          fontFamily: FONTS.primary,
          fontSize: 68,
          fontWeight: 900,
          color: COLORS.text,
          lineHeight: 1.1,
          letterSpacing: -1,
          whiteSpace: 'pre-line',
        }}
      >
        {TEXT.s4Headline}
      </div>

      {/* Query card */}
      <div
        style={{
          position: 'absolute',
          top: 380,
          left: SAFE.h,
          right: SAFE.h,
          ...glassCard(0.4),
          borderRadius: 20,
          padding: '28px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* Query icon */}
        <svg width={32} height={32} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={COLORS.cyan} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span
          style={{
            fontFamily: FONTS.primary,
            fontSize: 26,
            fontWeight: 600,
            color: COLORS.text,
            letterSpacing: 0.2,
            fontStyle: 'italic',
          }}
        >
          {typedText}
          {cursorBlink && typedCount < queryLen && (
            <span style={{ color: COLORS.cyan, fontStyle: 'normal' }}>|</span>
          )}
        </span>
      </div>

      {/* Response card */}
      <div
        style={{
          position: 'absolute',
          top: 492,
          left: SAFE.h,
          right: SAFE.h,
          opacity: responseOpacity,
          transform: `translateY(${responseY}px)`,
          ...glassCard(0.3),
          borderRadius: 20,
          borderLeft: `3px solid ${COLORS.purple}`,
          padding: '28px 40px',
          display: 'flex',
          gap: 20,
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.purple}60, ${COLORS.red}30)`,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
          }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <path d="M12 2C9.5 2 7.5 3.5 7 5.5C5.5 5.5 4 7 4 9c0 1.5.8 2.8 2 3.5-.2.5-.3 1-.3 1.5 0 2.2 1.8 4 4 4h.3c.5 1.2 1.7 2 3 2s2.5-.8 3-2h.3c2.2 0 4-1.8 4-4 0-.5-.1-1-.3-1.5 1.2-.7 2-2 2-3.5 0-2-1.5-3.5-3-3.5C18.5 3.5 16.5 2 14 2h-2z" stroke="white" strokeWidth={1.5} />
          </svg>
        </div>
        <span
          style={{
            fontFamily: FONTS.primary,
            fontSize: 20,
            fontWeight: 500,
            color: COLORS.text,
            lineHeight: 1.65,
            opacity: 0.92,
          }}
        >
          {TEXT.s4Response}
        </span>
      </div>

      {/* Chip row */}
      <div
        style={{
          position: 'absolute',
          bottom: 130,
          left: SAFE.h,
          right: SAFE.h,
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        {TEXT.s4Chips.map((chip, i) => {
          const chipColors = [COLORS.purple, COLORS.red, COLORS.cyan];
          const c = chipColors[i];
          return (
            <div
              key={chip}
              style={{
                opacity: chipOpacities[i],
                ...glassChip(0.6, c),
                padding: '12px 28px',
                borderRadius: 40,
                fontFamily: FONTS.primary,
                fontSize: 18,
                fontWeight: 700,
                color: c,
                letterSpacing: 3,
              }}
            >
              {chip}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Stats ────────────────────────────────────────────────────────────
// Frames 720–840 (4s)

const Scene5_Stats: React.FC = () => {
  const frame = useCurrentFrame();

  const tagW = whoosh(frame, 4, 10);

  // Stats stagger in
  const statDelays = [18, 30, 42, 54];
  const statProgresses = statDelays.map((d) =>
    spring({
      frame: frame - d,
      fps: FPS,
      config: SPRING_SNAP,
      durationInFrames: 20,
    })
  );

  const subW = whoosh(frame, 72, 12);

  const sceneOut = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const statColors = [COLORS.cyan, COLORS.purple, COLORS.red, COLORS.cyan];

  return (
    <AbsoluteFill style={{ opacity: sceneOut }}>
      {/* Tag */}
      <div
        style={{
          position: 'absolute',
          top: 240,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: tagW.opacity,
          transform: `translateY(${tagW.translateY}px)`,
          fontFamily: FONTS.primary,
          fontSize: 22,
          fontWeight: 700,
          color: COLORS.textMuted,
          letterSpacing: 8,
        }}
      >
        {TEXT.s5Tag}
      </div>

      {/* Stats grid */}
      <div
        style={{
          position: 'absolute',
          top: 320,
          left: SAFE.h,
          right: SAFE.h,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24,
        }}
      >
        {TEXT.s5Stats.map((stat, i) => {
          const prog = statProgresses[i];
          const opacity = interpolate(prog, [0, 1], [0, 1]);
          const scale = interpolate(prog, [0, 1], [0.75, 1]);
          const color = statColors[i];
          const glow = glowRamp(frame, statDelays[i] + 10, 20);

          return (
            <div
              key={stat.label}
              style={{
                opacity,
                transform: `scale(${scale})`,
                ...glassCard(glow * 0.5),
                borderRadius: 20,
                padding: '40px 24px',
                textAlign: 'center',
                borderTop: `2px solid ${color}50`,
                boxShadow: `
                  0 8px 32px rgba(0,0,0,0.4),
                  0 0 ${24 * glow}px ${color}30,
                  inset 0 1px 0 rgba(255,255,255,0.06)
                `,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.primary,
                  fontSize: 56,
                  fontWeight: 900,
                  color,
                  lineHeight: 1,
                  marginBottom: 12,
                  filter: `drop-shadow(0 0 ${16 * glow}px ${color}60)`,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: FONTS.primary,
                  fontSize: 17,
                  fontWeight: 700,
                  color: COLORS.textMuted,
                  letterSpacing: 3,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sub */}
      <div
        style={{
          position: 'absolute',
          bottom: 140,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: subW.opacity,
          transform: `translateY(${subW.translateY}px)`,
          fontFamily: FONTS.primary,
          fontSize: 20,
          fontWeight: 600,
          color: COLORS.textMuted,
          letterSpacing: 4,
        }}
      >
        {TEXT.s5Sub}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: CTA ─────────────────────────────────────────────────────────────
// Frames 840–900 (2s)

const Scene6_CTA: React.FC = () => {
  const frame = useCurrentFrame();

  const glow = glowRamp(frame, 4, 30);
  const pulse = breathe(frame, 0.06, 0.12);

  const ctaW = whoosh(frame, 6, 14);
  const subScale = spring({
    frame: frame - 22,
    fps: FPS,
    config: SPRING_SOFT,
    durationInFrames: 22,
  });
  const subOpacity = interpolate(subScale, [0, 1], [0, 1]);
  const subY = interpolate(subScale, [0, 1], [20, 0]);

  const dividerW = interpolate(frame, [36, 56], [0, 440], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const endFade = interpolate(frame, [58, 72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {/* CTA headline */}
      <div
        style={{
          position: 'absolute',
          top: 330,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: ctaW.opacity,
          transform: `translateY(${ctaW.translateY}px)`,
          fontFamily: FONTS.primary,
          fontSize: 80,
          fontWeight: 900,
          color: COLORS.text,
          lineHeight: 1.1,
          letterSpacing: -1,
          whiteSpace: 'pre-line',
          textShadow: `
            0 0 ${40 * glow}px ${COLORS.red}50,
            0 0 ${80 * glow}px ${COLORS.purple}20
          `,
        }}
      >
        {TEXT.s6Cta}
      </div>

      {/* URL */}
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: subOpacity * (glow * 0.4 + 0.6),
          transform: `translateY(${subY}px)`,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.primary,
            fontSize: 48,
            fontWeight: 800,
            background: COLORS.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 5,
            filter: `drop-shadow(0 0 ${20 * glow * pulse}px ${COLORS.red}50)`,
          }}
        >
          {TEXT.s6Sub}
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          position: 'absolute',
          top: 650,
          left: '50%',
          transform: 'translateX(-50%)',
          width: dividerW,
          height: 2,
          background: COLORS.gradient,
          borderRadius: 1,
          boxShadow: `0 0 10px ${COLORS.red}40`,
        }}
      />

      {/* End card */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: SAFE.h,
          right: SAFE.h,
          textAlign: 'center',
          opacity: endFade,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.primary,
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.textMuted,
            letterSpacing: 8,
            textTransform: 'uppercase',
            textShadow: `0 0 10px ${COLORS.purple}30`,
          }}
        >
          {TEXT.s6End}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition ──────────────────────────────────────────────────────────
// 30 seconds × 30fps = 900 frames
// Scene timing:
//   0–120   Scene 1: 3 Months Later reveal    (4s)
//   120–300 Scene 2: The Problem              (6s)
//   300–540 Scene 3: CROW Unifies             (8s)
//   540–720 Scene 4: AI Intelligence          (6s)
//   720–840 Scene 5: Stats                    (4s)
//   840–900 Scene 6: CTA                      (2s)

export const CrowReel_3MonthsLater: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Background layers */}
      <AuroraBackground seed="3ml-aurora" opacity={0.14} />
      <Starfield seed="3ml" />
      <NoiseOverlay id="3ml-noise" />
      <ScanLines opacity={0.018} />

      {/* Ambient orbs */}
      <GlowOrb x={15}  y={20}  size={380} color={COLORS.red}    speed={0.018} phase={0} />
      <GlowOrb x={82}  y={72}  size={320} color={COLORS.purple} speed={0.022} phase={2} />
      <GlowOrb x={50}  y={50}  size={260} color={COLORS.cyan}   speed={0.03}  phase={5} />

      <AccentLines />

      {/* Light sweep on scene transitions */}
      <Sequence from={118} durationInFrames={10}>
        <LightSweep />
      </Sequence>
      <Sequence from={298} durationInFrames={10}>
        <LightSweep />
      </Sequence>
      <Sequence from={538} durationInFrames={10}>
        <LightSweep />
      </Sequence>
      <Sequence from={718} durationInFrames={10}>
        <LightSweep />
      </Sequence>
      <Sequence from={838} durationInFrames={10}>
        <LightSweep />
      </Sequence>

      {/* Scenes */}
      <Sequence from={0}   durationInFrames={120}>
        <Scene1_ThreeMonthsLater />
      </Sequence>

      <Sequence from={120} durationInFrames={180}>
        <Scene2_Problem />
      </Sequence>

      <Sequence from={300} durationInFrames={240}>
        <Scene3_CrowUnifies />
      </Sequence>

      <Sequence from={540} durationInFrames={180}>
        <Scene4_AI />
      </Sequence>

      <Sequence from={720} durationInFrames={120}>
        <Scene5_Stats />
      </Sequence>

      <Sequence from={840} durationInFrames={60}>
        <Scene6_CTA />
      </Sequence>

      {/* Vignette */}
      <Vignette intensity={0.6} />

      {/* Background music — same vibe as existing reels */}
      {/* <Audio src={staticFile('audio/3ml-bg.mp3')} volume={0.3} /> */}

      {/* Voiceover segments — drop in when recorded */}
      {/* Scene 1 */}
      {/* <Sequence from={4} durationInFrames={114}><Audio src={staticFile('audio/3ml-s1.mp3')} volume={1} /></Sequence> */}
      {/* Scene 2 */}
      {/* <Sequence from={124} durationInFrames={172}><Audio src={staticFile('audio/3ml-s2.mp3')} volume={1} /></Sequence> */}
      {/* Scene 3 */}
      {/* <Sequence from={304} durationInFrames={232}><Audio src={staticFile('audio/3ml-s3.mp3')} volume={1} /></Sequence> */}
      {/* Scene 4 */}
      {/* <Sequence from={544} durationInFrames={172}><Audio src={staticFile('audio/3ml-s4.mp3')} volume={1} /></Sequence> */}
      {/* Scene 5 */}
      {/* <Sequence from={724} durationInFrames={112}><Audio src={staticFile('audio/3ml-s5.mp3')} volume={1} /></Sequence> */}
      {/* Scene 6 */}
      {/* <Sequence from={844} durationInFrames={54}><Audio src={staticFile('audio/3ml-s6.mp3')} volume={1} /></Sequence> */}
    </AbsoluteFill>
  );
};
