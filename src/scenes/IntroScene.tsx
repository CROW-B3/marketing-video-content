import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  Img,
} from 'remotion';

const COLORS = {
  background: '#0a0a0f',
  accent: '#00d4ff',
  accentPurple: '#7c3aed',
  text: '#ffffff',
  textMuted: '#94a3b8',
};

const FONT_FAMILY = 'Inter, system-ui, sans-serif';

// Grid configuration for the particle/dot grid
const GRID_COLS = 24;
const GRID_ROWS = 14;
const DOT_SIZE = 3;

const CROW_LETTERS = 'CROW'.split('');

// Ambient bokeh particles configuration (seeded so it's deterministic)
interface BokehParticle {
  x: number; // horizontal position 0-100 (%)
  baseY: number; // starting vertical position 0-100 (%)
  size: number; // diameter in px
  speed: number; // upward drift speed (lower = slower)
  opacity: number; // max opacity
  hue: number; // colour shift
  phaseOffset: number; // for horizontal wobble
}

const BOKEH_PARTICLES: BokehParticle[] = [
  { x: 12, baseY: 95, size: 18, speed: 0.08, opacity: 0.18, hue: 0, phaseOffset: 0 },
  { x: 78, baseY: 100, size: 14, speed: 0.06, opacity: 0.14, hue: 30, phaseOffset: 1.2 },
  { x: 35, baseY: 110, size: 22, speed: 0.1, opacity: 0.12, hue: -20, phaseOffset: 2.4 },
  { x: 88, baseY: 105, size: 16, speed: 0.07, opacity: 0.16, hue: 15, phaseOffset: 3.6 },
  { x: 55, baseY: 98, size: 20, speed: 0.09, opacity: 0.13, hue: -10, phaseOffset: 4.8 },
  { x: 22, baseY: 108, size: 12, speed: 0.065, opacity: 0.15, hue: 25, phaseOffset: 0.8 },
  { x: 65, baseY: 102, size: 17, speed: 0.075, opacity: 0.11, hue: -15, phaseOffset: 2.0 },
];

