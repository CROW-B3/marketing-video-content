/**
 * CrowAd_Hero — 30-second Hero Ad
 *
 * Composition : 3840 × 2160 (4K UHD), 60 fps, 1800 frames
 * Render space: All pixel values authored at 1920 × 1080 and scaled ×2
 *               inside a CSS scale(2) wrapper → crisp 4K output for every
 *               CSS, SVG and text element (fully vector, zero rasterisation).
 *
 * Narrative psychology — P·A·S·O framework:
 *   Problem  → "You're making decisions on 30% of the story."
 *   Agitate  → Your customers leave signals everywhere. You miss them all.
 *   Solution → CROW: the unified intelligence layer that sees it all.
 *   Outcome  → One question. Three channels. The complete answer.
 *
 * Scene map (60 fps):
 *   0   – 120   S1  Hook / Open Loop         2 s
 *   120 – 360   S2  The Fractured Reality     4 s
 *   360 – 480   S3  CROW Brand Reveal         2 s
 *   480 – 680   S4a Web Channel               3.3 s
 *   680 – 880   S4b Physical Channel          3.3 s
 *   880 – 1080  S4c Social Channel            3.3 s
 *  1080 – 1440  S5  Convergence + AI Proof    6 s
 *  1440 – 1620  S6  Scale + Trust             3 s
 *  1620 – 1800  S7  CTA                       3 s
 */

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
  FPS as SHARED_FPS,
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

// ─── Constants ────────────────────────────────────────────────────────────────

/** All animations authored at 60 fps */
const FPS = 60;
/** Authored at 1920 × 1080; a ×2 CSS scale fills 3840 × 2160 */
const W = 1920;
const H = 1080;
/** Inner safe zone (px in 1920 × 1080 space) */
const SH = 100;

