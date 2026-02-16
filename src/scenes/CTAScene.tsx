import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
  Img,
} from 'remotion';
import { noise2D } from '@remotion/noise';

const COLORS = {
  background: '#0a0a0f',
  accent: '#00d4ff',
  accentPurple: '#7c3aed',
  text: '#ffffff',
  textMuted: '#94a3b8',
};

const FONT_FAMILY = 'Inter, system-ui, sans-serif';

// ── Rising particles / sparkles configuration ──────────────────
interface RisingParticle {
  x: number; // horizontal position 0-100 (%)
  baseY: number; // starting vertical position (>100 = offscreen bottom)
  size: number; // diameter in px
  speed: number; // upward drift speed factor
  opacity: number; // max opacity
  hue: number; // hue-rotate offset
  phaseOffset: number; // horizontal wobble phase
  delay: number; // frame delay before becoming visible
}

const RISING_PARTICLES: RisingParticle[] = [
  { x: 8, baseY: 115, size: 4, speed: 0.12, opacity: 0.6, hue: 0, phaseOffset: 0, delay: 0 },
  { x: 22, baseY: 120, size: 3, speed: 0.09, opacity: 0.45, hue: 20, phaseOffset: 1.5, delay: 5 },
  { x: 38, baseY: 110, size: 5, speed: 0.14, opacity: 0.5, hue: -15, phaseOffset: 3.0, delay: 10 },
  { x: 52, baseY: 125, size: 3, speed: 0.10, opacity: 0.55, hue: 10, phaseOffset: 4.2, delay: 3 },
  { x: 65, baseY: 118, size: 4, speed: 0.11, opacity: 0.4, hue: -10, phaseOffset: 5.5, delay: 8 },
  { x: 78, baseY: 112, size: 6, speed: 0.13, opacity: 0.35, hue: 25, phaseOffset: 0.8, delay: 12 },
  { x: 90, baseY: 122, size: 3, speed: 0.08, opacity: 0.5, hue: -5, phaseOffset: 2.1, delay: 2 },
  { x: 15, baseY: 130, size: 4, speed: 0.07, opacity: 0.3, hue: 15, phaseOffset: 6.0, delay: 15 },
  { x: 45, baseY: 108, size: 5, speed: 0.15, opacity: 0.55, hue: -20, phaseOffset: 1.0, delay: 7 },
  { x: 72, baseY: 135, size: 3, speed: 0.06, opacity: 0.4, hue: 5, phaseOffset: 3.8, delay: 18 },
  { x: 30, baseY: 140, size: 4, speed: 0.10, opacity: 0.35, hue: 30, phaseOffset: 5.0, delay: 20 },
  { x: 58, baseY: 105, size: 6, speed: 0.16, opacity: 0.3, hue: -25, phaseOffset: 2.5, delay: 1 },
  { x: 85, baseY: 128, size: 3, speed: 0.09, opacity: 0.45, hue: 12, phaseOffset: 4.5, delay: 14 },
  { x: 5, baseY: 132, size: 5, speed: 0.11, opacity: 0.4, hue: -8, phaseOffset: 0.3, delay: 9 },
  { x: 95, baseY: 115, size: 4, speed: 0.13, opacity: 0.5, hue: 18, phaseOffset: 6.3, delay: 6 },
];

// ── Starburst ray configuration ────────────────────────────────
const STARBURST_RAY_COUNT = 36;
const STARBURST_RAYS: number[] = Array.from(
  { length: STARBURST_RAY_COUNT },
  (_, i) => (360 / STARBURST_RAY_COUNT) * i,
);

// Outer counter-rotating ring
const OUTER_RAY_COUNT = 24;
const OUTER_STARBURST_RAYS: number[] = Array.from(
  { length: OUTER_RAY_COUNT },
  (_, i) => (360 / OUTER_RAY_COUNT) * i,
);

// ── Glow orb configuration ─────────────────────────────────────
interface GlowOrb {
  size: number;
  opacity: number;
  color: string;
  seedX: string;
  seedY: string;
  speed: number;
  offsetX: number;
  offsetY: number;
}

