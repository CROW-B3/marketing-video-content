import { Easing } from 'remotion';

// ════════════════════════════════════════════════════════════════════════════
//  CROW — Apple-inspired design system.
//  Single source of truth for color, type, spacing, easing, duration.
//  Restrained, premium, typography-led. Keep the palette tiny, the type large,
//  the motion slow. Pull EVERY value for a scene from here.
// ════════════════════════════════════════════════════════════════════════════

export const FPS = 30;
export const CANVAS_16x9 = { width: 1920, height: 1080 } as const;
export const CANVAS_9x16 = { width: 1080, height: 1920 } as const;

// ─── Color — near-black canvas, restrained greys, ONE accent ────────────────
export const COLOR = {
  bg: '#050507', // deep cinematic black
  bgElevated: '#0c0c11', // raised surfaces / panels
  bgWhite: '#f5f5f7', // optional "light keynote" canvas (Apple off-white)

  // text hierarchy on the dark canvas
  textPrimary: '#f5f5f7', // Apple off-white, not pure #fff
  textSecondary: '#9a9aa6',
  textTertiary: '#56565f',
  textOnLight: '#1d1d1f', // Apple near-black, for the light canvas

  // a single accent, used sparingly (key word, one underline, one node)
  accent: '#8b5cf6',
  accentSoft: 'rgba(139, 92, 246, 0.16)',

  // hairlines & borders — premium products live on thin lines
  line: 'rgba(255, 255, 255, 0.08)',
  lineStrong: 'rgba(255, 255, 255, 0.16)',
} as const;

// ─── Type — Sora, leaning light for the airy Apple feel ─────────────────────
export const FONT = {
  family: 'Sora, system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", monospace',
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// Large, confident display scale (px on the 1080-tall canvas).
export interface TypeToken {
  size: number;
  weight: number;
  tracking: number; // letter-spacing in px
  line: number; // line-height multiplier
}

// Tracking retuned tighter to Apple's optical/em model — Sora sits looser than
// SF Pro, so negative tracking on big display type is required, not optional
// (loose-heavy-giant is the canonical non-Apple tell).
export const TYPE: Record<string, TypeToken> = {
  hero: { size: 168, weight: 600, tracking: -7, line: 1.0 },
  display: { size: 108, weight: 600, tracking: -4, line: 1.04 },
  title: { size: 64, weight: 600, tracking: -2, line: 1.1 },
  headline: { size: 44, weight: 500, tracking: -1.2, line: 1.2 },
  body: { size: 30, weight: 400, tracking: -0.2, line: 1.45 },
  caption: { size: 22, weight: 500, tracking: 2, line: 1.3 },
  eyebrow: { size: 19, weight: 600, tracking: 4, line: 1.2 }, // UPPERCASE label
};

// ─── Spacing — strict 8pt grid ──────────────────────────────────────────────
export const SPACE = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 40,
  xl: 64,
  xxl: 96,
  margin: 160, // outer safe margin on a 1920-wide frame
} as const;

export const RADIUS = { sm: 10, md: 18, lg: 28, pill: 999 } as const;

export const SHADOW = {
  soft: '0 24px 70px -24px rgba(0, 0, 0, 0.65)',
  panel: '0 1px 0 rgba(255,255,255,0.05) inset, 0 30px 80px -30px rgba(0,0,0,0.7)',
  glow: (c: string): string => `0 0 80px -16px ${c}`,
} as const;

// ─── Easing — premium, frame-driven curves ──────────────────────────────────
//  EASE.out is the signature Apple-style reveal: a confident, soft landing.
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // reveal / settle (default)
  inOut: Easing.bezier(0.65, 0, 0.35, 1), // camera-like moves
  in: Easing.bezier(0.4, 0, 1, 1), // exits
  soft: Easing.bezier(0.22, 1, 0.36, 1), // gentlest
} as const;

// ─── Duration — named, in frames @30fps ─────────────────────────────────────
export const DUR = {
  instant: 6,
  quick: 12,
  base: 20,
  slow: 30,
  reveal: 38, // standard text/element reveal
  hold: 78, // minimum readable hold for a key line
  sceneCross: 18, // cross-dissolve between interior beats
  lockupCross: 28, // longer dissolve to land the final end-card
} as const;

// Spring presets — use ONLY when motion needs physical mass (never for text).
export const SPRING = {
  gentle: { damping: 26, stiffness: 120, mass: 1 },
  settle: { damping: 22, stiffness: 150, mass: 1 },
} as const;

// ─── Reveal — the opacity-led "settle" (fade-into-existence, never slide/bounce) ─
//  Opacity LEADS and finishes first (presence via brightness); a tiny translateY
//  rise TRAILS and only "lands". All units px / frames @30fps.
export const REVEAL = {
  rise: 24, // display translateY rise
  riseSmall: 16, // body/caption rise
  blurIn: 6, // hero entrance rack-focus start (px)
  opacityDur: 20, // opacity lead duration
  settleDur: 38, // translateY settle duration (trails opacity)
  lineStagger: 8, // delay between staggered lines
  exitDur: 16, // opacity-led exit
} as const;

// ─── Layout — optical centering & column ────────────────────────────────────
export const LAYOUT = {
  opticalCenterY: 0.46, // hero cluster sits slightly above true center
  contentMaxWidth: 1200, // central column on the 1920 canvas
  marginRatio: 0.083, // outer margins ≈ SPACE.margin (160) / 1920
} as const;
