import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, random } from 'remotion';
import { noise2D } from '@remotion/noise';

const COLORS = {
  background: '#0a0a0f',
  backgroundLight: '#12121a',
  accent: '#00d4ff',
  accentPurple: '#7c3aed',
  text: '#ffffff',
  textMuted: '#94a3b8',
};

const FONTS = {
  heading: 'Inter, system-ui, sans-serif',
  code: 'JetBrains Mono, monospace',
};

// --- Floating ambient particles (deterministic via Remotion random) ---
interface FloatingParticle {
  startX: number;
  startY: number;
  driftX: number;
  driftY: number;
  size: number;
  opacity: number;
  speed: number;
  hue: number; // 0 = cyan, 1 = purple
}

const FLOATING_PARTICLE_COUNT = 18;
const floatingParticles: FloatingParticle[] = Array.from(
  { length: FLOATING_PARTICLE_COUNT },
  (_, i) => ({
    startX: random(`feat-px-${i}`) * 1920,
    startY: random(`feat-py-${i}`) * 1080,
    driftX: (random(`feat-dx-${i}`) - 0.5) * 100,
    driftY: (random(`feat-dy-${i}`) - 0.5) * 70,
    size: 2 + random(`feat-sz-${i}`) * 2,
    opacity: 0.06 + random(`feat-op-${i}`) * 0.14,
    speed: 0.3 + random(`feat-sp-${i}`) * 0.6,
    hue: random(`feat-hu-${i}`),
  }),
);

// --- Sub-components ---