const GLOW_ORBS: GlowOrb[] = [
  { size: 800, opacity: 0.06, color: 'rgba(0, 212, 255, 0.35)', seedX: 'orb0x', seedY: 'orb0y', speed: 0.008, offsetX: -200, offsetY: -100 },
  { size: 700, opacity: 0.05, color: 'rgba(124, 58, 237, 0.3)', seedX: 'orb1x', seedY: 'orb1y', speed: 0.006, offsetX: 250, offsetY: 150 },
  { size: 600, opacity: 0.04, color: 'rgba(6, 182, 212, 0.25)', seedX: 'orb2x', seedY: 'orb2y', speed: 0.01, offsetX: 100, offsetY: -200 },
];

// ── Tagline words for word-by-word animation ───────────────────
const TAGLINE_WORDS = 'See every signal. Understand every customer.'.split(' ');
const WORD_STAGGER = 6; // frames between each word

// ── CROW characters for char-by-char reveal ────────────────────
const CROW_CHARS = ['C', 'R', 'O', 'W'];
const CHAR_STAGGER = 5; // frames between each character

export default function CTAScene() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ── Timing (180 frames = 6 seconds at 30fps) ──────────────────
  // 0-20:    background glow starts pulsing
  // 10-50:   logo fades in + scales up
  // 35-65:   "CROW" gradient text fades in (char-by-char)
  // 55-85:   horizontal divider expands from center
  // 70-105:  tagline fades in (word-by-word)
  // 90-125:  CTA button appears with glowing border
  // 120-155: URL fades in at bottom
  // 155-180: hold with ambient glow animation

  // ── Parallax base drift (noise-based) ──────────────────────────
  const parallaxSlow = noise2D('parallax-slow', frame * 0.008, 0) * 8;
  const parallaxMed = noise2D('parallax-med', frame * 0.012, 0) * 5;
  const parallaxFast = noise2D('parallax-fast', frame * 0.018, 0) * 3;

  // ── Background Radial Glow ─────────────────────────────────────
  const glowIntensity = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.15, 0.3],
  );

  const glowScale = interpolate(
    Math.sin(frame * 0.025),
    [-1, 1],
    [0.9, 1.1],
  );

  // ── Logo ───────────────────────────────────────────────────────
  const logoSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });

  const logoOpacity = interpolate(frame, [10, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const logoScale = interpolate(logoSpring, [0, 1], [0.5, 1]);

  // Gentle floating pulse once visible
  const logoGlow =
    frame > 50
      ? interpolate(Math.sin((frame - 50) * 0.06), [-1, 1], [0.3, 0.9])
      : 0;

  // ── Starburst behind logo ────────────────────────────────────
  const starburstOpacity = interpolate(frame, [15, 40, 50, 70], [0, 0.7, 0.5, 0.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const starburstScale = interpolate(frame, [15, 55], [0.3, 1.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const starburstRotation = interpolate(frame, [15, 180], [0, 45], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Counter-rotation for outer ring
  const outerStarburstRotation = interpolate(frame, [15, 180], [0, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── "CROW" Title ───────────────────────────────────────────────
  const titleSpring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 16, stiffness: 70, mass: 0.7 },
  });

  const titleOpacity = interpolate(frame, [35, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleY = interpolate(titleSpring, [0, 1], [20, 0]);
  const titleScale = interpolate(titleSpring, [0, 1], [0.85, 1]);

  // Pulsing glow after CROW text is revealed
  const crowGlowPulse =
    frame > 65
      ? interpolate(Math.sin((frame - 65) * 0.06), [-1, 1], [0.3, 1.0])
      : 0;

  // ── Divider Line ───────────────────────────────────────────────
  const dividerSpring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 20, stiffness: 50, mass: 0.8 },
  });

  const dividerWidth = interpolate(dividerSpring, [0, 1], [0, 280]);

  const dividerOpacity = interpolate(frame, [55, 80], [0, 0.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Tagline ────────────────────────────────────────────────────
  const taglineBaseFrame = 70;

  // ── CTA Button ─────────────────────────────────────────────────
  const buttonSpring = spring({
    frame: frame - 90,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.7 },
  });

  const buttonOpacity = interpolate(frame, [90, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const buttonBaseScale = interpolate(buttonSpring, [0, 1], [0.8, 1]);

  // Subtle scale pulse on the button
  const buttonPulse =
    frame > 120
      ? interpolate(Math.sin((frame - 120) * 0.07), [-1, 1], [1.0, 1.02])
      : 1.0;

  const buttonScale = buttonBaseScale * buttonPulse;

  // Cycling gradient rotation for the glowing border - smoother
  const borderRotation = frame * 2.0;

  // Glow intensity on the button that pulses
  const buttonGlowIntensity =
    frame > 120
      ? interpolate(
          Math.sin((frame - 120) * 0.08),
          [-1, 1],
          [0.4, 1.0],
        )
      : 0;

  // Outer glow ring pulse (independent frequency)
  const outerGlowPulse =
    frame > 120
      ? interpolate(
          Math.sin((frame - 120) * 0.05),
          [-1, 1],
          [0.2, 0.7],
        )
      : 0;

  // ── Button shimmer / shine sweep ──────────────────────────────
  const shimmerProgress =
    frame > 100
      ? ((frame - 100) % 90) / 90
      : -1;

  const shimmerX = interpolate(shimmerProgress, [0, 1], [-50, 150]);

  // ── URL ────────────────────────────────────────────────────────
  const urlSpring = spring({
    frame: frame - 120,
    fps,
    config: { damping: 20, stiffness: 50, mass: 0.6 },
  });

  const urlOpacity = interpolate(frame, [120, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const urlY = interpolate(urlSpring, [0, 1], [10, 0]);

  // ── Film grain seed -- shifts each frame ────────────────────
  const grainX = ((frame * 73) % 200) - 100;
  const grainY = ((frame * 47) % 200) - 100;

  // ── Aurora gradient blob animations ────────────────────────────
  const auroraBlob1Scale = interpolate(Math.sin(frame * 0.02), [-1, 1], [0.85, 1.15]);
  const auroraBlob2Scale = interpolate(Math.sin(frame * 0.025 + 1.2), [-1, 1], [0.9, 1.1]);
  const auroraBlob3Scale = interpolate(Math.sin(frame * 0.018 + 2.5), [-1, 1], [0.88, 1.12]);
  const auroraBlob4Scale = interpolate(Math.sin(frame * 0.022 + 3.8), [-1, 1], [0.92, 1.08]);

  const auroraBlob1X = noise2D('aurora1x', frame * 0.006, 0) * 60;
  const auroraBlob1Y = noise2D('aurora1y', 0, frame * 0.006) * 40;
  const auroraBlob2X = noise2D('aurora2x', frame * 0.008, 1) * 80;
  const auroraBlob2Y = noise2D('aurora2y', 1, frame * 0.008) * 50;
  const auroraBlob3X = noise2D('aurora3x', frame * 0.005, 2) * 50;
  const auroraBlob3Y = noise2D('aurora3y', 2, frame * 0.005) * 60;
  const auroraBlob4X = noise2D('aurora4x', frame * 0.007, 3) * 70;
  const auroraBlob4Y = noise2D('aurora4y', 3, frame * 0.007) * 45;

  // ── Render ─────────────────────────────────────────────────────
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
      }}
    >
      {/* ── Premium Aurora Gradient Mesh Background ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Large cyan blob - centered, pulsing */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 1000,
            height: 1000,
            marginLeft: -500,
            marginTop: -500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, rgba(0, 212, 255, 0.03) 40%, transparent 70%)',
            transform: `scale(${auroraBlob1Scale}) translate(${auroraBlob1X}px, ${auroraBlob1Y}px)`,
          }}
        />
        {/* Purple blob - offset, counter-animated */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '60%',
            width: 900,
            height: 900,
            marginLeft: -450,
            marginTop: -450,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, rgba(124, 58, 237, 0.02) 40%, transparent 70%)',
            transform: `scale(${auroraBlob2Scale}) translate(${auroraBlob2X}px, ${auroraBlob2Y}px)`,
          }}
        />
        {/* Teal-green accent - bottom area */}
        <div
          style={{
            position: 'absolute',
            top: '65%',
            left: '40%',
            width: 850,
            height: 850,
            marginLeft: -425,
            marginTop: -425,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, rgba(6, 182, 212, 0.02) 40%, transparent 70%)',
            transform: `scale(${auroraBlob3Scale}) translate(${auroraBlob3X}px, ${auroraBlob3Y}px)`,
          }}
        />
        {/* Blue-violet - top area */}
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '35%',
            width: 800,
            height: 800,
            marginLeft: -400,
            marginTop: -400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, rgba(99, 102, 241, 0.015) 40%, transparent 70%)',
            transform: `scale(${auroraBlob4Scale}) translate(${auroraBlob4X}px, ${auroraBlob4Y}px)`,
          }}
        />
      </div>

      {/* ── Animated Radial Glow Background (parallax slow layer) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          transform: `translateY(${parallaxSlow}px)`,
        }}
      >
        {/* Primary cyan glow */}
        <div
          style={{
            position: 'absolute',
            width: 800,
            height: 800,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.accent}18 0%, ${COLORS.accent}08 40%, transparent 70%)`,
            opacity: glowIntensity,
            transform: `scale(${glowScale})`,
          }}
        />
        {/* Secondary purple glow, offset and counter-animated */}
        <div
          style={{
            position: 'absolute',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.accentPurple}15 0%, ${COLORS.accentPurple}06 40%, transparent 70%)`,
            opacity: glowIntensity * 0.8,
            transform: `scale(${interpolate(Math.sin(frame * 0.03 + 1.5), [-1, 1], [0.95, 1.15])}) translateX(${parallaxSlow * 0.5}px)`,
          }}
        />
      </div>

      {/* ── Dramatic Glow Orbs ── */}
      {GLOW_ORBS.map((orb, idx) => {
        const driftX = noise2D(orb.seedX, frame * orb.speed, idx * 10) * 120;
        const driftY = noise2D(orb.seedY, idx * 10, frame * orb.speed) * 80;
        const pulse = interpolate(
          Math.sin(frame * 0.03 + idx * 2.1),
          [-1, 1],
          [0.7, 1.3],
        );

        return (
          <div
            key={`glow-orb-${idx}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: orb.size,
              height: orb.size,
              marginLeft: -orb.size / 2 + orb.offsetX,
              marginTop: -orb.size / 2 + orb.offsetY,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              opacity: orb.opacity * pulse,
              transform: `translate(${driftX}px, ${driftY}px)`,
              pointerEvents: 'none' as const,
            }}
          />
        );
      })}

      {/* ── Rising Particles / Sparkles (noise2D-based) ── */}
      {RISING_PARTICLES.map((p, idx) => {
        const elapsed = Math.max(0, frame - p.delay);
        const yPos = p.baseY - (elapsed * p.speed * 100) / fps;
        const xWobble = noise2D('cta-px' + idx, frame * 0.012, idx * 0.5) * 10;
        const particleVisible = interpolate(frame, [p.delay, p.delay + 30], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        // Fade out as they rise toward the top
        const fadeOut = interpolate(yPos, [-10, 20, 80], [0, 1, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={`particle-${idx}`}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${yPos}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${COLORS.accent}, transparent 70%)`,
              transform: `translateX(${xWobble}px) translateY(${parallaxMed}px)`,
              opacity: particleVisible * p.opacity * fadeOut,
              filter: `blur(${p.size * 0.2}px) hue-rotate(${p.hue}deg)`,
              boxShadow: `0 0 ${p.size * 2}px ${COLORS.accent}40`,
              pointerEvents: 'none' as const,
            }}
          />
        );
      })}

      {/* ── Vignette overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 25%, #0a0a0f 80%)',
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

      {/* ── Center Content Stack (parallax foreground layer) ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          transform: `translateY(${parallaxFast}px)`,
        }}
      >
        {/* ── Enhanced Starburst / radial burst behind logo ── */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: '50%',
            width: 280,
            height: 280,
            marginLeft: -140,
            opacity: starburstOpacity,
            transform: `scale(${starburstScale}) rotate(${starburstRotation}deg)`,
            pointerEvents: 'none' as const,
          }}
        >
          {STARBURST_RAYS.map((angle, idx) => {
            // Alternate between cyan and purple, vary lengths and widths
            const isCyan = idx % 2 === 0;
            const rayLength = 80 + (idx % 3) * 25;
            const rayWidth = idx % 3 === 0 ? 2 : 1;
            const rayColor = isCyan ? COLORS.accent : COLORS.accentPurple;
            // Gradient from white-ish to the ray color
            const rayGradient = isCyan
              ? `linear-gradient(90deg, rgba(255,255,255,0.5), ${rayColor}60, transparent)`
              : `linear-gradient(90deg, rgba(200,180,255,0.4), ${rayColor}50, transparent)`;

            return (
              <div
                key={`ray-${idx}`}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: rayLength,
                  height: rayWidth,
                  background: rayGradient,
                  transformOrigin: '0 50%',
                  transform: `rotate(${angle}deg)`,
                  opacity: 0.6 + Math.sin(frame * 0.05 + idx) * 0.2,
                }}
              />
            );
          })}
        </div>

        {/* ── Outer counter-rotating starburst ring ── */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: '50%',
            width: 280,
            height: 280,
            marginLeft: -140,
            opacity: starburstOpacity * 0.4,
            transform: `scale(${starburstScale * 1.3}) rotate(${outerStarburstRotation}deg)`,
            pointerEvents: 'none' as const,
          }}
        >
          {OUTER_STARBURST_RAYS.map((angle, idx) => {
            const rayLength = 60 + (idx % 4) * 20;
            const rayColor = idx % 2 === 0 ? COLORS.accent : COLORS.accentPurple;

            return (
              <div
                key={`outer-ray-${idx}`}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: rayLength,
                  height: 1,
                  background: `linear-gradient(90deg, ${rayColor}30, transparent)`,
                  transformOrigin: '0 50%',
                  transform: `rotate(${angle}deg)`,
                  opacity: 0.4 + Math.sin(frame * 0.04 + idx * 0.8) * 0.2,
                }}
              />
            );
          })}
        </div>

        {/* ── Logo ── */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            marginBottom: 20,
            filter: `drop-shadow(0 0 ${18 + logoGlow * 22}px ${COLORS.accent}50)`,
          }}
        >
          <Img
            src={staticFile('logo.png')}
            style={{
              width: 100,
              height: 100,
              objectFit: 'contain',
            }}
          />
        </div>

        {/* ── "CROW" Gradient Title (char-by-char blur-in) ── */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px) scale(${titleScale})`,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {CROW_CHARS.map((char, charIdx) => {
            const charDelay = 35 + charIdx * CHAR_STAGGER;
            const charSpring = spring({
              frame: frame - charDelay,
              fps,
              config: { damping: 14, stiffness: 80, mass: 0.6 },
            });
            const charBlur = interpolate(charSpring, [0, 1], [12, 0]);
            const charOpacity = interpolate(charSpring, [0, 1], [0, 1]);

            return (
              <span
                key={`crow-char-${charIdx}`}
                style={{
                  fontSize: 72,
                  fontWeight: 800,
                  letterSpacing: 14,
                  background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentPurple})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none',
                  filter: `blur(${charBlur}px) drop-shadow(0 0 ${40 + crowGlowPulse * 30}px ${COLORS.accent}30) drop-shadow(0 0 ${80 + crowGlowPulse * 40}px ${COLORS.accentPurple}20)`,
                  opacity: charOpacity,
                  display: 'inline-block',
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* ── Horizontal Divider ── */}
        <div
          style={{
            width: dividerWidth,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.accent}, ${COLORS.accentPurple}, transparent)`,
            opacity: dividerOpacity,
            borderRadius: 1,
            marginBottom: 28,
          }}
        />

        {/* ── Tagline (word-by-word blur-in) ── */}
        <div
          style={{
            marginBottom: 40,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 8,
            maxWidth: 700,
          }}
        >
          {TAGLINE_WORDS.map((word, wordIdx) => {
            const wordDelay = taglineBaseFrame + wordIdx * WORD_STAGGER;
            const wordSpring = spring({
              frame: frame - wordDelay,
              fps,
              config: { damping: 16, stiffness: 70, mass: 0.5 },
            });
            const wordBlur = interpolate(wordSpring, [0, 1], [8, 0]);
            const wordOpacity = interpolate(wordSpring, [0, 1], [0, 1]);
            const wordY = interpolate(wordSpring, [0, 1], [10, 0]);

            return (
              <span
                key={`tagline-word-${wordIdx}`}
                style={{
                  fontSize: 24,
                  fontWeight: 300,
                  color: COLORS.textMuted,
                  letterSpacing: 2,
                  display: 'inline-block',
                  opacity: wordOpacity,
                  filter: `blur(${wordBlur}px)`,
                  transform: `translateY(${wordY}px)`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* ── CTA Button with Liquid Border + Outer Glow Ring ── */}
        <div
          style={{
            opacity: buttonOpacity,
            transform: `scale(${buttonScale})`,
            marginBottom: 36,
            position: 'relative',
          }}
        >
          {/* Outer glow ring (pulsing independently) */}
          <div
            style={{
              position: 'absolute',
              inset: -8,
              borderRadius: 58,
              background: `conic-gradient(from ${borderRotation + 90}deg, ${COLORS.accent}30, ${COLORS.accentPurple}20, transparent, ${COLORS.accent}25, ${COLORS.accentPurple}15, transparent)`,
              opacity: outerGlowPulse,
              filter: 'blur(8px)',
              pointerEvents: 'none' as const,
            }}
          />
          {/* Main button border with smoother conic-gradient (more color stops) */}
          <div
            style={{
              position: 'relative',
              padding: 3,
              borderRadius: 50,
              background: `conic-gradient(from ${borderRotation}deg, ${COLORS.accent}, ${COLORS.accentPurple}80, ${COLORS.accent}60, ${COLORS.accentPurple}, ${COLORS.accent}80, ${COLORS.accentPurple}60, ${COLORS.accent})`,
              boxShadow: `0 0 ${20 + buttonGlowIntensity * 25}px ${COLORS.accent}${Math.round(25 + buttonGlowIntensity * 30).toString(16).padStart(2, '0')}, 0 0 ${40 + buttonGlowIntensity * 40}px ${COLORS.accentPurple}${Math.round(15 + buttonGlowIntensity * 20).toString(16).padStart(2, '0')}`,
            }}
          >
            <div
              style={{
                backgroundColor: COLORS.background,
                borderRadius: 47,
                paddingLeft: 52,
                paddingRight: 52,
                paddingTop: 16,
                paddingBottom: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Shimmer / shine sweep overlay (wider, more visible) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: `${shimmerX}%`,
                  width: '45%',
                  height: '100%',
                  background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.08), transparent)`,
                  transform: 'skewX(-20deg)',
                  pointerEvents: 'none' as const,
                }}
              />
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentPurple})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                Get Started
              </span>
            </div>
          </div>
        </div>

        {/* ── URL ── */}
        <div
          style={{
            opacity: urlOpacity,
            transform: `translateY(${urlY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: COLORS.textMuted,
              letterSpacing: 4,
              opacity: 0.7,
            }}
          >
            crowai.dev
          </span>
        </div>
      </div>

      {/* ── Bottom edge subtle gradient ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: `linear-gradient(to top, ${COLORS.background}, transparent)`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
