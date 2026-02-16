import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  Img,
  Audio,
  AbsoluteFill,
  random,
} from 'remotion';
import { noise2D } from '@remotion/noise';

// ── Config ────────────────────────────────────────────────────────────────────

const COLORS = {
  background: '#080510',
  accent: '#f43f5e',        // rose-red
  accentPink: '#ec4899',    // pink
  accentFuchsia: '#d946ef', // fuchsia
  accentPurple: '#a855f7',  // violet
  text: '#ffffff',
  textMuted: '#d4b8c8',     // soft pinkish gray
};

const FONT = 'Inter, system-ui, sans-serif';
const MONO = 'JetBrains Mono, monospace';
const W = 1080;
const H = 1920;

// 20 seconds at 30fps = 600 frames
// Timing plan:
//   0–100:    Logo splash           → morph out (85–108)
//   96–190:   "Our 4 Layers" title  → fly out   (175–198)
//   185–290:  Collection layer      → morph out (275–298)
//   285–390:  Interpretation layer  → fly out   (375–398)
//   385–490:  Insight layer         → morph out (475–498)
//   485–655:  Integration layer     → fly out   (640–663)
//   645–690:  Closing

// ── Starry Sky Background ─────────────────────────────────────────────────────

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

const STARS: Star[] = Array.from({ length: 200 }, (_, i) => ({
  x: random(`star-x-${i}`) * W,
  y: random(`star-y-${i}`) * H,
  size: 0.7 + random(`star-sz-${i}`) * 2.3,
  brightness: 0.15 + random(`star-br-${i}`) * 0.85,
  twinkleSpeed: 0.012 + random(`star-ts-${i}`) * 0.05,
  twinklePhase: random(`star-tp-${i}`) * Math.PI * 2,
}));

function StarryBackground() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* Subtle nebula glows */}
      <div
        style={{
          position: 'absolute',
          left: '20%',
          top: '15%',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'rgba(168, 85, 247, 0.022)',
          filter: 'blur(150px)',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '80%',
          top: '70%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'rgba(244, 63, 94, 0.018)',
          filter: 'blur(130px)',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '55%',
          top: '45%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'rgba(236, 72, 153, 0.015)',
          filter: 'blur(110px)',
          transform: 'translate(-50%, -50%)',
        }}
      />
      {/* Stars */}
      {STARS.map((star, i) => {
        const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinklePhase);
        const opacity = star.brightness * (0.55 + twinkle * 0.45);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              background: '#ffffff',
              opacity,
              boxShadow:
                star.size > 2
                  ? `0 0 ${star.size * 3}px rgba(255,255,255,${opacity * 0.35})`
                  : 'none',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

// ── Film Grain ────────────────────────────────────────────────────────────────

function FilmGrain() {
  const frame = useCurrentFrame();
  const grainX = ((frame * 73) % 200) - 100;
  const grainY = ((frame * 47) % 200) - 100;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity: 0.03,
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '150px 150px',
        transform: `translate(${grainX}px, ${grainY}px)`,
      }}
    />
  );
}

// ── Floating Space / Tech Icons ───────────────────────────────────────────────

const SPACE_SYMBOLS = ['✦', '✧', '◆', '⬡', '△', '○', '◇', '★', '⋆', '⊕', '⊹', '+'];

interface FloatingIcon {
  x: number;
  y: number;
  symbol: string;
  size: number;
  baseRot: number;
  floatSpeed: number;
  floatAmp: number;
  floatPhase: number;
  opacity: number;
  color: string;
}

function makeIcons(seed: string, count: number, color: string): FloatingIcon[] {
  return Array.from({ length: count }, (_, i) => ({
    x: 30 + random(`${seed}-ix-${i}`) * (W - 60),
    y: 80 + random(`${seed}-iy-${i}`) * (H - 160),
    symbol: SPACE_SYMBOLS[Math.floor(random(`${seed}-is-${i}`) * SPACE_SYMBOLS.length)],
    size: 14 + random(`${seed}-iz-${i}`) * 20,
    baseRot: random(`${seed}-ir-${i}`) * 360,
    floatSpeed: 0.012 + random(`${seed}-ifs-${i}`) * 0.03,
    floatAmp: 3 + random(`${seed}-ifa-${i}`) * 14,
    floatPhase: random(`${seed}-ifp-${i}`) * Math.PI * 2,
    opacity: 0.07 + random(`${seed}-io-${i}`) * 0.13,
    color,
  }));
}