const CodeSnippetVisualization: React.FC<{
  opacity: number;
  frame: number;
  fps: number;
}> = ({ opacity, frame, fps }) => {
  const lines = [
    { indent: 0, text: '// Initialize CROW SDK', color: COLORS.textMuted },
    { indent: 0, text: "import { crow } from '@crow/sdk';", color: '#c084fc' },
    { indent: 0, text: '', color: 'transparent' },
    { indent: 0, text: "crow.init({ appId: 'your-app' });", color: COLORS.accent },
    { indent: 0, text: '', color: 'transparent' },
    { indent: 0, text: "crow.track('pageView', {", color: COLORS.text },
    { indent: 1, text: "url: window.location.href,", color: '#fbbf24' },
    { indent: 1, text: "referrer: document.referrer", color: '#fbbf24' },
    { indent: 0, text: '});', color: COLORS.text },
    { indent: 0, text: '', color: 'transparent' },
    { indent: 0, text: "crow.track('click', {", color: COLORS.text },
    { indent: 1, text: "element: 'buy-now-btn',", color: '#fbbf24' },
    { indent: 1, text: "product: 'SKU-4821'", color: '#fbbf24' },
    { indent: 0, text: '});', color: COLORS.text },
  ];

  // Line-by-line reveal: 3 frames stagger per line
  const FRAMES_PER_LINE = 3;
  const visibleLineCount = Math.min(
    lines.length,
    Math.floor(frame / FRAMES_PER_LINE) + 1,
  );

  // Blinking cursor: toggles every 15 frames
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  // The cursor sits on the line currently being "typed"
  const cursorLineIndex = Math.min(visibleLineCount - 1, lines.length - 1);

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #111119 0%, #0d0d14 40%, #0a0a12 100%)',
        borderRadius: 12,
        padding: '24px 28px',
        border: '1px solid rgba(0, 212, 255, 0.15)',
        fontFamily: FONTS.code,
        fontSize: 14,
        lineHeight: 1.7,
        opacity,
        width: '100%',
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
        position: 'relative' as const,
        overflow: 'hidden' as const,
      }}
    >
      {/* Top glow line (screen reflection) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.25), rgba(124, 58, 237, 0.2), transparent)',
          borderRadius: 1,
        }}
      />

      {/* Window dots */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 16 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#ff5f57',
            boxShadow: '0 0 6px rgba(255, 95, 87, 0.3)',
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#febc2e',
            boxShadow: '0 0 6px rgba(254, 188, 46, 0.3)',
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#28c840',
            boxShadow: '0 0 6px rgba(40, 200, 64, 0.3)',
          }}
        />
      </div>
      {lines.map((line, i) => {
        if (i >= visibleLineCount) return null;

        // Each line fades in over a few frames after its reveal frame
        const lineRevealFrame = i * FRAMES_PER_LINE;
        const lineOpacity = interpolate(
          frame,
          [lineRevealFrame, lineRevealFrame + 4],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        return (
          <div
            key={i}
            style={{
              paddingLeft: line.indent * 20,
              color: line.color,
              minHeight: 20,
              opacity: lineOpacity,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {line.text}
            {/* Blinking cursor on the current typing line */}
            {i === cursorLineIndex && visibleLineCount <= lines.length && (
              <span
                style={{
                  display: 'inline-block',
                  width: 2,
                  height: 16,
                  backgroundColor: COLORS.accent,
                  marginLeft: 2,
                  opacity: cursorVisible ? 1 : 0,
                  boxShadow: cursorVisible
                    ? `0 0 6px ${COLORS.accent}`
                    : 'none',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Helper to parse engagement strings like "2.4K", "847", "5.1K" into numeric values
const parseEngagement = (str: string): number => {
  const cleaned = str.replace(/,/g, '');
  if (cleaned.endsWith('K')) {
    return parseFloat(cleaned.replace('K', '')) * 1000;
  }
  return parseFloat(cleaned);
};

// Helper to format back to the same style
const formatEngagement = (value: number, template: string): string => {
  if (template.endsWith('K')) {
    const decimal = template.includes('.') ? 1 : 0;
    return (value / 1000).toFixed(decimal) + 'K';
  }
  return Math.round(value).toString();
};

const SocialIntelligenceVisualization: React.FC<{
  opacity: number;
  frame: number;
  fps: number;
}> = ({ opacity, frame, fps }) => {
  const posts = [
    {
      platform: 'Twitter / X',
      handle: '@techreviewer',
      text: '"This product is game-changing! Best purchase of 2025."',
      sentiment: 'Positive',
      sentimentColor: '#22c55e',
      engagement: '2.4K',
    },
    {
      platform: 'Reddit',
      handle: 'r/technology',
      text: '"Compared 5 alternatives, this one wins hands down."',
      sentiment: 'Positive',
      sentimentColor: '#22c55e',
      engagement: '847',
    },
    {
      platform: 'Instagram',
      handle: '@lifestyleblog',
      text: '"Aesthetics are on point but shipping was slow."',
      sentiment: 'Mixed',
      sentimentColor: '#fbbf24',
      engagement: '5.1K',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        opacity,
        width: '100%',
      }}
    >
      {posts.map((post, i) => {
        const cardDelay = i * 8;
        const cardProgress = spring({
          frame: frame - cardDelay,
          fps,
          config: { damping: 18, stiffness: 120 },
        });

        // Animated engagement number counting up
        const engagementTarget = parseEngagement(post.engagement);
        const countUpDuration = 30; // frames to count up
        const countProgress = interpolate(
          frame - cardDelay - 5,
          [0, countUpDuration],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );
        const currentEngagement = engagementTarget * countProgress;
        const displayEngagement = formatEngagement(
          currentEngagement,
          post.engagement,
        );

        // Entry glow: bright on entry, fades to subtle
        const entryGlowOpacity = interpolate(
          cardProgress,
          [0, 0.5, 1],
          [0, 0.4, 0.1],
          { extrapolateRight: 'clamp' },
        );

        return (
          <div
            key={i}
            style={{
              backgroundColor: '#0d0d14',
              borderRadius: 10,
              padding: '16px 20px',
              border: '1px solid rgba(124, 58, 237, 0.15)',
              opacity: cardProgress,
              transform: `translateX(${interpolate(cardProgress, [0, 1], [30, 0])}px)`,
              boxShadow: `0 4px 16px rgba(0, 0, 0, 0.3), 0 0 ${20 * entryGlowOpacity}px rgba(124, 58, 237, ${entryGlowOpacity})`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    fontFamily: FONTS.heading,
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.accentPurple,
                    textTransform: 'uppercase' as const,
                    letterSpacing: 1,
                  }}
                >
                  {post.platform}
                </span>
                <span
                  style={{
                    fontFamily: FONTS.heading,
                    fontSize: 12,
                    color: COLORS.textMuted,
                  }}
                >
                  {post.handle}
                </span>
              </div>
              <span
                style={{
                  fontFamily: FONTS.code,
                  fontSize: 11,
                  color: post.sentimentColor,
                  backgroundColor: `${post.sentimentColor}15`,
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontWeight: 600,
                }}
              >
                {post.sentiment}
              </span>
            </div>
            <div
              style={{
                fontFamily: FONTS.heading,
                fontSize: 13,
                color: COLORS.text,
                lineHeight: 1.5,
                opacity: 0.85,
              }}
            >
              {post.text}
            </div>
            <div
              style={{
                fontFamily: FONTS.code,
                fontSize: 11,
                color: COLORS.textMuted,
                marginTop: 8,
              }}
            >
              Engagement:{' '}
              <span style={{ color: COLORS.accent, fontWeight: 600 }}>
                {displayEngagement}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CCTVVisualization: React.FC<{ opacity: number; frame: number; fps: number }> = ({
  opacity,
  frame,
  fps,
}) => {
  const pulse = Math.sin(frame * 0.1) * 0.3 + 0.7;

  const heatmapDots = [
    { x: 80, y: 60, intensity: 0.9, radius: 28 },
    { x: 200, y: 100, intensity: 0.7, radius: 22 },
    { x: 150, y: 160, intensity: 0.5, radius: 18 },
    { x: 280, y: 80, intensity: 0.8, radius: 25 },
    { x: 320, y: 150, intensity: 0.6, radius: 20 },
    { x: 120, y: 130, intensity: 0.4, radius: 16 },
  ];

  // Simulated tracking boxes
  const trackingBoxes = [
    { x: 60, y: 50, w: 40, h: 60 },
    { x: 180, y: 70, w: 35, h: 55 },
    { x: 270, y: 60, w: 38, h: 58 },
  ];

  return (
    <div style={{ opacity, width: '100%' }}>
      <div
        style={{
          backgroundColor: '#0d0d14',
          borderRadius: 12,
          padding: 20,
          border: '1px solid rgba(0, 212, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Camera header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                opacity: pulse,
                boxShadow: '0 0 6px rgba(239, 68, 68, 0.5)',
              }}
            />
            <span
              style={{
                fontFamily: FONTS.code,
                fontSize: 11,
                color: COLORS.textMuted,
                textTransform: 'uppercase' as const,
                letterSpacing: 1.5,
              }}
            >
              CAM-01 LIVE
            </span>
          </div>
          <span style={{ fontFamily: FONTS.code, fontSize: 11, color: COLORS.textMuted }}>
            STORE ENTRANCE
          </span>
        </div>

        {/* Camera viewport */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 200,
            backgroundColor: '#08080d',
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((pct) => (
            <React.Fragment key={`grid-${pct}`}>
              <div
                style={{
                  position: 'absolute',
                  left: `${pct * 100}%`,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: `${pct * 100}%`,
                  left: 0,
                  right: 0,
                  height: 1,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                }}
              />
            </React.Fragment>
          ))}

          {/* Heatmap blobs */}
          {heatmapDots.map((dot, i) => {
            const drift = Math.sin(frame * 0.04 + i * 2) * 5;
            return (
              <div
                key={`heat-${i}`}
                style={{
                  position: 'absolute',
                  left: dot.x + drift,
                  top: dot.y + drift * 0.5,
                  width: dot.radius * 2,
                  height: dot.radius * 2,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, rgba(239, 68, 68, ${dot.intensity * 0.35}) 0%, rgba(239, 68, 68, 0) 70%)`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}

          {/* Tracking boxes */}
          {trackingBoxes.map((box, i) => {
            const moveX = Math.sin(frame * 0.03 + i * 1.5) * 12;
            const moveY = Math.cos(frame * 0.025 + i) * 6;
            return (
              <div
                key={`track-${i}`}
                style={{
                  position: 'absolute',
                  left: box.x + moveX,
                  top: box.y + moveY,
                  width: box.w,
                  height: box.h,
                  border: `1.5px solid ${COLORS.accent}`,
                  borderRadius: 3,
                  opacity: 0.7,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -16,
                    left: 0,
                    fontFamily: FONTS.code,
                    fontSize: 9,
                    color: COLORS.accent,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ID-{String(i + 1).padStart(3, '0')}
                </div>
              </div>
            );
          })}

          {/* Scan line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: 'rgba(0, 212, 255, 0.15)',
              transform: `translateY(${(frame * 1.5) % 200}px)`,
            }}
          />
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 14,
            fontFamily: FONTS.code,
            fontSize: 11,
          }}
        >
          {[
            { label: 'VISITORS', value: '47' },
            { label: 'DWELL TIME', value: '3m 22s' },
            { label: 'HOT ZONES', value: '3' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' as const }}>
              <div style={{ color: COLORS.textMuted, marginBottom: 2, letterSpacing: 1 }}>
                {stat.label}
              </div>
              <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 14 }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Feature card data ---

interface FeatureCard {
  phase: string;
  title: string;
  accentColor: string;
  description: string;
  bullets: string[];
  visualization: 'code' | 'social' | 'cctv';
}

const FEATURES: FeatureCard[] = [
  {
    phase: 'Phase 1',
    title: 'Web Intelligence',
    accentColor: COLORS.accent,
    description:
      'A lightweight JavaScript SDK that integrates with any platform in minutes. Capture every meaningful interaction automatically.',
    bullets: [
      'Page views & navigation patterns',
      'Click tracking & form submissions',
      'Product views & cart events',
      'Custom event tracking',
    ],
    visualization: 'code',
  },
  {
    phase: 'Phase 2',
    title: 'Social Intelligence',
    accentColor: COLORS.accentPurple,
    description:
      'AI-powered web search and social media analysis surfaces what your customers are really saying about your brand.',
    bullets: [
      'Real-time sentiment analysis',
      'Brand mention monitoring',
      'Competitor benchmarking',
      'Trend detection & alerts',
    ],
    visualization: 'social',
  },
  {
    phase: 'Phase 3',
    title: 'Physical Intelligence',
    accentColor: COLORS.accent,
    description:
      'Transform existing CCTV infrastructure into a powerful analytics engine with real-time AI video analysis.',
    bullets: [
      'Customer movement heatmaps',
      'Dwell time & zone analytics',
      'Queue detection & wait times',
      'Footfall counting & demographics',
    ],
    visualization: 'cctv',
  },
];

// --- Card ranges (frame windows) ---

const CARD_RANGES: Array<{ start: number; end: number }> = [
  { start: 30, end: 180 },
  { start: 180, end: 330 },
  { start: 330, end: 480 },
];

// --- Ambient glow orb data ---
interface AmbientOrb {
  startX: number;
  startY: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
}

const AMBIENT_ORBS: AmbientOrb[] = [
  {
    startX: 300,
    startY: 400,
    size: 400,
    color: 'rgba(0, 212, 255, 0.03)',
    speedX: 0.004,
    speedY: 0.003,
  },
  {
    startX: 1400,
    startY: 700,
    size: 500,
    color: 'rgba(124, 58, 237, 0.025)',
    speedX: 0.003,
    speedY: 0.005,
  },
];

// --- Main Scene ---

const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Heading animation ---
  const headingProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const headingOpacity = interpolate(headingProgress, [0, 1], [0, 1]);
  const headingY = interpolate(headingProgress, [0, 1], [-30, 0]);

  // --- Subtitle animation ---
  const subtitleProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 20, stiffness: 80 },
  });
  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1]);

  // --- Render the correct card based on frame ---
  const getActiveCardIndex = (): number => {
    for (let i = CARD_RANGES.length - 1; i >= 0; i--) {
      if (frame >= CARD_RANGES[i]!.start) return i;
    }
    return 0;
  };

  const activeIndex = getActiveCardIndex();

  const renderCard = (index: number) => {
    const range = CARD_RANGES[index]!;
    const feature = FEATURES[index]!;
    const localFrame = frame - range.start;

    // Entry animation with slight overshoot for bounce feel
    const entrySpring = spring({
      frame: localFrame,
      fps,
      config: { damping: 12, stiffness: 100, mass: 0.9 },
    });

    const cardOpacity = interpolate(entrySpring, [0, 1], [0, 1]);
    const cardX = interpolate(entrySpring, [0, 1], [120, 0]);

    // Scale bounce on entry (slight overshoot, then settle)
    const scaleSpring = spring({
      frame: localFrame,
      fps,
      config: { damping: 10, stiffness: 150, mass: 0.7 },
    });
    const cardScale = interpolate(scaleSpring, [0, 1], [0.92, 1]);

    // Entry glow intensity (bright on entry, fades to subtle ambient)
    const entryGlowIntensity = interpolate(
      localFrame,
      [0, 10, 40],
      [0, 0.8, 0.2],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    );

    // Exit animation (fade out near the end of the range)
    const exitStart = range.end - range.start - 20;
    const exitOpacity =
      localFrame > exitStart
        ? interpolate(localFrame, [exitStart, exitStart + 20], [1, 0], {
            extrapolateRight: 'clamp',
            extrapolateLeft: 'clamp',
          })
        : 1;

    const combinedOpacity = cardOpacity * exitOpacity;
    const exitX =
      localFrame > exitStart
        ? interpolate(localFrame, [exitStart, exitStart + 20], [0, -60], {
            extrapolateRight: 'clamp',
            extrapolateLeft: 'clamp',
          })
        : 0;
    const exitScale =
      localFrame > exitStart
        ? interpolate(localFrame, [exitStart, exitStart + 20], [1, 0.95], {
            extrapolateRight: 'clamp',
            extrapolateLeft: 'clamp',
          })
        : 1;

    // Staggered bullet animations
    const renderBullets = () =>
      feature.bullets.map((bullet, i) => {
        const bulletProgress = spring({
          frame: localFrame - 15 - i * 6,
          fps,
          config: { damping: 18, stiffness: 100 },
        });

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
              opacity: bulletProgress,
              transform: `translateX(${interpolate(bulletProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: feature.accentColor,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: FONTS.heading,
                fontSize: 15,
                color: COLORS.textMuted,
                lineHeight: 1.5,
              }}
            >
              {bullet}
            </span>
          </div>
        );
      });

    // Visualization component
    const renderVisualization = () => {
      const vizProgress = spring({
        frame: localFrame - 5,
        fps,
        config: { damping: 18, stiffness: 100 },
      });

      switch (feature.visualization) {
        case 'code':
          return (
            <CodeSnippetVisualization
              opacity={vizProgress}
              frame={localFrame}
              fps={fps}
            />
          );
        case 'social':
          return (
            <SocialIntelligenceVisualization opacity={vizProgress} frame={localFrame} fps={fps} />
          );
        case 'cctv':
          return <CCTVVisualization opacity={vizProgress} frame={localFrame} fps={fps} />;
        default:
          return null;
      }
    };

    // Accent border: for phase 3, use a gradient-style approach with two colors
    const borderStyle: React.CSSProperties =
      index === 2
        ? {
            borderLeft: 'none',
            borderImage: `linear-gradient(to bottom, ${COLORS.accent}, ${COLORS.accentPurple}) 1`,
            borderLeftWidth: 4,
            borderLeftStyle: 'solid',
          }
        : {
            borderLeft: `4px solid ${feature.accentColor}`,
          };

    const glowColor =
      feature.accentColor === COLORS.accent
        ? 'rgba(0, 212, 255,'
        : 'rgba(124, 58, 237,';

    return (
      <div
        style={{
          opacity: combinedOpacity,
          transform: `translateX(${cardX + exitX}px) scale(${cardScale * exitScale})`,
          display: 'flex',
          gap: 48,
          alignItems: 'flex-start',
          backgroundColor: 'rgba(18, 18, 26, 0.55)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 16,
          padding: '36px 40px',
          ...borderStyle,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          boxShadow: `0 12px 48px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.03), 0 0 ${40 * entryGlowIntensity}px ${glowColor} ${entryGlowIntensity * 0.6}), 0 0 ${80 * entryGlowIntensity}px ${glowColor} ${entryGlowIntensity * 0.2})`,
          maxWidth: 960,
          width: '100%',
        }}
      >
        {/* Left side: visualization */}
        <div style={{ flex: '0 0 400px', minWidth: 0 }}>{renderVisualization()}</div>

        {/* Right side: text content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Phase label */}
          <div
            style={{
              fontFamily: FONTS.code,
              fontSize: 12,
              fontWeight: 700,
              color: feature.accentColor,
              textTransform: 'uppercase',
              letterSpacing: 2.5,
              marginBottom: 8,
            }}
          >
            {feature.phase}
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: FONTS.heading,
              fontSize: 28,
              fontWeight: 800,
              color: COLORS.text,
              margin: '0 0 16px 0',
              lineHeight: 1.2,
            }}
          >
            {feature.title}
          </h2>

          {/* Description */}
          <p
            style={{
              fontFamily: FONTS.heading,
              fontSize: 15,
              color: COLORS.textMuted,
              lineHeight: 1.7,
              margin: '0 0 24px 0',
            }}
          >
            {feature.description}
          </p>

          {/* Bullets */}
          <div>{renderBullets()}</div>
        </div>
      </div>
    );
  };

  // --- Progress Indicator ---
  // Pulse effect for active dot
  const progressPulse = 0.6 + 0.4 * Math.sin(frame * 0.12);

  const renderProgressIndicator = () => {
    const activeFeature = FEATURES[activeIndex]!;
    const activeColor = activeFeature.accentColor;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          position: 'absolute',
          bottom: 48,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {FEATURES.map((feat, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;

          const dotSpring = spring({
            frame: frame - CARD_RANGES[i]!.start,
            fps,
            config: { damping: 14, stiffness: 120 },
          });

          const dotScale = isActive
            ? interpolate(dotSpring, [0, 1], [0.8, 1], {
                extrapolateRight: 'clamp',
              })
            : 1;

          // Width animated via spring instead of CSS transition
          const widthSpring = spring({
            frame: isActive ? frame - CARD_RANGES[i]!.start : 0,
            fps,
            config: { damping: 16, stiffness: 100 },
          });
          const dotWidth = isActive
            ? interpolate(widthSpring, [0, 1], [14, 36])
            : 14;

          // Animated ring scale for active dot
          const ringScale = isActive
            ? 1 + 0.2 * Math.sin(frame * 0.1)
            : 0;
          const ringOpacity = isActive
            ? 0.3 + 0.2 * Math.sin(frame * 0.1)
            : 0;

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* Dot container with ring */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Animated ring around active dot */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      width: dotWidth + 12,
                      height: 14 + 12,
                      borderRadius: (14 + 12) / 2,
                      border: `1.5px solid ${activeColor}`,
                      opacity: ringOpacity,
                      transform: `scale(${ringScale})`,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Dot */}
                <div
                  style={{
                    width: dotWidth,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor:
                      isActive || isPast
                        ? feat.accentColor
                        : 'rgba(255,255,255,0.12)',
                    transform: `scale(${dotScale})`,
                    boxShadow: isActive
                      ? `0 0 ${10 + 12 * progressPulse}px ${feat.accentColor}${Math.round(50 + 40 * progressPulse).toString(16)}, 0 0 ${20 + 16 * progressPulse}px ${feat.accentColor}30`
                      : isPast
                        ? `0 0 8px ${feat.accentColor}25`
                        : 'none',
                  }}
                />
              </div>

              {/* Glowing connector line (except after last) */}
              {i < FEATURES.length - 1 && (
                <div
                  style={{
                    width: 32,
                    height: 2,
                    marginLeft: 6,
                    marginRight: 6,
                    borderRadius: 1,
                    background: isPast
                      ? `linear-gradient(90deg, ${FEATURES[i]!.accentColor}40, ${FEATURES[i + 1]!.accentColor}40)`
                      : i === activeIndex
                        ? `linear-gradient(90deg, ${activeColor}30, rgba(255,255,255,0.08))`
                        : 'rgba(255,255,255,0.06)',
                    boxShadow: isPast
                      ? `0 0 4px ${FEATURES[i]!.accentColor}20`
                      : 'none',
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Step label */}
        <div
          style={{
            fontFamily: FONTS.code,
            fontSize: 12,
            color: COLORS.textMuted,
            marginLeft: 16,
            letterSpacing: 1,
          }}
        >
          {activeIndex + 1} / {FEATURES.length}
        </div>
      </div>
    );
  };

  // --- Aurora gradient blob positions ---
  const cyanBlobX = 960 + Math.sin(frame * 0.008) * 200;
  const cyanBlobY = 250 + Math.cos(frame * 0.006) * 100;
  const purpleBlobX = 1300 + Math.sin(frame * 0.007 + 2) * 180;
  const purpleBlobY = 750 + Math.cos(frame * 0.009 + 1) * 120;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Aurora gradient mesh background - Cyan blob */}
      <div
        style={{
          position: 'absolute',
          left: cyanBlobX - 400,
          top: cyanBlobY - 350,
          width: 800,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Aurora gradient mesh background - Purple blob */}
      <div
        style={{
          position: 'absolute',
          left: purpleBlobX - 450,
          top: purpleBlobY - 350,
          width: 900,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.05) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient glow orbs (far background) */}
      {AMBIENT_ORBS.map((orb, i) => {
        const orbDriftX = orb.startX + Math.sin(frame * orb.speedX + i * 1.5) * 120;
        const orbDriftY = orb.startY + Math.cos(frame * orb.speedY + i * 2.1) * 80;
        return (
          <div
            key={`ambient-orb-${i}`}
            style={{
              position: 'absolute',
              left: orbDriftX - orb.size / 2,
              top: orbDriftY - orb.size / 2,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: `radial-gradient(circle at center, ${orb.color} 0%, transparent 70%)`,
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Floating ambient particles (noise2D driven) */}
      {floatingParticles.map((p, i) => {
        const px = p.startX + noise2D('feat-px' + i, frame * p.speed * 0.01, i * 0.3) * p.driftX;
        const py = p.startY + noise2D('feat-py' + i, frame * p.speed * 0.008, i * 0.3) * p.driftY;
        const flickerOpacity =
          p.opacity * (0.7 + 0.3 * Math.sin(frame * 0.05 + i * 3));
        const color =
          p.hue < 0.5
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
          marginTop: 64,
          marginBottom: 12,
          textAlign: 'center',
          opacity: headingOpacity,
          transform: `translateY(${headingY}px)`,
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontFamily: FONTS.heading,
            fontSize: 48,
            fontWeight: 800,
            color: COLORS.text,
            margin: 0,
            letterSpacing: -1,
          }}
        >
          How It Works
        </h1>
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          marginBottom: 48,
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontFamily: FONTS.heading,
            fontSize: 18,
            color: COLORS.textMuted,
            margin: 0,
            maxWidth: 520,
            lineHeight: 1.6,
          }}
        >
          Three powerful data collection phases working in unison
        </p>
      </div>

      {/* Feature card area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%',
          padding: '0 48px',
          zIndex: 1,
        }}
      >
        {frame >= CARD_RANGES[0]!.start && renderCard(activeIndex)}
      </div>

      {/* Progress indicator */}
      {frame >= CARD_RANGES[0]!.start && renderProgressIndicator()}

      {/* Film grain overlay */}
      <svg
        width={1920}
        height={1080}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          opacity: 0.04,
          zIndex: 10,
        }}
      >
        <defs>
          <filter
            id="featuresFilmGrain"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
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
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0"
              in="noise"
              result="monoNoise"
            />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter="url(#featuresFilmGrain)"
        />
      </svg>
    </div>
  );
};

export default FeaturesScene;