// Reuse the existing shared spring / animate utils but drive them at 60 fps
function sp(frame: number, delay: number, cfg = SPRING_SNAP, dur = 30) {
  return spring({ frame: frame - delay, fps: FPS, config: cfg, durationInFrames: dur });
}
function fi(frame: number, a: number, b: number, from = 0, to = 1) {
  return interpolate(frame, [a, b], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}
function fo(frame: number, start: number, len = 20) {
  return fi(frame, start, start + len, 1, 0);
}
function glow(frame: number, start: number, len = 50) {
  return glowRamp(frame, start, len);
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

const COPY = {
  // S1 – Hook
  s1q1: 'WHAT IF YOU KNEW',
  s1q2: 'EXACTLY WHY',
  s1q3: 'YOUR CUSTOMER WALKED AWAY?',
  s1sub: 'Most businesses never find out.',

  // S2 – Fractured Reality
  s2head: "YOU'RE RUNNING ON 30% OF THE STORY.",
  s2Silos: [
    {
      label: 'WEB ANALYTICS',
      color: COLORS.cyan,
      truth: 'You see clicks.',
      blind: 'Not the decision behind them.',
      icon: '⟵ cursor',
    },
    {
      label: 'IN-STORE DATA',
      color: COLORS.red,
      truth: 'You see footfall.',
      blind: 'Not what changed their mind.',
      icon: '⟵ person',
    },
    {
      label: 'SOCIAL LISTENING',
      color: COLORS.purple,
      truth: 'You see mentions.',
      blind: 'Not the sentiment that drives them.',
      icon: '⟵ speech',
    },
  ] as const,
  s2punch: 'THREE SILOS. ZERO CONTEXT. EVERY DECISION IS A GUESS.',

  // S3 – Reveal
  s3line1: 'CROW CHANGES THAT.',
  s3tag: 'COGNITIVE REASONING OBSERVATION WATCHER',
  s3sub: 'A UNIFIED CUSTOMER INTERACTION INTELLIGENCE PLATFORM',

  // S4 – Channels
  s4Web: {
    eye: 'WEB CHANNEL',
    color: COLORS.cyan,
    head: 'KNOW WHICH PAGE\nKILLS YOUR CONVERSION.',
    sub: 'EVERY CLICK, SCROLL AND FORM INTERACTION — PROCESSED AT THE EDGE IN < 50ms.',
    chips: ['CLICKS', 'SCROLLS', 'FORMS', 'PRODUCT VIEWS', 'SESSION DEPTH'] as const,
    badge: '< 10KB SDK  ·  EDGE-NATIVE',
    code: "crow.track('product_view', { id: 'PRD-042', price: 149 });",
  },
  s4Physical: {
    eye: 'PHYSICAL CHANNEL',
    color: COLORS.red,
    head: 'KNOW WHICH DISPLAY\nACTUALLY DRIVES SALES.',
    sub: 'REAL-TIME CCTV ANALYSIS POWERED BY GEMINI LIVE API — PRIVACY-FIRST, INSIGHTS-ONLY.',
    insights: [
      'Avg dwell at Aisle 3: 4.2 min — highest in store',
      'Peak conversion window: 14:00–16:00 daily',
      'Checkout abandonment up 18% after new layout',
    ] as const,
    badge: 'GEMINI LIVE VISION  ·  PRIVACY-FIRST',
  },
  s4Social: {
    eye: 'SOCIAL CHANNEL',
    color: COLORS.purple,
    head: 'KNOW WHICH MESSAGE\nIS ACTUALLY RESONATING.',
    sub: 'MULTI-AGENT AI SEARCHES AND SCRAPES X, INSTAGRAM, LINKEDIN, REDDIT, TIKTOK — CONTINUOUSLY.',
    sources: ['X / TWITTER', 'INSTAGRAM', 'LINKEDIN', 'REDDIT', 'TIKTOK'] as const,
    agents: ['SEARCH PLANNER', 'EXECUTOR', 'EXTRACTOR', 'STANDARDIZER'] as const,
    badge: 'MULTI-AGENT AI  ·  CONTINUOUS',
  },

  // S5 – Convergence
  s5head1: 'ONE PLATFORM.',
  s5head2: 'THE COMPLETE PICTURE.',
  s5queryLabel: 'YOUR TEAM ASKS:',
  s5query: '"Why did our Tuesday campaign underperform?"',
  s5responseLabel: 'CROW ANSWERS — ACROSS ALL THREE CHANNELS:',
  s5response:
    'Web CTR was 2.3% (vs 3.8% baseline) with 68% bounce on the campaign landing page. In-store traffic in promoted zones dropped 12% on Tuesday. Social analysis detected 67% negative sentiment around your campaign hashtag — a competing news cycle began Monday night. No single channel shows the full picture. CROW does.',
  s5agents: ['INTERACTION AGENT', 'PATTERN AGENT', 'ANALYTICS AGENT'] as const,

  // S6 – Scale + Trust
  s6tag: 'BUILT FOR ENTERPRISE.',
  s6stats: [
    { v: '100K+',  l: 'EVENTS / SEC'    },
    { v: '< 50ms', l: 'INGESTION P95'   },
    { v: '300+',   l: 'EDGE LOCATIONS'  },
    { v: '99.9%',  l: 'UPTIME SLA'      },
  ] as const,
  s6badges: ['GDPR COMPLIANT', 'CCPA READY', 'PRIVACY-FIRST'] as const,
  s6infra: 'POWERED BY CLOUDFLARE\'S GLOBAL EDGE NETWORK',

  // S7 – CTA
  s7line1: 'STOP GUESSING.',
  s7line2: 'START KNOWING.',
  s7url: 'crowai.dev',
  s7end: 'CROW  ·  BY B3',
} as const;

// ─── Scene 1 · Hook (0–120) ───────────────────────────────────────────────────
// Open loop: a cinematic question the viewer needs to resolve.
// Psychology: Zeigarnik effect — unfinished questions demand closure.

const S1_Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // Spotlight that tightens as text appears
  const spotR = fi(frame, 0, 80, 140, 55);
  const spotO = fi(frame, 0, 20, 0, 0.9);

  // Three lines stagger in with heavy spring weight
  const lines = [COPY.s1q1, COPY.s1q2, COPY.s1q3];
  const lineDelays = [10, 26, 44];
  const lineProgs = lineDelays.map((d) => sp(frame, d, { damping: 9, stiffness: 180 }, 28));

  const subO = fi(frame, 76, 96);
  const subY = fi(frame, 76, 96, 18, 0);

  // Cursor blink at end of s1q3
  const cursorBlink = Math.sin(frame * 0.35) > 0 && frame > 60;

  const gl = glow(frame, 10, 50);
  const pulse = breathe(frame, 0.05, 0.1);
  const out = fo(frame, 100, 20);

  return (
    <AbsoluteFill style={{ opacity: out, alignItems: 'center', justifyContent: 'center' }}>
      {/* Cinematic spotlight */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1920 1080">
        <defs>
          <radialGradient id="s1-spot" cx="50%" cy="48%" r={`${spotR}%`}>
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.92)" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#s1-spot)" opacity={spotO} />
      </svg>

      {/* Ambient centre glow */}
      <div style={{
        position: 'absolute', width: 700, height: 380, borderRadius: '50%',
        background: `radial-gradient(ellipse, ${COLORS.red}30 0%, ${COLORS.purple}14 50%, transparent 74%)`,
        filter: 'blur(70px)', opacity: gl * pulse, pointerEvents: 'none',
      }} />

      {/* Question lines */}
      <div style={{ textAlign: 'center', padding: `0 ${SH}px`, position: 'relative', zIndex: 2 }}>
        {lines.map((line, i) => {
          const p = lineProgs[i] ?? 0;
          const isLast = i === lines.length - 1;
          return (
            <div key={i} style={{
              opacity: interpolate(p, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(p, [0, 1], [48, 0])}px)`,
              fontFamily: FONTS.primary,
              fontSize: i === 2 ? 72 : 80,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: i === 2 ? -1 : 0,
              ...(i === 2 ? {
                background: COLORS.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: `drop-shadow(0 0 ${26 * gl}px ${COLORS.red}50)`,
              } : { color: COLORS.text }),
            }}>
              {line}
              {isLast && cursorBlink && (
                <span style={{ background: COLORS.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>_</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Sub */}
      <div style={{
        position: 'absolute', top: '68%', left: SH, right: SH, textAlign: 'center',
        opacity: subO, transform: `translateY(${subY}px)`,
        fontFamily: FONTS.primary, fontSize: 22, fontWeight: 500,
        color: COLORS.textMuted, letterSpacing: 3, fontStyle: 'italic',
      }}>
        {COPY.s1sub}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2 · Fractured Reality (120–360) ────────────────────────────────────
// Psychology: Loss aversion + contrast principle.
// Show the gap between what they think they know vs what they're missing.

const S2_Fractured: React.FC = () => {
  const frame = useCurrentFrame();

  const headWords = COPY.s2head.split(' ');
  const headOps = headWords.map((_, i) => fi(frame, 4 + i * 5, 16 + i * 5));

  const siloDelays = [60, 100, 140];
  const siloProgs  = siloDelays.map((d) => sp(frame, d, { damping: 11, stiffness: 140 }, 32));

  const punchO = fi(frame, 182, 208);
  const punchY = fi(frame, 182, 208, 20, 0);

  const out = fo(frame, 210, 30);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* Headline */}
      <div style={{
        position: 'absolute', top: 120, left: SH, right: SH, textAlign: 'center',
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 14px',
      }}>
        {headWords.map((w, i) => (
          <span key={i} style={{
            fontFamily: FONTS.primary, fontSize: 58, fontWeight: 900, color: COLORS.text,
            opacity: headOps[i] ?? 0,
            transform: `translateY(${interpolate(headOps[i] ?? 0, [0, 1], [18, 0])}px)`,
            lineHeight: 1.2,
          }}>{w}</span>
        ))}
      </div>

      {/* Three silo cards */}
      <div style={{
        position: 'absolute', top: 270, left: SH, right: SH,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22,
      }}>
        {COPY.s2Silos.map((silo, i) => {
          const p = siloProgs[i] ?? 0;
          const op  = interpolate(p, [0, 1], [0, 1]);
          const sc  = interpolate(p, [0, 1], [0.82, 1]);
          const gIn = glow(frame, siloDelays[i] ?? 60, 40);
          return (
            <div key={silo.label} style={{
              opacity: op, transform: `scale(${sc})`,
              ...glassCard(gIn * 0.3),
              borderRadius: 20, padding: '32px 28px',
              borderTop: `2px solid ${silo.color}55`,
              boxShadow: `0 0 ${30 * gIn}px ${silo.color}18`,
            }}>
              {/* Channel label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: silo.color, boxShadow: `0 0 10px ${silo.color}`,
                }} />
                <span style={{
                  fontFamily: FONTS.primary, fontSize: 13, fontWeight: 800,
                  color: silo.color, letterSpacing: 5,
                }}>{silo.label}</span>
              </div>

              {/* What they see */}
              <div style={{
                fontFamily: FONTS.primary, fontSize: 28, fontWeight: 700,
                color: COLORS.text, lineHeight: 1.2, marginBottom: 12,
              }}>{silo.truth}</div>

              {/* Horizontal rule */}
              <div style={{ width: '100%', height: 1, background: `${silo.color}25`, marginBottom: 12 }} />

              {/* What they miss — the loss */}
              <div style={{
                fontFamily: FONTS.primary, fontSize: 19, fontWeight: 500,
                color: COLORS.textMuted, lineHeight: 1.5,
              }}>
                <span style={{ color: COLORS.red, fontWeight: 700 }}>✕ </span>
                {silo.blind}
              </div>
            </div>
          );
        })}
      </div>

      {/* Punch line */}
      <div style={{
        position: 'absolute', bottom: 96, left: SH, right: SH, textAlign: 'center',
        opacity: punchO, transform: `translateY(${punchY}px)`,
        fontFamily: FONTS.primary, fontSize: 22, fontWeight: 800,
        color: COLORS.red, letterSpacing: 4, lineHeight: 1.5,
        textShadow: `0 0 24px ${COLORS.red}45`,
      }}>{COPY.s2punch}</div>
    </AbsoluteFill>
  );
};

// ─── Scene 3 · CROW Brand Reveal (360–480) ────────────────────────────────────
// Psychology: Pattern interrupt after pain. Clean relief. Authority positioning.

const S3_Reveal: React.FC = () => {
  const frame = useCurrentFrame();

  // Full-screen flash wipe
  const wipeO = fi(frame, 0, 8, 0.6, 0);

  // Dual shockwave rings
  const r1s = fi(frame, 0, 50, 0.05, 3.8);
  const r1o = interpolate(frame, [0, 8, 50], [0, 0.7, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const r2s = fi(frame, 10, 60, 0.05, 3.8);
  const r2o = interpolate(frame, [10, 18, 60], [0, 0.45, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // CROW letters
  const letters = ['C', 'R', 'O', 'W'];
  const lProgs  = letters.map((_, i) => sp(frame, 14 + i * 8, { damping: 7, stiffness: 220 }, 24));

  const gl = glow(frame, 12, 45);
  const pulse = breathe(frame, 0.06, 0.1);

  const tagO = fi(frame, 64, 82);
  const tagY = fi(frame, 64, 82, 16, 0);
  const subO = fi(frame, 76, 96);
  const subY = fi(frame, 76, 96, 12, 0);

  const out = fo(frame, 100, 20);

  return (
    <AbsoluteFill style={{ opacity: out, alignItems: 'center', justifyContent: 'center' }}>
      {/* Flash wipe */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at center, ${COLORS.red}60, ${COLORS.purple}30, transparent)`,
        opacity: wipeO,
      }} />

      {/* Shockwave rings */}
      {([[r1s, r1o, COLORS.red], [r2s, r2o, COLORS.purple]] as [number, number, string][]).map(([s, o, c], i) => (
        <div key={i} style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          border: `2px solid ${c}`, transform: `scale(${s})`, opacity: o, pointerEvents: 'none',
        }} />
      ))}

      {/* Central glow halo */}
      <div style={{
        position: 'absolute', width: 640, height: 340, borderRadius: '50%',
        background: `radial-gradient(ellipse, ${COLORS.red}42 0%, ${COLORS.purple}20 46%, transparent 72%)`,
        filter: 'blur(65px)', opacity: gl * pulse,
      }} />

      {/* CROW wordmark */}
      <div style={{ display: 'flex', gap: 8, position: 'relative', zIndex: 2, alignItems: 'baseline' }}>
        {letters.map((l, i) => {
          const p = lProgs[i] ?? 0;
          return (
            <span key={i} style={{
              fontFamily: FONTS.primary,
              fontSize: 192,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: 8,
              opacity: interpolate(p, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px) scale(${interpolate(p, [0, 1], [0.68, 1])})`,
              background: COLORS.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 ${30 * gl}px ${COLORS.red}65)`,
            }}>{l}</span>
          );
        })}
      </div>

      {/* Full name tagline */}
      <div style={{
        position: 'absolute', top: '62%', left: SH, right: SH, textAlign: 'center',
        opacity: tagO, transform: `translateY(${tagY}px)`,
        fontFamily: FONTS.primary, fontSize: 17, fontWeight: 700,
        color: COLORS.textMuted, letterSpacing: 6,
      }}>{COPY.s3tag}</div>

      {/* Platform descriptor */}
      <div style={{
        position: 'absolute', top: '70%', left: SH, right: SH, textAlign: 'center',
        opacity: subO * 0.65, transform: `translateY(${subY}px)`,
        fontFamily: FONTS.primary, fontSize: 14, fontWeight: 600,
        color: COLORS.textMuted, letterSpacing: 3,
      }}>{COPY.s3sub}</div>
    </AbsoluteFill>
  );
};

// ─── Scene 4 · Channel Cards (480–1080) ───────────────────────────────────────
// Each channel shows WHAT THE PLATFORM LEARNS — not just that it tracks.
// Psychology: Specificity creates believability. Outcome-first framing.

const ChannelCard: React.FC<{
  channel: typeof COPY.s4Web | typeof COPY.s4Physical | typeof COPY.s4Social;
  enterAt: number;
  exitAt: number;
  variant: 'web' | 'physical' | 'social';
}> = ({ channel, enterAt, exitAt, variant }) => {
  const frame = useCurrentFrame();

  const enterProg = sp(frame, enterAt, { damping: 12, stiffness: 150 }, 36);
  const enterOp   = interpolate(enterProg, [0, 1], [0, 1]);
  const enterY    = interpolate(enterProg, [0, 1], [70, 0]);
  const exitOp    = fo(frame, exitAt, 24);
  const opacity   = Math.min(enterOp, exitOp);

  const gl = glow(frame, enterAt + 12, 40);
  const c  = channel.color;

  // Eyebrow
  const eyeO = fi(frame, enterAt + 4, enterAt + 18);

  // Headline
  const h1W = { opacity: fi(frame, enterAt + 18, enterAt + 34), translateY: fi(frame, enterAt + 18, enterAt + 34, 24, 0) };

  // Sub
  const subO = fi(frame, enterAt + 36, enterAt + 54);

  // Content items (chips / insights / agents) stagger in
  const items = variant === 'web'
    ? (channel as typeof COPY.s4Web).chips as readonly string[]
    : variant === 'physical'
    ? (channel as typeof COPY.s4Physical).insights as readonly string[]
    : (channel as typeof COPY.s4Social).sources as readonly string[];

  const itemDelays = items.map((_, i) => enterAt + 46 + i * 14);
  const itemOps    = itemDelays.map((d) => fi(frame, d, d + 16));
  const itemColors = [c, COLORS.purple, COLORS.cyan, COLORS.red, c];

  // Badge
  const badgeO = fi(frame, enterAt + items.length * 14 + 50, enterAt + items.length * 14 + 66);

  return (
    <AbsoluteFill style={{ opacity, transform: `translateY(${enterY}px)` }}>
      {/* Eyebrow */}
      <div style={{
        position: 'absolute', top: 140, left: SH,
        opacity: eyeO, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: c, boxShadow: `0 0 12px ${c}` }} />
        <span style={{ fontFamily: FONTS.primary, fontSize: 17, fontWeight: 800, color: c, letterSpacing: 7 }}>
          {channel.eye}
        </span>
      </div>

      {/* Headline */}
      <div style={{
        position: 'absolute', top: 192, left: SH, right: '44%',
        opacity: h1W.opacity, transform: `translateY(${h1W.translateY}px)`,
        fontFamily: FONTS.primary, fontSize: 68, fontWeight: 900,
        color: COLORS.text, lineHeight: 1.1, letterSpacing: -1, whiteSpace: 'pre-line',
      }}>{channel.head}</div>

      {/* Sub / outcome statement */}
      <div style={{
        position: 'absolute', top: '56%', left: SH, right: '42%',
        opacity: subO * 0.75,
        fontFamily: FONTS.primary, fontSize: 17, fontWeight: 600,
        color: COLORS.textMuted, letterSpacing: 3, lineHeight: 1.6,
      }}>{channel.sub}</div>

      {/* Right panel — items */}
      <div style={{
        position: 'absolute', top: 192, right: SH, width: 400,
        display: 'flex', flexDirection: 'column', gap: variant === 'physical' ? 16 : 14,
      }}>
        {items.map((item, i) => {
          const iOp  = itemOps[i] ?? 0;
          const iCol = variant === 'social' ? [COLORS.cyan, COLORS.red, COLORS.purple, COLORS.cyan, COLORS.purple][i] ?? c : c;
          return variant === 'physical' ? (
            /* Physical: insight rows with icon */
            <div key={i} style={{
              opacity: iOp,
              transform: `translateX(${interpolate(iOp, [0, 1], [32, 0])}px)`,
              ...glassCard(0.2),
              borderRadius: 12, padding: '14px 20px',
              borderLeft: `3px solid ${c}60`,
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                background: c, marginTop: 5, boxShadow: `0 0 8px ${c}`,
              }} />
              <span style={{
                fontFamily: FONTS.primary, fontSize: 18, fontWeight: 500,
                color: COLORS.text, opacity: 0.88, lineHeight: 1.4,
              }}>{item}</span>
            </div>
          ) : (
            /* Web chips / Social source chips */
            <div key={item} style={{
              opacity: iOp,
              transform: `translateX(${interpolate(iOp, [0, 1], [32, 0])}px)`,
              ...glassChip(0.55, iCol),
              padding: '13px 22px', borderRadius: 12,
              fontFamily: FONTS.primary, fontSize: 19, fontWeight: 700,
              color: iCol, letterSpacing: 3,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: iCol, boxShadow: `0 0 7px ${iCol}` }} />
              {item}
            </div>
          );
        })}
      </div>

      {/* LightSweep on reveal */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <LightSweep frame={frame} startFrame={enterAt + 20} duration={40} />
      </div>

      {/* Divider */}
      <div style={{ position: 'absolute', bottom: 196, left: SH, right: SH, height: 1, background: `${c}25` }} />

      {/* Badge */}
      <div style={{
        position: 'absolute', bottom: 136, left: SH, opacity: badgeO,
        ...glassChip(0.85, c),
        padding: '11px 22px', borderRadius: 40,
        fontFamily: FONTS.primary, fontSize: 15, fontWeight: 800, color: c, letterSpacing: 3,
      }}>{channel.badge}</div>
    </AbsoluteFill>
  );
};

const S4_Channels: React.FC = () => (
  <AbsoluteFill>
    <ChannelCard channel={COPY.s4Web}      enterAt={4}   exitAt={184} variant="web"      />
    <ChannelCard channel={COPY.s4Physical} enterAt={204} exitAt={384} variant="physical" />
    <ChannelCard channel={COPY.s4Social}   enterAt={404} exitAt={584} variant="social"   />
  </AbsoluteFill>
);

// ─── Scene 5 · Convergence + AI Proof (1080–1440) ────────────────────────────
// Psychology: Aha moment. Show the OUTCOME of having all 3 channels unified.
// The AI query demonstrates the exact value prop with a concrete, specific answer.

const S5_Convergence: React.FC = () => {
  const frame = useCurrentFrame();

  const gl    = glow(frame, 14, 55);
  const pulse = breathe(frame, 0.05, 0.1);

  // Headline
  const h1O = fi(frame, 6, 22);
  const h1Y = fi(frame, 6, 22, 26, 0);
  const h2Prog = sp(frame, 22, { damping: 8, stiffness: 140 }, 30);
  const h2O = interpolate(h2Prog, [0, 1], [0, 1]);
  const h2Y = interpolate(h2Prog, [0, 1], [24, 0]);

  // Three channel nodes
  const nodeDelays = [18, 28, 38];
  const nodeProgs  = nodeDelays.map((d) => sp(frame, d, SPRING_SNAP, 28));
  const nodeColors = [COLORS.cyan, COLORS.red, COLORS.purple];
  const nodeLabels = ['WEB', 'PHYSICAL', 'SOCIAL'] as const;
  const nodeAngles = [-115, 0, 115];
  const nodeRadius = 240;
  const cx = 960, cy = 610;

  const lineO = glow(frame, 50, 22);

  const nexusProg = sp(frame, 54, { damping: 7, stiffness: 120 }, 36);
  const nexusOp   = interpolate(nexusProg, [0, 1], [0, 1]);
  const nexusSc   = interpolate(nexusProg, [0, 1], [0.44, 1]);

  // AI Query section appears after nexus
  const queryO = fi(frame, 120, 145);
  const queryY = fi(frame, 120, 145, 20, 0);

  // Typewriter query
  const qLen   = COPY.s5query.length;
  const typed  = Math.floor(fi(frame, 148, 220, 0, qLen));
  const cursor = Math.sin(frame * 0.45) > 0 && typed < qLen;

  // Response
  const respO  = fi(frame, 226, 252);
  const respY  = fi(frame, 226, 252, 18, 0);

  // Agent badges
  const agentOps = [254, 266, 278].map((d) => fi(frame, d, d + 16));
  const agentColors = [COLORS.cyan, COLORS.purple, COLORS.red];

  const out = fo(frame, 330, 30);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* Headline */}
      <div style={{ position: 'absolute', top: 84, left: SH, right: SH, textAlign: 'center' }}>
        <div style={{
          opacity: h1O, transform: `translateY(${h1Y}px)`,
          fontFamily: FONTS.primary, fontSize: 86, fontWeight: 900, color: COLORS.text,
          lineHeight: 1.1, letterSpacing: -2,
        }}>{COPY.s5head1}</div>
        <div style={{
          opacity: h2O, transform: `translateY(${h2Y}px)`,
          fontFamily: FONTS.primary, fontSize: 86, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2,
          background: COLORS.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: `drop-shadow(0 0 ${22 * gl}px ${COLORS.red}45)`,
        }}>{COPY.s5head2}</div>
      </div>

      {/* SVG: connectors + nexus glow */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="s5-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.red} />
            <stop offset="50%" stopColor={COLORS.purple} />
            <stop offset="100%" stopColor={COLORS.cyan} />
          </linearGradient>
          <radialGradient id="s5-nexus" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.red} stopOpacity="0.45" />
            <stop offset="48%" stopColor={COLORS.purple} stopOpacity="0.22" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={166} fill="url(#s5-nexus)" opacity={nexusOp * pulse} />
        <circle cx={cx} cy={cy} r={184} fill="none" stroke="url(#s5-grad)"
          strokeWidth="1.5" opacity={nexusOp * 0.20} strokeDasharray="6 5" />
        {nodeAngles.map((angle, i) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          const nx = cx + nodeRadius * Math.cos(rad), ny = cy + nodeRadius * Math.sin(rad);
          const nOp = interpolate(nodeProgs[i] ?? 0, [0, 1], [0, 1]);
          return (
            <line key={i} x1={nx} y1={ny} x2={cx} y2={cy}
              stroke={nodeColors[i] ?? COLORS.text} strokeWidth="1.8"
              opacity={lineO * nOp * 0.4} strokeDasharray="7 5" />
          );
        })}
      </svg>

      {/* Channel nodes */}
      {nodeLabels.map((label, i) => {
        const angle = nodeAngles[i] ?? 0;
        const rad = ((angle - 90) * Math.PI) / 180;
        const nx = cx + nodeRadius * Math.cos(rad), ny = cy + nodeRadius * Math.sin(rad);
        const p  = nodeProgs[i] ?? 0;
        const c  = nodeColors[i] ?? COLORS.text;
        return (
          <div key={label} style={{
            position: 'absolute',
            left: nx - 58, top: ny - 26, width: 116, height: 52,
            opacity: interpolate(p, [0, 1], [0, 1]),
            transform: `scale(${interpolate(p, [0, 1], [0.46, 1])})`,
            ...glassChip(0.6, c), borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: FONTS.primary, fontSize: 18, fontWeight: 800, color: c, letterSpacing: 4 }}>{label}</span>
          </div>
        );
      })}

      {/* CROW nexus */}
      <div style={{
        position: 'absolute', left: cx - 72, top: cy - 72, width: 144, height: 144,
        opacity: nexusOp, transform: `scale(${nexusSc})`,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.red}30 0%, ${COLORS.purple}18 60%, transparent 100%)`,
        border: `2px solid ${COLORS.red}65`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 ${36 * gl * pulse}px ${COLORS.red}55, 0 0 ${72 * gl * pulse}px ${COLORS.purple}22`,
      }}>
        <span style={{
          fontFamily: FONTS.primary, fontSize: 36, fontWeight: 900,
          background: COLORS.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: 4,
        }}>CROW</span>
      </div>

      {/* AI Query section */}
      <div style={{
        position: 'absolute', top: 278, right: SH, width: 780,
        opacity: queryO, transform: `translateY(${queryY}px)`,
      }}>
        {/* Query label */}
        <div style={{
          fontFamily: FONTS.primary, fontSize: 13, fontWeight: 700,
          color: COLORS.textMuted, letterSpacing: 5, marginBottom: 12,
        }}>{COPY.s5queryLabel}</div>

        {/* Query card */}
        <div style={{
          ...glassCard(gl * 0.45), borderRadius: 18, padding: '22px 30px',
          borderLeft: `3px solid ${COLORS.cyan}`, marginBottom: 14,
          display: 'flex', alignItems: 'flex-start', gap: 14,
        }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 4 }}>
            <circle cx="11" cy="11" r="8" stroke={COLORS.cyan} strokeWidth="1.5" />
            <path d="m21 21-4.35-4.35" stroke={COLORS.cyan} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{
            fontFamily: FONTS.primary, fontSize: 21, fontWeight: 600,
            color: COLORS.text, fontStyle: 'italic', lineHeight: 1.5,
          }}>
            {COPY.s5query.slice(0, typed)}
            {cursor && <span style={{ color: COLORS.cyan, fontStyle: 'normal' }}>|</span>}
          </span>
        </div>

        {/* Response label */}
        <div style={{
          fontFamily: FONTS.primary, fontSize: 12, fontWeight: 700,
          color: COLORS.textMuted, letterSpacing: 5, marginBottom: 10,
          opacity: respO,
        }}>{COPY.s5responseLabel}</div>

        {/* Response card */}
        <div style={{
          opacity: respO, transform: `translateY(${respY}px)`,
          ...glassCard(0.2), borderRadius: 18, borderLeft: `3px solid ${COLORS.purple}`,
          padding: '20px 28px', display: 'flex', gap: 16, alignItems: 'flex-start',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0, marginTop: 2,
            background: `radial-gradient(circle, ${COLORS.purple}70, ${COLORS.red}40)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'white', opacity: 0.9 }} />
          </div>
          <span style={{
            fontFamily: FONTS.primary, fontSize: 16, fontWeight: 500,
            color: COLORS.text, lineHeight: 1.75, opacity: 0.92,
          }}>{COPY.s5response}</span>
        </div>

        {/* Agent badges */}
        <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
          {COPY.s5agents.map((a, i) => (
            <div key={a} style={{
              opacity: agentOps[i] ?? 0,
              transform: `translateY(${interpolate(agentOps[i] ?? 0, [0, 1], [8, 0])}px)`,
              ...glassChip(0.55, agentColors[i] ?? COLORS.cyan),
              padding: '8px 16px', borderRadius: 8,
              fontFamily: FONTS.primary, fontSize: 13, fontWeight: 700,
              color: agentColors[i] ?? COLORS.cyan, letterSpacing: 3,
            }}>{a}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6 · Scale + Trust (1440–1620) ──────────────────────────────────────
// Psychology: Authority and credibility signals. Specificity > generality.

const S6_Trust: React.FC = () => {
  const frame = useCurrentFrame();

  const tagW = { opacity: fi(frame, 6, 24), translateY: fi(frame, 6, 24, 16, 0) };

  const statDelays = [22, 36, 50, 64];
  const statProgs  = statDelays.map((d) => sp(frame, d, SPRING_SNAP, 26));
  const statColors = [COLORS.cyan, COLORS.red, COLORS.purple, COLORS.cyan];

  const badgeDelays = [96, 110, 124];
  const badgeOps    = badgeDelays.map((d) => fi(frame, d, d + 18));
  const badgeColors = [COLORS.cyan, COLORS.purple, COLORS.red];

  const infraO = fi(frame, 138, 156);

  const out = fo(frame, 154, 26);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* Tag */}
      <div style={{
        position: 'absolute', top: 148, left: SH, right: SH, textAlign: 'center',
        opacity: tagW.opacity, transform: `translateY(${tagW.translateY}px)`,
        fontFamily: FONTS.primary, fontSize: 20, fontWeight: 800,
        color: COLORS.textMuted, letterSpacing: 8,
      }}>{COPY.s6tag}</div>

      {/* Stat grid */}
      <div style={{
        position: 'absolute', top: 214, left: SH, right: SH,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
      }}>
        {COPY.s6stats.map((s, i) => {
          const p  = statProgs[i] ?? 0;
          const op = interpolate(p, [0, 1], [0, 1]);
          const sc = interpolate(p, [0, 1], [0.76, 1]);
          const c  = statColors[i] ?? COLORS.cyan;
          const g  = glow(frame, (statDelays[i] ?? 22) + 14, 26);
          return (
            <div key={s.l} style={{
              opacity: op, transform: `scale(${sc})`,
              ...glassCard(g * 0.4), borderRadius: 22, padding: '40px 20px', textAlign: 'center',
              borderTop: `2px solid ${c}50`,
              boxShadow: `0 0 ${28 * g}px ${c}20`,
            }}>
              <div style={{
                fontFamily: FONTS.primary, fontSize: 52, fontWeight: 900,
                color: c, lineHeight: 1, marginBottom: 12,
                filter: `drop-shadow(0 0 ${14 * g}px ${c}75)`,
              }}>{s.v}</div>
              <div style={{
                fontFamily: FONTS.primary, fontSize: 13, fontWeight: 800,
                color: COLORS.textMuted, letterSpacing: 4,
              }}>{s.l}</div>
            </div>
          );
        })}
      </div>

      {/* Trust badges */}
      <div style={{
        position: 'absolute', bottom: 160, left: SH, right: SH,
        display: 'flex', justifyContent: 'center', gap: 18,
      }}>
        {COPY.s6badges.map((b, i) => (
          <div key={b} style={{
            opacity: badgeOps[i] ?? 0,
            transform: `translateY(${interpolate(badgeOps[i] ?? 0, [0, 1], [10, 0])}px)`,
            ...gradientBorder(0.5), borderRadius: 40, padding: '12px 28px',
            fontFamily: FONTS.primary, fontSize: 15, fontWeight: 800,
            color: COLORS.text, letterSpacing: 4,
          }}>{b}</div>
        ))}
      </div>

      {/* Infra note */}
      <div style={{
        position: 'absolute', bottom: 96, left: SH, right: SH, textAlign: 'center',
        opacity: infraO * 0.5,
        fontFamily: FONTS.primary, fontSize: 14, fontWeight: 600,
        color: COLORS.textMuted, letterSpacing: 4,
      }}>{COPY.s6infra}</div>
    </AbsoluteFill>
  );
};

// ─── Scene 7 · CTA (1620–1800) ────────────────────────────────────────────────
// Psychology: Contrast principle — resolve the tension opened in S1.
// "Stop guessing" closes the loop. Direct, imperative, unambiguous.

const S7_CTA: React.FC = () => {
  const frame = useCurrentFrame();

  const gl    = glow(frame, 6, 50);
  const pulse = breathe(frame, 0.07, 0.12);

  // "STOP GUESSING." — heavy slam
  const l1Prog = sp(frame, 8, { damping: 7, stiffness: 220 }, 24);
  const l1O    = interpolate(l1Prog, [0, 1], [0, 1]);
  const l1Sc   = interpolate(l1Prog, [0, 1], [0.76, 1]);
  const l1Y    = interpolate(l1Prog, [0, 1], [40, 0]);

  // "START KNOWING." — gradient + glow
  const l2Prog = sp(frame, 26, { damping: 7, stiffness: 200 }, 28);
  const l2O    = interpolate(l2Prog, [0, 1], [0, 1]);
  const l2Sc   = interpolate(l2Prog, [0, 1], [0.76, 1]);
  const l2Y    = interpolate(l2Prog, [0, 1], [40, 0]);

  // URL
  const urlProg = sp(frame, 44, SPRING_SOFT, 30);
  const urlO    = interpolate(urlProg, [0, 1], [0, 1]);
  const urlY    = interpolate(urlProg, [0, 1], [18, 0]);

  // Divider sweep
  const divW = fi(frame, 60, 90, 0, 560);

  // End card
  const endO = fi(frame, 92, 112);

  // Final vignette tighten (cinematic close)
  const finalVig = fi(frame, 150, 180, 0, 0.35);

  return (
    <AbsoluteFill>
      {/* Radial halo */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at center, ${COLORS.red}20 0%, ${COLORS.purple}10 44%, transparent 70%)`,
        opacity: gl * pulse,
      }} />

      {/* "STOP GUESSING." */}
      <div style={{
        position: 'absolute', top: 260, left: SH, right: SH, textAlign: 'center',
        opacity: l1O, transform: `scale(${l1Sc}) translateY(${l1Y}px)`,
        fontFamily: FONTS.primary, fontSize: 96, fontWeight: 900,
        color: COLORS.text, lineHeight: 1.05, letterSpacing: -3,
      }}>{COPY.s7line1}</div>

      {/* "START KNOWING." */}
      <div style={{
        position: 'absolute', top: 376, left: SH, right: SH, textAlign: 'center',
        opacity: l2O, transform: `scale(${l2Sc}) translateY(${l2Y}px)`,
        fontFamily: FONTS.primary, fontSize: 96, fontWeight: 900,
        lineHeight: 1.05, letterSpacing: -3,
        background: COLORS.gradient,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        filter: `drop-shadow(0 0 ${30 * gl}px ${COLORS.red}55)`,
      }}>{COPY.s7line2}</div>

      {/* crowai.dev */}
      <div style={{
        position: 'absolute', top: 560, left: SH, right: SH, textAlign: 'center',
        opacity: urlO * (gl * 0.5 + 0.5),
        transform: `translateY(${urlY}px)`,
        fontFamily: FONTS.primary, fontSize: 54, fontWeight: 800,
        background: COLORS.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        letterSpacing: 6,
        filter: `drop-shadow(0 0 ${20 * gl * pulse}px ${COLORS.red}60)`,
      }}>{COPY.s7url}</div>

      {/* Sweep divider */}
      <div style={{
        position: 'absolute', top: 660, left: '50%', transform: 'translateX(-50%)',
        width: divW, height: 2, background: COLORS.gradient, borderRadius: 1,
        boxShadow: `0 0 12px ${COLORS.red}50`,
      }} />

      {/* End card */}
      <div style={{
        position: 'absolute', bottom: 72, left: SH, right: SH, textAlign: 'center',
        opacity: endO,
        fontFamily: FONTS.primary, fontSize: 20, fontWeight: 700,
        color: COLORS.textMuted, letterSpacing: 9, textTransform: 'uppercase',
      }}>{COPY.s7end}</div>

      {/* Cinematic final vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 50% 40% at center, transparent 20%, rgba(0,0,0,${finalVig * 0.8}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};

// ─── Transition Flash ──────────────────────────────────────────────────────────

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 5, 22], [0.3, 0.3, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: `linear-gradient(135deg, ${COLORS.red}16, ${COLORS.purple}0c, transparent)`,
      opacity: op,
    }} />
  );
};

// ─── 4K Scale Wrapper ─────────────────────────────────────────────────────────
// All content is authored in 1920 × 1080 space.
// CSS scale(2) scales every CSS, SVG and text element ×2 to fill 3840 × 2160.
// Because nothing is rasterised, the output is fully crisp 4K.

const ScaleWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
    <div style={{
      position: 'absolute',
      top: 0, left: 0,
      width: W,
      height: H,
      transformOrigin: '0 0',
      transform: 'scale(2)',
    }}>
      {children}
    </div>
  </div>
);

// ─── Root Composition ──────────────────────────────────────────────────────────

export const CrowAd_Hero: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <ScaleWrapper>
        {/* ── Persistent background layers ── */}
        <AuroraBackground seed="hero4k-aurora" opacity={0.14} />
        <Starfield        seed="hero4k" />
        <NoiseOverlay     id="hero4k-noise" />
        <ScanLines        opacity={0.015} />

        {/* ── Ambient glow orbs (slow drift across full 30s) ── */}
        <GlowOrb x={8}  y={12} size={480} color={COLORS.red}    speed={0.010} phase={0} />
        <GlowOrb x={86} y={72} size={420} color={COLORS.purple} speed={0.013} phase={2} />
        <GlowOrb x={50} y={50} size={320} color={COLORS.cyan}   speed={0.018} phase={4} />
        <GlowOrb x={18} y={82} size={280} color={COLORS.red}    speed={0.011} phase={6} />

        <AccentLines />

        {/* ── Transition flashes at scene boundaries ── */}
        {[116, 356, 476, 676, 876, 1076, 1436, 1616].map((f) => (
          <Sequence key={f} from={f} durationInFrames={28}><Flash /></Sequence>
        ))}

        {/* ── Scenes ── */}
        <Sequence from={0}    durationInFrames={120}>  <S1_Hook />        </Sequence>
        <Sequence from={120}  durationInFrames={240}>  <S2_Fractured />   </Sequence>
        <Sequence from={360}  durationInFrames={120}>  <S3_Reveal />      </Sequence>
        <Sequence from={480}  durationInFrames={600}>  <S4_Channels />    </Sequence>
        <Sequence from={1080} durationInFrames={360}>  <S5_Convergence /> </Sequence>
        <Sequence from={1440} durationInFrames={180}>  <S6_Trust />       </Sequence>
        <Sequence from={1620} durationInFrames={180}>  <S7_CTA />         </Sequence>

        <Vignette intensity={0.5} />

        {/* ── Background music ─────────────────────────────────────────
            bg-music.mp3 = 124.8s — covers the full 30s.
            Volume 0.28 leaves headroom for voiceover.
            startFrom=0, endAt=30s (1800 frames at 60fps → 30s).
        ─────────────────────────────────────────────────────────────── */}
        <Audio
          src={staticFile('audio/bg-music.mp3')}
          volume={(f: number) =>
            // Fade in over first 60 frames (1s), fade out over last 90 (1.5s)
            interpolate(f, [0, 60, 1710, 1800], [0, 0.28, 0.28, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />

        {/* ── Per-scene voiceover slots (uncomment when recorded) ──────
        <Sequence from={4}    durationInFrames={114}><Audio src={staticFile('audio/hero-s1.mp3')} volume={1} /></Sequence>
        <Sequence from={124}  durationInFrames={230}><Audio src={staticFile('audio/hero-s2.mp3')} volume={1} /></Sequence>
        <Sequence from={364}  durationInFrames={112}><Audio src={staticFile('audio/hero-s3.mp3')} volume={1} /></Sequence>
        <Sequence from={484}  durationInFrames={192}><Audio src={staticFile('audio/hero-s4a.mp3')} volume={1} /></Sequence>
        <Sequence from={684}  durationInFrames={192}><Audio src={staticFile('audio/hero-s4b.mp3')} volume={1} /></Sequence>
        <Sequence from={884}  durationInFrames={192}><Audio src={staticFile('audio/hero-s4c.mp3')} volume={1} /></Sequence>
        <Sequence from={1084} durationInFrames={350}><Audio src={staticFile('audio/hero-s5.mp3')} volume={1} /></Sequence>
        <Sequence from={1444} durationInFrames={172}><Audio src={staticFile('audio/hero-s6.mp3')} volume={1} /></Sequence>
        <Sequence from={1624} durationInFrames={172}><Audio src={staticFile('audio/hero-s7.mp3')} volume={1} /></Sequence>
        ─────────────────────────────────────────────────────────────── */}
      </ScaleWrapper>
    </AbsoluteFill>
  );
};