function FloatingIcons({ icons, localFrame }: { icons: FloatingIcon[]; localFrame: number }) {
  return (
    <>
      {icons.map((ic, i) => {
        const fadeIn = interpolate(localFrame, [2 + i * 2, 14 + i * 2], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const yOff = Math.sin(localFrame * ic.floatSpeed + ic.floatPhase) * ic.floatAmp;
        const rot = ic.baseRot + localFrame * 0.15;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: ic.x,
              top: ic.y + yOff,
              fontSize: ic.size,
              color: ic.color,
              opacity: ic.opacity * fadeIn,
              transform: `rotate(${rot}deg)`,
              pointerEvents: 'none',
              textShadow: `0 0 ${ic.size}px ${ic.color}30`,
            }}
          >
            {ic.symbol}
          </div>
        );
      })}
    </>
  );
}

// Pre-generate icons for each scene
const LOGO_ICONS = makeIcons('logo', 12, COLORS.accent);
const TITLE_ICONS = makeIcons('title', 10, COLORS.accentPink);
const COLLECTION_ICONS = makeIcons('collect', 11, COLORS.accent);
const INTERPRETATION_ICONS = makeIcons('interp', 10, COLORS.accentPink);
const INSIGHT_ICONS = makeIcons('insight', 11, COLORS.accentFuchsia);
const INTEGRATION_ICONS = makeIcons('integr', 10, COLORS.accentPurple);
const CLOSING_ICONS = makeIcons('closing', 12, COLORS.accentPurple);

// ── Section anim with Morph / Fly-Out exit ────────────────────────────────────

type ExitStyle = 'morph' | 'flyOut';

