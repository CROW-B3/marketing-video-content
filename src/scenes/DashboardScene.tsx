import { useCurrentFrame, useVideoConfig, spring, interpolate, random } from 'remotion';

const COLORS = {
  background: '#0a0a0f',
  backgroundLight: '#12121a',
  accent: '#00d4ff',
  accentPurple: '#7c3aed',
  text: '#ffffff',
  textMuted: '#94a3b8',
  textDim: '#475569',
};

const FONT_FAMILY = 'Inter, system-ui, sans-serif';

// ── Metric card data ────────────────────────────────────────────
const METRICS = [
  { label: 'Interactions', value: 12400, display: '12.4K', prefix: '' },
  { label: 'Sentiment', value: 89, display: '89%', prefix: '' },
  { label: 'Patterns', value: 340, display: '340', prefix: '' },
] as const;

// ── Sidebar menu items ──────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { width: 90, delay: 0 },
  { width: 70, delay: 3 },
  { width: 100, delay: 6 },
  { width: 60, delay: 9 },
  { width: 80, delay: 12 },
  { width: 55, delay: 15 },
] as const;

// ── Bar chart data (heights as % of max) ────────────────────────
const BAR_HEIGHTS = [0.35, 0.55, 0.7, 0.45, 0.85, 0.6, 0.92, 0.5, 0.75, 0.65, 0.8, 0.4];

// ── AI Insight lines ────────────────────────────────────────────
const INSIGHTS = [
  'Customer satisfaction trending up +12% this week',
  'Peak engagement detected: Tuesdays 2-4 PM',
  'Negative sentiment cluster found in billing flow',
] as const;

function formatCountUp(value: number, display: string, progress: number): string {
  if (display.endsWith('K')) {
    const numericPart = parseFloat(display.replace('K', ''));
    const current = numericPart * progress;
    return current.toFixed(1) + 'K';
  }
  if (display.endsWith('%')) {
    const numericPart = parseFloat(display.replace('%', ''));
    return Math.round(numericPart * progress) + '%';
  }
  return Math.round(value * progress).toString();
}

