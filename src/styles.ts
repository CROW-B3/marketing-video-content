export const COLORS = {
  background: '#0a0a0f',
  backgroundLight: '#12121a',
  accent: '#00d4ff',
  accentPurple: '#7c3aed',
  accentGradient: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
  text: '#ffffff',
  textMuted: '#94a3b8',
  textDim: '#475569',
} as const;

export const FONTS = {
  primary: 'Inter, system-ui, sans-serif',
  mono: 'JetBrains Mono, monospace',
} as const;

export const VIDEO_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 1650, // 55 seconds (1800 - 5 transitions * 30 frame overlap)
} as const;