function useSectionAnim(
  enterStart: number,
  exitStart: number,
  exitEnd: number,
  exitStyle: ExitStyle = 'morph',
) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─ Enter: slide up with spring ─
  const enterSpring = spring({
    frame: Math.max(0, frame - enterStart),
    fps,
    config: { damping: 18, stiffness: 100, mass: 0.7 },
    durationInFrames: 30,
  });
  const enterY = interpolate(enterSpring, [0, 1], [H * 0.35, 0]);
  const enterOpacity = interpolate(frame, [enterStart, enterStart + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ─ Exit ─
  const exitProgress = interpolate(frame, [exitStart, exitEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  let exitY = 0;
  let exitScale = 1;
  let exitOpacity = 1;
  let exitBlur = 0;

  if (exitStyle === 'morph') {
    // Morph: smooth scale-down, slight blur, drift up, fade
    exitScale = interpolate(exitProgress, [0, 1], [1, 0.7]);
    exitOpacity = interpolate(exitProgress, [0, 0.3, 1], [1, 0.65, 0]);
    exitY = interpolate(exitProgress, [0, 1], [0, -50]);
    exitBlur = interpolate(exitProgress, [0.25, 1], [0, 8], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else {
    // Fly out: accelerate upward
    const flyEase = exitProgress * exitProgress; // ease-in (accelerates)
    exitY = interpolate(flyEase, [0, 1], [0, -H * 0.55]);
    exitOpacity = interpolate(exitProgress, [0, 0.65, 1], [1, 0.85, 0]);
    exitScale = interpolate(exitProgress, [0, 1], [1, 0.95]);
  }

  const visible = frame >= enterStart && frame <= exitEnd + 5;
  const y = enterY + exitY;
  const opacity = enterOpacity * exitOpacity;

  return { y, opacity, scale: exitScale, blur: exitBlur, visible };
}

// ── Layer Header ──────────────────────────────────────────────────────────────

function LayerHeader({
  number,
  name,
  description,
  color,
  localFrame,
}: {
  number: number;
  name: string;
  description: string;
  color: string;
  localFrame: number;
}) {
  const titleOpacity = interpolate(localFrame, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const descOpacity = interpolate(localFrame, [10, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          width: 64,
          height: 64,
          borderRadius: 18,
          background: `linear-gradient(135deg, ${color}25, ${color}08)`,
          border: `1.5px solid ${color}50`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 20px ${color}20`,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 30,
            fontWeight: 700,
            color,
          }}
        >
          {number}
        </span>
      </div>
      <span
        style={{
          fontFamily: FONT,
          fontSize: 64,
          fontWeight: 800,
          color: COLORS.text,
          letterSpacing: '-0.02em',
          opacity: titleOpacity,
          textShadow: `0 0 30px ${color}25`,
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontSize: 28,
          fontWeight: 400,
          color: COLORS.textMuted,
          opacity: descOpacity,
          textAlign: 'center',
          maxWidth: 800,
        }}
      >
        {description}
      </span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCENES
// ══════════════════════════════════════════════════════════════════════════════

function LogoSplash() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { y, opacity, scale, blur, visible } = useSectionAnim(0, 85, 108, 'morph');

  if (!visible) return null;

  const logoScale = interpolate(
    spring({
      frame,
      fps,
      config: { damping: 12, stiffness: 70, mass: 0.8 },
      durationInFrames: 40,
    }),
    [0, 1],
    [0.5, 1],
  );
  const glowPulse = frame > 30 ? 0.4 + Math.sin((frame - 30) * 0.06) * 0.3 : 0;
  const bloomOpacity = interpolate(frame, [8, 16, 24, 40], [0, 0.7, 0.4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 30,
      }}
    >
      <FloatingIcons icons={LOGO_ICONS} localFrame={frame} />
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 400,
            height: 400,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,255,255,${bloomOpacity}) 0%, rgba(244,63,94,${bloomOpacity * 0.3}) 40%, transparent 70%)`,
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />
        <Img
          src={staticFile('logo.png')}
          style={{
            width: 260,
            height: 260,
            objectFit: 'contain',
            transform: `scale(${logoScale})`,
            filter: `drop-shadow(0 0 ${30 + glowPulse * 30}px ${COLORS.accent}60)`,
          }}
        />
      </div>
      <span
        style={{
          fontFamily: FONT,
          fontSize: 96,
          fontWeight: 800,
          color: COLORS.text,
          letterSpacing: 18,
          textShadow: `0 0 40px ${COLORS.accent}40`,
          opacity: interpolate(frame, [20, 40], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        CROW
      </span>
    </AbsoluteFill>
  );
}

function TitleCard() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { y, opacity, scale, blur, visible } = useSectionAnim(96, 175, 198, 'flyOut');

  if (!visible) return null;

  const textSpring = spring({
    frame: Math.max(0, frame - 100),
    fps,
    config: { damping: 16, stiffness: 100 },
    durationInFrames: 30,
  });
  const textScale = interpolate(textSpring, [0, 1], [0.85, 1]);
  const lineWidth = interpolate(
    spring({
      frame: Math.max(0, frame - 116),
      fps,
      config: { damping: 20, stiffness: 50 },
      durationInFrames: 30,
    }),
    [0, 1],
    [0, 200],
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <FloatingIcons icons={TITLE_ICONS} localFrame={frame - 96} />
      <span
        style={{
          fontFamily: FONT,
          fontSize: 84,
          fontWeight: 800,
          color: COLORS.text,
          letterSpacing: '-0.03em',
          transform: `scale(${textScale})`,
          textShadow: `0 0 30px ${COLORS.accentPink}25`,
        }}
      >
        Our 4 Layers
      </span>
      <div
        style={{
          width: lineWidth,
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, transparent, ${COLORS.accent}, ${COLORS.accentPurple}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
}

function CollectionScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { y, opacity, scale, blur, visible } = useSectionAnim(185, 275, 298, 'morph');

  if (!visible) return null;
  const localFrame = frame - 185;
  const color = COLORS.accent; // rose-red

  const sources = [
    { label: 'CCTV', icon: '📹', startAngle: 220 },
    { label: 'Social', icon: '💬', startAngle: 90 },
    { label: 'Web', icon: '🌐', startAngle: 340 },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <FloatingIcons icons={COLLECTION_ICONS} localFrame={localFrame} />
      <LayerHeader
        number={1}
        name="Collection"
        description="Gathering customer signals across every touchpoint"
        color={color}
        localFrame={localFrame}
      />

      <div
        style={{
          position: 'relative',
          width: 900,
          height: 600,
          marginTop: 50,
        }}
      >
        {/* Center hub */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 130,
            height: 130,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}20, ${color}05)`,
            border: `2px solid ${color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: interpolate(localFrame, [16, 30], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            boxShadow: `0 0 50px ${color}20`,
          }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="24" stroke={color} strokeWidth="1.5" />
            <circle cx="30" cy="30" r="10" fill={color} opacity="0.5" />
            <circle cx="30" cy="30" r="4" fill={color} />
          </svg>
        </div>

        {sources.map((src, i) => {
          const delay = 24 + i * 16;
          const progress = spring({
            frame: Math.max(0, localFrame - delay),
            fps,
            config: { damping: 14, stiffness: 80, mass: 0.6 },
            durationInFrames: 40,
          });
          const angle = (src.startAngle * Math.PI) / 180;
          const radius = interpolate(progress, [0, 1], [400, 320]);
          const cx = 450 + Math.cos(angle) * radius;
          const cy = 300 + Math.sin(angle) * radius;
          const nodeOpacity = interpolate(localFrame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const arrived = progress > 0.9;
          const pulse = arrived
            ? 0.6 + Math.sin((localFrame - delay - 30) * 0.1) * 0.4
            : 0;
          const lineOpacity = interpolate(progress, [0.2, 0.6], [0, 0.3], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <React.Fragment key={src.label}>
              <svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 900,
                  height: 600,
                  pointerEvents: 'none',
                }}
              >
                <line
                  x1={cx}
                  y1={cy}
                  x2={450}
                  y2={300}
                  stroke={color}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity={lineOpacity}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  left: cx,
                  top: cy,
                  transform: 'translate(-50%, -50%)',
                  opacity: nodeOpacity,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 28,
                    background: `${color}10`,
                    border: `1.5px solid ${color}${Math.round((0.3 + pulse * 0.3) * 255)
                      .toString(16)
                      .padStart(2, '0')}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 56,
                    boxShadow: arrived
                      ? `0 0 ${20 + pulse * 20}px ${color}20`
                      : 'none',
                  }}
                >
                  {src.icon}
                </div>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 28,
                    fontWeight: 600,
                    color,
                    letterSpacing: '0.05em',
                  }}
                >
                  {src.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function InterpretationScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { y, opacity, scale, blur, visible } = useSectionAnim(285, 375, 398, 'flyOut');

  if (!visible) return null;
  const localFrame = frame - 285;
  const color = COLORS.accentPink;
  const barCount = 20;

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <FloatingIcons icons={INTERPRETATION_ICONS} localFrame={localFrame} />
      <LayerHeader
        number={2}
        name="Interpretation"
        description="Making sense of every customer interaction"
        color={color}
        localFrame={localFrame}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          height: 280,
          marginTop: 50,
        }}
      >
        {Array.from({ length: barCount }).map((_, i) => {
          const barDelay = 16 + i * 3;
          const barOpacity = interpolate(localFrame, [barDelay, barDelay + 14], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const waveHeight =
            localFrame > barDelay
              ? 50 +
              noise2D('wave' + i, (localFrame - barDelay) * 0.03, i * 0.3) *
              90 +
              40
              : 30;
          // Hue range: pink to fuchsia (330–310 mapped to bar index)
          const hue = interpolate(i, [0, barCount - 1], [330, 295]);

          return (
            <div
              key={i}
              style={{
                width: 18,
                height: Math.max(12, waveHeight),
                borderRadius: 9,
                background: `linear-gradient(180deg, hsl(${hue}, 80%, 65%), hsl(${hue}, 70%, 40%))`,
                opacity: barOpacity * 0.8,
                boxShadow: `0 0 12px hsla(${hue}, 80%, 55%, 0.3)`,
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          marginTop: 30,
          opacity: interpolate(localFrame, [40, 55], [0, 0.6], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          fontFamily: MONO,
          fontSize: 20,
          color,
          letterSpacing: '0.1em',
        }}
      >
        ANALYZING INTERACTIONS
        <span style={{ opacity: Math.sin(localFrame * 0.12) > 0 ? 1 : 0 }}>
          _
        </span>
      </div>
    </AbsoluteFill>
  );
}

function InsightScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { y, opacity, scale, blur, visible } = useSectionAnim(385, 475, 498, 'morph');

  if (!visible) return null;
  const localFrame = frame - 385;
  const color = COLORS.accentFuchsia;

  const nodes = [
    { x: 240, y: 80, label: 'Trend' },
    { x: 660, y: 60, label: 'Pattern' },
    { x: 450, y: 260, label: 'Anomaly' },
    { x: 160, y: 300, label: 'Segment' },
    { x: 720, y: 310, label: 'Signal' },
  ];
  const connections = [
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 3],
    [2, 4],
    [1, 4],
    [0, 3],
  ];

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <FloatingIcons icons={INSIGHT_ICONS} localFrame={localFrame} />
      <LayerHeader
        number={3}
        name="Insight"
        description="Surfacing patterns and actionable intelligence"
        color={color}
        localFrame={localFrame}
      />

      <div
        style={{
          position: 'relative',
          width: 900,
          height: 440,
          marginTop: 30,
        }}
      >
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 900,
            height: 440,
            pointerEvents: 'none',
          }}
        >
          {connections.map(([a, b], i) => {
            const delay = 25 + i * 7;
            const lineOpacity = interpolate(
              localFrame,
              [delay, delay + 16],
              [0, 0.35],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              },
            );
            return (
              <line
                key={`conn-${i}`}
                x1={nodes[a].x + 40}
                y1={nodes[a].y + 40}
                x2={nodes[b].x + 40}
                y2={nodes[b].y + 40}
                stroke={color}
                strokeWidth="1.5"
                strokeDasharray="6 4"
                strokeDashoffset={localFrame * 0.6}
                opacity={lineOpacity}
              />
            );
          })}
        </svg>

        {nodes.map((node, i) => {
          const delay = 16 + i * 10;
          const nodeProgress = spring({
            frame: Math.max(0, localFrame - delay),
            fps,
            config: { damping: 14, stiffness: 120 },
            durationInFrames: 30,
          });
          const nodeOpacity = interpolate(
            localFrame,
            [delay, delay + 10],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            },
          );
          const nodeScale = interpolate(nodeProgress, [0, 1], [0.5, 1]);
          const pulse =
            localFrame > delay + 25
              ? 0.3 + Math.sin((localFrame - delay) * 0.08 + i) * 0.2
              : 0.3;

          return (
            <div
              key={`node-${i}`}
              style={{
                position: 'absolute',
                left: node.x,
                top: node.y,
                opacity: nodeOpacity,
                transform: `scale(${nodeScale})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${color}20, ${color}05)`,
                  border: `1.5px solid ${color}${Math.round((0.4 + pulse * 0.3) * 255)
                    .toString(16)
                    .padStart(2, '0')}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 ${15 + pulse * 20}px ${color}15`,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: color,
                    opacity: 0.7,
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 16,
                  fontWeight: 600,
                  color,
                  letterSpacing: '0.05em',
                  opacity: 0.8,
                }}
              >
                {node.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function IntegrationScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { y, opacity, scale, blur, visible } = useSectionAnim(
    485,
    640,
    663,
    'flyOut',
  );

  if (!visible) return null;
  const localFrame = frame - 485;
  const color = COLORS.accentPurple;

  const steps = [
    { label: 'CRM', icon: '🏢' },
    { label: 'Marketing', icon: '📣' },
    { label: 'Support', icon: '🎧' },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <FloatingIcons icons={INTEGRATION_ICONS} localFrame={localFrame} />
      <LayerHeader
        number={4}
        name="Integration"
        description="Powering your existing workflow seamlessly"
        color={color}
        localFrame={localFrame}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
          marginTop: 50,
          position: 'relative',
        }}
      >
        {/* Rotating dashed ring around hub */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 180,
            height: 180,
            borderRadius: '50%',
            border: `2px dashed ${color}30`,
            opacity: interpolate(localFrame, [15, 30], [0, 0.6], { extrapolateLeft: 'clamp' }),
          }}
        />
        {/* Second counter-rotating ring */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: `1px dashed ${COLORS.accent}20`,
            opacity: interpolate(localFrame, [20, 40], [0, 0.4], { extrapolateLeft: 'clamp' }),
          }}
        />
        {/* Pulsing glow behind hub */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
            opacity: interpolate(localFrame, [10, 25], [0, 0.5], { extrapolateLeft: 'clamp' }) * (0.5 + Math.sin(localFrame * 0.08) * 0.3),
            filter: 'blur(10px)',
          }}
        />
        {/* Expanding ripple rings */}
        {localFrame > 30 && Array.from({ length: 3 }).map((_, rIdx) => {
          const rippleStart = 35 + rIdx * 25;
          const rippleAge = localFrame - rippleStart;
          if (rippleAge < 0 || rippleAge > 40) return null;
          const rippleProgress = rippleAge / 40;
          const rippleSize = 100 + rippleProgress * 80;
          const rippleOpacity = (1 - rippleProgress) * 0.3;
          return (
            <div
              key={`ripple-${rIdx}`}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: rippleSize,
                height: rippleSize,
                borderRadius: '50%',
                border: `1.5px solid ${color}`,
                opacity: rippleOpacity,
              }}
            />
          );
        })}

        {/* CROW hub */}
        <div
          style={{
            opacity: interpolate(localFrame, [10, 22], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${COLORS.accent}20, ${color}20)`,
              border: `3px solid ${color}60`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `
                0 0 40px ${color}30,
                0 0 80px ${color}15,
                inset 0 0 20px ${color}10
              `,
            }}
          >
            <Img
              src={staticFile('logo.png')}
              style={{ width: 46, height: 46, objectFit: 'contain' }}
            />
          </div>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 18,
              fontWeight: 700,
              color,
            }}
          >
            CROW
          </span>
        </div>

        {steps.map((step, i) => {
          const delay = 20 + i * 14;
          const arrowProgress = spring({
            frame: Math.max(0, localFrame - delay),
            fps,
            config: { damping: 16, stiffness: 100 },
            durationInFrames: 28,
          });
          const arrowOpacity = interpolate(
            localFrame,
            [delay, delay + 10],
            [0, 0.6],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            },
          );
          const nodeOpacity = interpolate(
            localFrame,
            [delay + 10, delay + 20],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            },
          );
          const arrowWidth = interpolate(arrowProgress, [0, 1], [0, 50]);

          return (
            <React.Fragment key={step.label}>
              <div
                style={{
                  width: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: arrowOpacity,
                }}
              >
                <svg width="60" height="20" viewBox="0 0 60 20">
                  <line
                    x1="0"
                    y1="10"
                    x2={arrowWidth}
                    y2="10"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <polygon
                    points={`${arrowWidth - 2},5 ${arrowWidth + 6},10 ${arrowWidth - 2},15`}
                    fill={color}
                    opacity={arrowProgress > 0.7 ? 1 : 0}
                  />
                </svg>
              </div>
              <div
                style={{
                  opacity: nodeOpacity,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 95,
                    height: 95,
                    borderRadius: 24,
                    background: `${color}10`,
                    border: `2px solid ${color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 40,
                    boxShadow: `0 0 25px ${color}20`,
                  }}
                >
                  {step.icon}
                </div>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 16,
                    fontWeight: 600,
                    color,
                    letterSpacing: '0.03em',
                  }}
                >
                  {step.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}

        {/* Data flow particles - flowing from CROW to each destination */}
        {localFrame > 40 && (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              overflow: 'visible',
            }}
          >
            <defs>
              <filter id="particleGlow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {[0, 1, 2].map((stepIdx) => {
              const startX = 150;
              const endX = 280 + stepIdx * 130;
              const particleCount = 6;
              return Array.from({ length: particleCount }).map((_, pIdx) => {
                const cycleFrame = (localFrame - 40 - stepIdx * 10) % 60;
                const progress = cycleFrame / 60;
                const x = startX + (endX - startX) * progress;
                const y = 100 + Math.sin(progress * Math.PI * 2 + stepIdx * 1.5) * 20;
                const opacity = progress < 0.1 ? progress * 10 : progress > 0.85 ? (1 - progress) * 6.7 : 1;
                const size = 5 - pIdx * 0.6;
                const isLeading = pIdx === 0;
                return (
                  <React.Fragment key={`particle-${stepIdx}-${pIdx}`}>
                    {/* Glow effect for leading particle */}
                    {isLeading && (
                      <circle
                        cx={x}
                        cy={y}
                        r={Math.max(4, size * 2)}
                        fill={color}
                        opacity={opacity * 0.3}
                        filter="url(#particleGlow)"
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={Math.max(2, size)}
                      fill={isLeading ? COLORS.accent : color}
                      opacity={opacity * (isLeading ? 1 : 0.8)}
                      filter={isLeading ? "url(#particleGlow)" : undefined}
                    />
                  </React.Fragment>
                );
              });
            })}
            {/* Connection lines with gradient */}
            {[0, 1, 2].map((stepIdx) => {
              const startX = 150;
              const endX = 280 + stepIdx * 130;
              const lineOpacity = interpolate(localFrame, [30 + stepIdx * 15, 50 + stepIdx * 15], [0, 0.3], { extrapolateLeft: 'clamp' });
              if (lineOpacity <= 0) return null;
              return (
                <line
                  key={`flow-line-${stepIdx}`}
                  x1={startX}
                  y1={100}
                  x2={endX}
                  y2={100}
                  stroke={`url(#flowGradient${stepIdx})`}
                  strokeWidth="2"
                  strokeDasharray="4 8"
                  opacity={lineOpacity}
                />
              );
            })}
            {[0, 1, 2].map((i) => (
              <defs key={`grad-${i}`}>
                <linearGradient id={`flowGradient${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={COLORS.accent} stopOpacity="0" />
                  <stop offset="50%" stopColor={color} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.3" />
                </linearGradient>
              </defs>
            ))}
          </svg>
        )}
      </div>
    </AbsoluteFill>
  );
}

function ClosingScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterFrame = 645;
  const localFrame = frame - enterFrame;
  if (frame < enterFrame) return null;

  const mainOpacity = interpolate(frame, [enterFrame, enterFrame + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const logoScale = interpolate(
    spring({
      frame: Math.max(0, localFrame),
      fps,
      config: { damping: 14, stiffness: 80 },
      durationInFrames: 30,
    }),
    [0, 1],
    [0.7, 1],
  );
  const glow =
    localFrame > 15 ? 0.5 + Math.sin((localFrame - 15) * 0.08) * 0.3 : 0.3;
  const taglineOpacity = interpolate(localFrame, [14, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lineWidth = interpolate(
    spring({
      frame: Math.max(0, localFrame - 20),
      fps,
      config: { damping: 20, stiffness: 50 },
      durationInFrames: 25,
    }),
    [0, 1],
    [0, 140],
  );

  return (
    <AbsoluteFill
      style={{
        opacity: mainOpacity,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <FloatingIcons icons={CLOSING_ICONS} localFrame={localFrame} />
      <Img
        src={staticFile('logo.png')}
        style={{
          width: 140,
          height: 140,
          objectFit: 'contain',
          transform: `scale(${logoScale})`,
          filter: `drop-shadow(0 0 ${25 + glow * 30}px ${COLORS.accentPink}50)`,
        }}
      />
      <span
        style={{
          fontFamily: FONT,
          fontSize: 64,
          fontWeight: 800,
          color: COLORS.text,
          letterSpacing: 10,
          textShadow: `0 0 30px ${COLORS.accent}30`,
        }}
      >
        CROW
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontSize: 26,
          fontWeight: 300,
          color: COLORS.textMuted,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          opacity: taglineOpacity,
        }}
      >
        Unified Customer Intelligence
      </span>
      <div
        style={{
          width: lineWidth,
          height: 2,
          borderRadius: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.accent}, ${COLORS.accentPurple}, transparent)`,
        }}
      />
      <span
        style={{
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 500,
          color: COLORS.accentPink,
          letterSpacing: '0.1em',
          opacity: interpolate(localFrame, [24, 38], [0, 0.8], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        crowai.dev
      </span>
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ══════════════════════════════════════════════════════════════════════════════

export const CrowLayersReel: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        fontFamily: FONT,
        overflow: 'hidden',
      }}
    >
      <StarryBackground />
      <Audio src={staticFile('audio/bg-music.mp3')} volume={0.5} />

      {/* Scenes — transitions are built into enter/exit animations */}
      <LogoSplash />
      <TitleCard />
      <CollectionScene />
      <InterpretationScene />
      <InsightScene />
      <IntegrationScene />
      <ClosingScene />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.3) 100%)',
          pointerEvents: 'none',
        }}
      />
      <FilmGrain />
    </AbsoluteFill>
  );
};