export default function IntroScene() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ── Timing (all in frames at 30fps) ──────────────────────────
  // 0-30:   black screen
  // 30-90:  particle grid fades in
  // 60-120: logo fades in + scales
  // 90-160: "CROW" types in letter by letter
  // 140-180: "by B3" fades in
  // 170-210: tagline fades in
  // 210-240: hold / subtle pulse

  // ── Particle Grid ────────────────────────────────────────────
  const gridOpacity = interpolate(frame, [30, 90], [0, 0.35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Logo ─────────────────────────────────────────────────────
  const logoSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });

  const logoOpacity = interpolate(frame, [60, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const logoScale = interpolate(logoSpring, [0, 1], [0.6, 1]);

  // Subtle glow pulse on the logo once it's visible
  const glowPulse =
    frame > 120
      ? interpolate(Math.sin((frame - 120) * 0.06), [-1, 1], [0.3, 0.8])
      : 0;

  // ── "CROW" typewriter ────────────────────────────────────────
  const typewriterStartFrame = 90;
  const framesPerLetter = 12;

  // ── "by B3" ──────────────────────────────────────────────────
  const byB3Spring = spring({
    frame: frame - 150,
    fps,
    config: { damping: 18, stiffness: 60, mass: 0.6 },
  });

  const byB3Opacity = interpolate(frame, [150, 185], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const byB3Y = interpolate(byB3Spring, [0, 1], [12, 0]);

  // ── Tagline ──────────────────────────────────────────────────
  const taglineSpring = spring({
    frame: frame - 180,
    fps,
    config: { damping: 20, stiffness: 50, mass: 0.6 },
  });

  const taglineOpacity = interpolate(frame, [180, 215], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const taglineY = interpolate(taglineSpring, [0, 1], [16, 0]);

  // ── Subtle scene zoom (1.0 → 1.02) ────────────────────────
  const sceneScale = interpolate(frame, [0, 240], [1.0, 1.02], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Logo bloom / white flash (frames 60-70) ───────────────
  const bloomOpacity = interpolate(frame, [60, 63, 67, 73], [0, 0.85, 0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Film grain seed — shifts each frame ────────────────────
  const grainX = ((frame * 73) % 200) - 100;
  const grainY = ((frame * 47) % 200) - 100;

  // ── Render ───────────────────────────────────────────────────
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: COLORS.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT_FAMILY,
        overflow: 'hidden',
        position: 'relative',
        transform: `scale(${sceneScale})`,
      }}
    >
      {/* ── Particle Dot Grid ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: gridOpacity,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
            width: width * 0.85,
            height: height * 0.85,
          }}
        >
          {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, i) => {
            const col = i % GRID_COLS;
            const row = Math.floor(i / GRID_COLS);

            // Distance from center of grid (normalised 0-1)
            const dx = (col - GRID_COLS / 2) / (GRID_COLS / 2);
            const dy = (row - GRID_ROWS / 2) / (GRID_ROWS / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Dots closer to center are brighter and appear sooner
            const staggerDelay = dist * 30; // frames
            const dotOpacity = interpolate(
              frame,
              [30 + staggerDelay, 90 + staggerDelay],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            );

            // Subtle shimmer for some dots near the center
            const shimmer =
              dist < 0.5 && frame > 100
                ? interpolate(
                    Math.sin((frame - 100) * 0.04 + i * 0.3),
                    [-1, 1],
                    [0.3, 1],
                  )
                : 1;

            // A few dots pick up the accent colour near center
            const isAccent = dist < 0.35 && (i % 7 === 0 || i % 11 === 0);

            // Gentle sine-wave drift for each dot
            const driftX = Math.sin(frame * 0.015 + i * 0.7) * 2.5;
            const driftY = Math.cos(frame * 0.012 + i * 0.5) * 2.0;

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: DOT_SIZE,
                    height: DOT_SIZE,
                    borderRadius: '50%',
                    backgroundColor: isAccent
                      ? COLORS.accent
                      : COLORS.textMuted,
                    opacity: dotOpacity * shimmer * (isAccent ? 0.7 : 0.25),
                    transform: `translate(${driftX}px, ${driftY}px)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Floating ambient bokeh particles ── */}
      {BOKEH_PARTICLES.map((p, idx) => {
        const elapsed = Math.max(0, frame - 20);
        const yPos = p.baseY - elapsed * p.speed * 100 / fps;
        const xWobble = Math.sin(frame * 0.02 + p.phaseOffset) * 12;
        const bokehVisible = interpolate(frame, [20, 50], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={`bokeh-${idx}`}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${yPos}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${COLORS.accent}${Math.round(p.opacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`,
              transform: `translateX(${xWobble}px)`,
              opacity: bokehVisible * p.opacity,
              filter: `blur(${p.size * 0.3}px) hue-rotate(${p.hue}deg)`,
              pointerEvents: 'none' as const,
            }}
          />
        );
      })}

      {/* ── Radial gradient overlay (vignette) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 30%, #0a0a0f 75%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Film grain / noise overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: -50,
          opacity: 0.04,
          pointerEvents: 'none' as const,
          zIndex: 10,
          mixBlendMode: 'overlay' as const,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
          transform: `translate(${grainX}px, ${grainY}px)`,
        }}
      />

      {/* ── Center Content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* Logo with bloom flash */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            marginBottom: 28,
            filter: `drop-shadow(0 0 ${20 + glowPulse * 20}px ${COLORS.accent}40)`,
            position: 'relative',
          }}
        >
          {/* Bloom / white flash overlay */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 240,
              height: 240,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(255,255,255,${bloomOpacity}) 0%, rgba(0,212,255,${bloomOpacity * 0.3}) 40%, transparent 70%)`,
              pointerEvents: 'none' as const,
              filter: 'blur(15px)',
            }}
          />
          <Img
            src={staticFile('logo.png')}
            style={{
              width: 120,
              height: 120,
              objectFit: 'contain',
              position: 'relative',
            }}
          />
        </div>

        {/* "CROW" typewriter text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 96,
            marginBottom: 12,
          }}
        >
          {CROW_LETTERS.map((letter, index) => {
            const letterFrame = typewriterStartFrame + index * framesPerLetter;

            const letterSpring = spring({
              frame: frame - letterFrame,
              fps,
              config: { damping: 12, stiffness: 120, mass: 0.5 },
            });

            const letterOpacity = interpolate(
              frame,
              [letterFrame, letterFrame + 6],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            );

            const letterY = interpolate(letterSpring, [0, 1], [20, 0]);
            const letterScale = interpolate(letterSpring, [0, 1], [0.7, 1]);

            return (
              <span
                key={index}
                style={{
                  fontSize: 80,
                  fontWeight: 800,
                  color: COLORS.text,
                  letterSpacing: 12,
                  opacity: letterOpacity,
                  transform: `translateY(${letterY}px) scale(${letterScale})`,
                  display: 'inline-block',
                  textShadow: `0 0 30px ${COLORS.accent}50, 0 0 60px ${COLORS.accent}20`,
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>

        {/* "by B3" */}
        <div
          style={{
            opacity: byB3Opacity,
            transform: `translateY(${byB3Y}px)`,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: COLORS.textMuted,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            by{' '}
            <span
              style={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentPurple})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              B3
            </span>
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 300,
              color: COLORS.textMuted,
              letterSpacing: 6,
              textTransform: 'uppercase',
            }}
          >
            Unified Customer Intelligence
          </span>
        </div>

        {/* Subtle accent line below tagline */}
        <div
          style={{
            marginTop: 32,
            width: interpolate(
              spring({
                frame: frame - 200,
                fps,
                config: { damping: 20, stiffness: 40, mass: 0.8 },
              }),
              [0, 1],
              [0, 160],
            ),
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.accent}, ${COLORS.accentPurple}, transparent)`,
            opacity: interpolate(frame, [200, 230], [0, 0.7], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
}