export default function DashboardScene() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ── Timing (240 frames = 8 seconds at 30fps) ─────────────────
  // 0-40:    Browser chrome slides up from bottom
  // 20-60:   Dashboard top bar fades in
  // 30-70:   Sidebar items stagger in
  // 50-100:  Metric cards appear + numbers count up
  // 80-140:  Bar chart bars grow upward
  // 110-170: AI Insights text lines fade in one by one
  // 170-240: Hold, subtle ambient animations
  // 40-80:   Bottom tagline fades in

  // ── Browser Chrome slide-up ───────────────────────────────────
  const chromeSlideSpring = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 80, mass: 0.9 },
    durationInFrames: 50,
  });

  const chromeY = interpolate(chromeSlideSpring, [0, 1], [height * 0.6, 0]);
  const chromeOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── 3D Perspective Tilt ─────────────────────────────────────────
  const tiltSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 60, mass: 1.0 },
    durationInFrames: 70,
  });

  const tiltX = interpolate(tiltSpring, [0, 1], [3, 1]);
  const tiltY = interpolate(tiltSpring, [0, 1], [0.5, 0.15]);

  // ── Top bar ───────────────────────────────────────────────────
  const topBarOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Sidebar ───────────────────────────────────────────────────
  const sidebarOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Metric cards ──────────────────────────────────────────────
  const metricCardSprings = METRICS.map((_, i) =>
    spring({
      frame: frame - (50 + i * 10),
      fps,
      config: { damping: 14, stiffness: 100, mass: 0.7 },
    }),
  );

  // Count-up progress for metrics (starts after card appears, lasts ~40 frames)
  const metricCountProgress = METRICS.map((_, i) =>
    interpolate(frame, [60 + i * 10, 110 + i * 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  // ── AI Insights ───────────────────────────────────────────────
  const insightOpacities = INSIGHTS.map((_, i) =>
    interpolate(frame, [120 + i * 18, 140 + i * 18], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  const insightsHeaderOpacity = interpolate(frame, [110, 130], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Typing effect for first insight ───────────────────────────
  const firstInsightText = INSIGHTS[0]!;
  const typingStartFrame = 120;
  const typingEndFrame = typingStartFrame + firstInsightText.length * 1.2;
  const charsRevealed = Math.floor(
    interpolate(frame, [typingStartFrame, typingEndFrame], [0, firstInsightText.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const typedText = firstInsightText.slice(0, charsRevealed);
  // Blinking cursor (visible during typing, fades after)
  const cursorVisible =
    frame >= typingStartFrame && frame <= typingEndFrame + 30
      ? Math.sin(frame * 0.25) > 0
        ? 1
        : 0
      : 0;

  // ── Notification badge pulse ──────────────────────────────────
  const badgeOpacity = interpolate(frame, [115, 130], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const badgePulse =
    frame > 130
      ? interpolate(Math.sin((frame - 130) * 0.1), [-1, 1], [0.85, 1.15])
      : 1;
  const badgeGlowOpacity =
    frame > 130
      ? interpolate(Math.sin((frame - 130) * 0.1), [-1, 1], [0, 0.6])
      : 0;

  // ── Bottom tagline ────────────────────────────────────────────
  const taglineSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 20, stiffness: 50, mass: 0.6 },
  });

  const taglineOpacity = interpolate(frame, [50, 85], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const taglineY = interpolate(taglineSpring, [0, 1], [20, 0]);

  // ── Ambient glow pulse (after everything settles) ─────────────
  const glowPulse =
    frame > 140
      ? interpolate(Math.sin((frame - 140) * 0.04), [-1, 1], [0.4, 1])
      : 0.4;

  // ── Aurora Gradient Mesh blob positions ─────────────────────────
  const auroraTime = frame * 0.02;
  const cyanBlobX = Math.sin(auroraTime * 0.7) * 60;
  const cyanBlobY = Math.cos(auroraTime * 0.5) * 40;
  const purpleBlobX = Math.cos(auroraTime * 0.6) * 80 + 120;
  const purpleBlobY = Math.sin(auroraTime * 0.8) * 50 - 30;
  const purpleBlobX2 = Math.sin(auroraTime * 0.4 + 2) * 70 - 100;
  const purpleBlobY2 = Math.cos(auroraTime * 0.6 + 1) * 60 + 40;

  // ── Ambient Glow Orbs positions ─────────────────────────────────
  const orbTime = frame * 0.015;
  const orb1X = width * 0.35 + Math.sin(orbTime * 0.8) * 50;
  const orb1Y = height * 0.4 + Math.cos(orbTime * 0.6) * 35;
  const orb2X = width * 0.65 + Math.cos(orbTime * 0.5) * 60;
  const orb2Y = height * 0.55 + Math.sin(orbTime * 0.7) * 45;

  // Dashboard frame dimensions
  const dashW = width * 0.72;
  const dashH = height * 0.7;
  const sidebarW = 170;
  const topBarH = 48;
  const chromeBarH = 36;

  // ── Pre-compute bar springs for sparkline overlay ─────────────
  const barSprings = BAR_HEIGHTS.map((h, i) => {
    const barDelay = i * 3;
    const barSpring = spring({
      frame: frame - (85 + barDelay),
      fps,
      config: { damping: 12, stiffness: 90, mass: 0.5 },
    });
    return h * barSpring;
  });

  // ── Reflection opacity (fades in with the chrome) ─────────────
  const reflectionOpacity = interpolate(frame, [30, 60], [0, 0.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: COLORS.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT_FAMILY,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── SVG Film Grain Overlay ── */}
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          opacity: 0.04,
          zIndex: 100,
        }}
      >
        <defs>
          <filter id="dashGrain" x="0%" y="0%" width="100%" height="100%">
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
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#dashGrain)" />
      </svg>

      {/* ── Aurora Gradient Mesh Background ── */}
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'rgba(0, 212, 255, 0.05)',
          filter: 'blur(120px)',
          transform: `translate(${cyanBlobX}px, ${cyanBlobY}px)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'rgba(124, 58, 237, 0.04)',
          filter: 'blur(110px)',
          transform: `translate(${purpleBlobX}px, ${purpleBlobY}px)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'rgba(124, 58, 237, 0.03)',
          filter: 'blur(100px)',
          transform: `translate(${purpleBlobX2}px, ${purpleBlobY2}px)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Ambient Glow Orbs ── */}
      <div
        style={{
          position: 'absolute',
          left: orb1X - 225,
          top: orb1Y - 225,
          width: 450,
          height: 450,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.accent}0a 0%, transparent 70%)`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: orb2X - 250,
          top: orb2Y - 250,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.accentPurple}08 0%, transparent 70%)`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Subtle radial glow behind dashboard ── */}
      <div
        style={{
          position: 'absolute',
          width: dashW * 1.3,
          height: dashH * 1.3,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at center, ${COLORS.accent}08 0%, transparent 70%)`,
          opacity: glowPulse,
          pointerEvents: 'none',
        }}
      />

      {/* ── Browser Chrome Frame with 3D Perspective ── */}
      <div
        style={{
          opacity: chromeOpacity,
          transform: `translateY(${chromeY}px) perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          width: dashW,
          height: dashH,
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid ${COLORS.textDim}30`,
          boxShadow: `0 30px 80px rgba(0, 0, 0, 0.6), 0 0 60px ${COLORS.accent}08`,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* ── Chrome Title Bar ── */}
        <div
          style={{
            height: chromeBarH,
            backgroundColor: '#1a1a24',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 16,
            paddingRight: 16,
            flexShrink: 0,
            borderBottom: `1px solid ${COLORS.textDim}20`,
          }}
        >
          {/* Window dots */}
          {['#ff5f57', '#ffbd2e', '#28c840'].map((color, i) => (
            <div
              key={i}
              style={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                backgroundColor: color,
                marginRight: 7,
                opacity: 0.85,
              }}
            />
          ))}
          {/* URL bar placeholder */}
          <div
            style={{
              marginLeft: 24,
              flex: 1,
              height: 20,
              borderRadius: 6,
              backgroundColor: `${COLORS.textDim}15`,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 12,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: COLORS.textDim,
                letterSpacing: 0.5,
              }}
            >
              app.crow.ai/dashboard
            </span>
          </div>
        </div>

        {/* ── Dashboard Body ── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: COLORS.backgroundLight,
            overflow: 'hidden',
          }}
        >
          {/* ── Sidebar ── */}
          <div
            style={{
              width: sidebarW,
              backgroundColor: '#0e0e16',
              borderRight: `1px solid ${COLORS.textDim}15`,
              padding: '20px 16px',
              flexShrink: 0,
              opacity: sidebarOpacity,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {/* Sidebar logo area */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentPurple})`,
                  opacity: 0.9,
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: COLORS.text,
                  letterSpacing: 1.5,
                }}
              >
                CROW
              </span>
            </div>

            {/* Sidebar menu items */}
            {SIDEBAR_ITEMS.map((item, i) => {
              const itemOpacity = interpolate(
                frame,
                [35 + item.delay, 55 + item.delay],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
              );

              const isActive = i === 1;

              return (
                <div
                  key={i}
                  style={{
                    opacity: itemOpacity,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 8,
                    backgroundColor: isActive ? `${COLORS.accent}12` : 'transparent',
                  }}
                >
                  {/* Icon placeholder */}
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      backgroundColor: isActive ? `${COLORS.accent}40` : `${COLORS.textDim}30`,
                    }}
                  />
                  {/* Label placeholder bar */}
                  <div
                    style={{
                      width: item.width,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: isActive ? `${COLORS.accent}35` : `${COLORS.textDim}20`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* ── Main Content ── */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: 24,
              gap: 20,
              overflow: 'hidden',
            }}
          >
            {/* ── Dashboard Top Bar ── */}
            <div
              style={{
                opacity: topBarOpacity,
                height: topBarH,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: COLORS.text,
                  letterSpacing: 0.5,
                }}
              >
                CROW Dashboard
              </span>
              {/* Navigation dots */}
              <div style={{ display: 'flex', gap: 6 }}>
                {[true, false, false, false].map((active, i) => (
                  <div
                    key={i}
                    style={{
                      width: active ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: active ? COLORS.accent : `${COLORS.textDim}40`,
                      transition: 'width 0.3s',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── Metric Cards Row (Glassmorphism) ── */}
            <div
              style={{
                display: 'flex',
                gap: 16,
                flexShrink: 0,
              }}
            >
              {METRICS.map((metric, i) => {
                const cardScale = interpolate(metricCardSprings[i]!, [0, 1], [0.85, 1]);
                const cardOpacity = interpolate(metricCardSprings[i]!, [0, 1], [0, 1]);
                const cardY = interpolate(metricCardSprings[i]!, [0, 1], [15, 0]);
                const countDisplay = formatCountUp(
                  metric.value,
                  metric.display,
                  metricCountProgress[i]!,
                );

                // Subtle accent border color per card
                const accentColors = [COLORS.accent, COLORS.accentPurple, COLORS.accent];

                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      opacity: cardOpacity,
                      transform: `translateY(${cardY}px) scale(${cardScale})`,
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: 12,
                      padding: '18px 20px',
                      border: `1px solid ${accentColors[i]!}20`,
                      borderTop: `1px solid rgba(255, 255, 255, 0.08)`,
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: COLORS.textDim,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                      }}
                    >
                      {metric.label}
                    </span>
                    <span
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: COLORS.text,
                        letterSpacing: -0.5,
                        background: `linear-gradient(135deg, ${COLORS.text}, ${accentColors[i]!})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {countDisplay}
                    </span>
                    {/* Sparkline placeholder */}
                    <div
                      style={{
                        marginTop: 4,
                        width: '100%',
                        height: 3,
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${accentColors[i]!}40, ${accentColors[i]!}10)`,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* ── Chart + Insights Row ── */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                gap: 16,
                minHeight: 0,
              }}
            >
              {/* ── Bar Chart Area ── */}
              <div
                style={{
                  flex: 1.5,
                  backgroundColor: `${COLORS.textDim}08`,
                  borderRadius: 12,
                  border: `1px solid ${COLORS.textDim}12`,
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Chart header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLORS.textMuted,
                    }}
                  >
                    Engagement Over Time
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      gap: 12,
                    }}
                  >
                    {['7D', '30D', '90D'].map((label, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 10,
                          fontWeight: i === 1 ? 700 : 400,
                          color: i === 1 ? COLORS.accent : COLORS.textDim,
                          letterSpacing: 0.5,
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bars container */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 8,
                    paddingBottom: 8,
                    position: 'relative',
                  }}
                >
                  {BAR_HEIGHTS.map((h, i) => {
                    // Stagger each bar slightly
                    const barDelay = i * 3;
                    const barProgress = interpolate(
                      frame,
                      [85 + barDelay, 130 + barDelay],
                      [0, 1],
                      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
                    );

                    const barSpring = spring({
                      frame: frame - (85 + barDelay),
                      fps,
                      config: { damping: 12, stiffness: 90, mass: 0.5 },
                    });

                    const barHeight = h * barSpring * 100;

                    // Alternate accent colors
                    const barColor =
                      i % 3 === 0
                        ? COLORS.accentPurple
                        : COLORS.accent;

                    // Enhanced glow intensity at bar top – pulses more prominently
                    const glowIntensity =
                      barProgress >= 1 && frame > 140
                        ? interpolate(
                            Math.sin((frame - 140) * 0.06 + i * 0.5),
                            [-1, 1],
                            [0.5, 1.0],
                          )
                        : barProgress >= 1
                          ? 0.6
                          : 0;

                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          height: '100%',
                        }}
                      >
                        {/* Enhanced glow cap at top of bar */}
                        {barHeight > 2 && (
                          <div
                            style={{
                              width: '180%',
                              height: 10,
                              borderRadius: 5,
                              background: `radial-gradient(ellipse at center, ${barColor}${Math.round(glowIntensity * 99).toString().padStart(2, '0')}, transparent)`,
                              marginBottom: -5,
                              zIndex: 2,
                              pointerEvents: 'none',
                              filter: `blur(${glowIntensity > 0.5 ? 2 : 0}px)`,
                            }}
                          />
                        )}
                        <div
                          style={{
                            width: '100%',
                            height: `${barHeight}%`,
                            borderRadius: 4,
                            background: `linear-gradient(180deg, ${barColor}, ${barColor}60 40%, ${barColor}20)`,
                            minHeight: barProgress > 0 ? 2 : 0,
                            position: 'relative',
                            boxShadow: barHeight > 2 ? `0 0 12px ${barColor}30, inset 0 1px 0 rgba(255,255,255,0.1)` : 'none',
                          }}
                        />
                      </div>
                    );
                  })}

                  {/* ── Sparkline overlay connecting bar tops ── */}
                  <svg
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      zIndex: 3,
                    }}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="sparklineGrad" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.25} />
                        <stop offset="50%" stopColor={COLORS.accentPurple} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0.25} />
                      </linearGradient>
                    </defs>
                    <polyline
                      points={barSprings
                        .map((val, i) => {
                          const x = ((i + 0.5) / BAR_HEIGHTS.length) * 100;
                          const y = 100 - val * 100;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="url(#sparklineGrad)"
                      strokeWidth="0.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* X-axis line */}
                <div
                  style={{
                    height: 1,
                    backgroundColor: `${COLORS.textDim}20`,
                    borderRadius: 1,
                    flexShrink: 0,
                  }}
                />
              </div>

              {/* ── AI Insights Panel ── */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: `${COLORS.textDim}08`,
                  borderRadius: 12,
                  border: `1px solid ${COLORS.accentPurple}15`,
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* Insights header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    opacity: insightsHeaderOpacity,
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  {/* AI icon */}
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentPurple})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: '#fff',
                      }}
                    >
                      AI
                    </span>

                    {/* ── Pulsing notification badge ── */}
                    <div
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -10,
                        opacity: badgeOpacity,
                        transform: `scale(${badgePulse})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Badge glow ring */}
                      <div
                        style={{
                          position: 'absolute',
                          width: 24,
                          height: 16,
                          borderRadius: 8,
                          backgroundColor: `${COLORS.accent}`,
                          opacity: badgeGlowOpacity,
                          filter: 'blur(4px)',
                          pointerEvents: 'none',
                        }}
                      />
                      {/* Badge body */}
                      <div
                        style={{
                          position: 'relative',
                          minWidth: 20,
                          height: 14,
                          borderRadius: 7,
                          backgroundColor: COLORS.accent,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingLeft: 4,
                          paddingRight: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 8,
                            fontWeight: 800,
                            color: '#000',
                            lineHeight: 1,
                            letterSpacing: 0.3,
                          }}
                        >
                          3
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLORS.textMuted,
                    }}
                  >
                    AI Insights
                  </span>
                  {/* Pulsing dot */}
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: COLORS.accent,
                      opacity:
                        frame > 130
                          ? interpolate(
                              Math.sin((frame - 130) * 0.08),
                              [-1, 1],
                              [0.3, 1],
                            )
                          : 0,
                      marginLeft: 4,
                    }}
                  />
                </div>

                {/* Insight lines */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    flex: 1,
                  }}
                >
                  {INSIGHTS.map((text, i) => {
                    const insightY = interpolate(
                      insightOpacities[i]!,
                      [0, 1],
                      [8, 0],
                    );

                    // First insight uses typing effect
                    if (i === 0) {
                      return (
                        <div
                          key={i}
                          style={{
                            opacity: insightOpacities[i]!,
                            transform: `translateY(${insightY}px)`,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 8,
                          }}
                        >
                          {/* Bullet dot */}
                          <div
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: '50%',
                              backgroundColor: COLORS.accent,
                              marginTop: 5,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 400,
                              color: COLORS.textMuted,
                              lineHeight: 1.4,
                            }}
                          >
                            {typedText}
                            <span
                              style={{
                                opacity: cursorVisible,
                                color: COLORS.accent,
                                fontWeight: 300,
                              }}
                            >
                              |
                            </span>
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={i}
                        style={{
                          opacity: insightOpacities[i]!,
                          transform: `translateY(${insightY}px)`,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 8,
                        }}
                      >
                        {/* Bullet dot */}
                        <div
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            backgroundColor:
                              i === 2 ? '#f87171' : COLORS.accent,
                            marginTop: 5,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 400,
                            color: COLORS.textMuted,
                            lineHeight: 1.4,
                          }}
                        >
                          {text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Insight confidence bar */}
                <div
                  style={{
                    opacity: insightOpacities[2]!,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 500,
                      color: COLORS.textDim,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    Confidence
                  </span>
                  <div
                    style={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: `${COLORS.textDim}20`,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${interpolate(frame, [160, 200], [0, 94], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%`,
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentPurple})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Reflection / shadow below browser chrome ── */}
      <div
        style={{
          opacity: chromeOpacity * reflectionOpacity,
          transform: `translateY(${chromeY}px) scaleY(-1)`,
          width: dashW * 0.92,
          height: dashH * 0.12,
          borderRadius: 16,
          overflow: 'hidden',
          background: `linear-gradient(180deg, ${COLORS.backgroundLight}40, transparent)`,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)',
          filter: 'blur(6px)',
          pointerEvents: 'none',
          marginTop: 2,
          position: 'relative',
          zIndex: 0,
        }}
      />

      {/* ── Tagline Below Dashboard ── */}
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          marginTop: 36,
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 300,
            color: COLORS.textMuted,
            letterSpacing: 5,
            textTransform: 'uppercase',
          }}
        >
          Actionable insights from every touchpoint
        </span>
      </div>

      {/* ── Bottom accent line ── */}
      <div
        style={{
          marginTop: 20,
          width: interpolate(
            spring({
              frame: frame - 70,
              fps,
              config: { damping: 22, stiffness: 40, mass: 0.8 },
            }),
            [0, 1],
            [0, 200],
          ),
          height: 2,
          background: `linear-gradient(90deg, transparent, ${COLORS.accent}, ${COLORS.accentPurple}, transparent)`,
          opacity: interpolate(frame, [70, 100], [0, 0.6], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          borderRadius: 1,
        }}
      />
    </div>
  );
}

export { DashboardScene };
