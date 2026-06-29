import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
} from 'remotion';
import {
  ACCENT,
  AnamorphicFlare,
  BoothBackground,
  ChannelWord,
  clamp,
  COLORS,
  CountUp,
  CrowLogo,
  envelope,
  FONTS,
  FPS,
  glassCard,
  glassChip,
  Hero,
  lerp,
  loop01,
  loopWave,
  SignalLane,
  TOTAL,
  TypeQuery,
  Vignette,
  WatcherMark,
} from './booth-shared';
import { CameraMotionBlur } from '@remotion/motion-blur';
import { CinematicGrade, EnergyStreaks, LightRays, Shockwave } from './booth-vfx';

// Lane vertical anchors (Web top / CCTV middle / Social bottom).
const LANE_Y = { web: 300, cctv: 540, social: 780 } as const;

// ─── Per-lane focus over the whole 960-frame timeline ────────────────────────
//  0.14 = dormant stub (S1/S8 seam rest) · 0.16 = dimmed · 1 = hero focus.

function webFocus(f: number): number {
  return interpolate(
    f,
    [0, 119, 120, 160, 210, 232, 345, 360, 510, 629, 665, 700, 884, 908, 960],
    [0.14, 0.14, 0.16, 0.5, 0.5, 1.0, 1.0, 0.16, 0.16, 0.9, 0.6, 0.0, 0.0, 0.14, 0.14],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
}
function cctvFocus(f: number): number {
  return interpolate(
    f,
    [0, 119, 120, 160, 210, 232, 360, 384, 495, 510, 629, 665, 700, 884, 908, 960],
    [0.14, 0.14, 0.16, 0.5, 0.5, 0.16, 0.16, 1.0, 1.0, 0.16, 0.9, 0.6, 0.0, 0.0, 0.14, 0.14],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
}
function socialFocus(f: number): number {
  return interpolate(
    f,
    [0, 119, 120, 160, 210, 232, 510, 534, 615, 629, 665, 700, 884, 908, 960],
    [0.14, 0.14, 0.16, 0.5, 0.5, 0.16, 0.16, 1.0, 1.0, 0.95, 0.6, 0.0, 0.0, 0.14, 0.14],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
}

// ─── Lane system + convergence + center pulse + watcher mark ─────────────────

const LaneSystem: React.FC = () => {
  const frame = useCurrentFrame();

  // During the channel beats the focused lane glides toward screen-centre.
  const webY = lerp(LANE_Y.web, 540, clamp(webFocus(frame) - 0.16, 0, 1) / 0.84 * (frame < 360 ? 1 : 0));
  const cctvY = LANE_Y.cctv;
  const socialY = lerp(LANE_Y.social, 540, clamp(socialFocus(frame) - 0.16, 0, 1) / 0.84 * (frame > 500 && frame < 630 ? 1 : 0));

  // Centre pulse line: born from the convergence, carries S6→S7→S8.
  const pulseOp = envelope(frame, 700, 724, 892, 910);
  const pulseWobble = loopWave(frame, 6) * 4;
  const dotX = 960 + loopWave(frame, 2) * 760;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <SignalLane y={webY} color={ACCENT.web} focus={webFocus(frame)} seed="lane-web" />
      <SignalLane y={cctvY} color={ACCENT.cctv} focus={cctvFocus(frame)} seed="lane-cctv" />
      <SignalLane y={socialY} color={ACCENT.social} focus={socialFocus(frame)} seed="lane-social" />

      {/* convergence money-shot — motion-blurred energy streaks */}
      <CameraMotionBlur shutterAngle={180} samples={6}>
        <EnergyStreaks start={632} end={708} />
      </CameraMotionBlur>

      {/* unified centre pulse line */}
      {pulseOp > 0.001 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 540 + pulseWobble, height: 3, opacity: pulseOp }}>
          <div
            style={{
              position: 'absolute',
              left: 160,
              right: 160,
              height: 3,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${ACCENT.core}, #ffffff 50%, ${ACCENT.core}, transparent)`,
              boxShadow: `0 0 18px ${ACCENT.core}, 0 0 40px ${ACCENT.web}88`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: dotX,
              top: -4,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: `0 0 18px #fff, 0 0 36px ${ACCENT.core}`,
            }}
          />
        </div>
      )}

      <WatcherMark opacity={envelope(frame, 138, 176, 628, 664)} />
    </AbsoluteFill>
  );
};

// ─── Generic two-line headline (white, read-from-5m) ─────────────────────────

const Headline: React.FC<{
  lines: [string, string];
  appearAt: number;
  vanishAt: number;
  size?: number;
  top?: number;
  accent?: string;
}> = ({ lines, appearAt, vanishAt, size = 150, top = 300, accent }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', top, left: 140, right: 140, textAlign: 'center' }}>
      {lines.map((line, i) => {
        const a = appearAt + i * 8;
        const intro = spring({ frame: frame - a, fps: FPS, config: { damping: 22, stiffness: 170 }, durationInFrames: 18 });
        const y = interpolate(intro, [0, 1], [26, 0]);
        const op = envelope(frame, a, a + 14, vanishAt, vanishAt + 16);
        const highlight = i === 1 && accent;
        return (
          <div
            key={i}
            style={{
              fontFamily: FONTS.primary,
              fontSize: size,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.04,
              opacity: op,
              transform: `translateY(${y}px)`,
              color: highlight ? undefined : COLORS.text,
              ...(highlight
                ? {
                    background: COLORS.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: `drop-shadow(0 0 30px ${accent}55)`,
                  }
                : { textShadow: '0 0 40px rgba(0,0,0,0.7), 0 0 24px rgba(139,92,246,0.25)' }),
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};

// ─── Bottom "live data" support strip (per channel) ──────────────────────────

const SupportStrip: React.FC<{
  appearAt: number;
  vanishAt: number;
  children: React.ReactNode;
}> = ({ appearAt, vanishAt, children }) => {
  const frame = useCurrentFrame();
  const op = envelope(frame, appearAt, appearAt + 16, vanishAt, vanishAt + 14);
  const y = interpolate(frame, [appearAt, appearAt + 18], [24, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 150,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        opacity: op,
        transform: `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
};

// ─── Artifact: funnel (Web) ──────────────────────────────────────────────────

const FunnelArtifact: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const widths = [320, 232, 150];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
      {widths.map((w, i) => {
        const grow = spring({ frame: frame - (appearAt + i * 6), fps: FPS, config: { damping: 16, stiffness: 160 }, durationInFrames: 18 });
        const isDrop = i === 2;
        return (
          <div
            key={i}
            style={{
              width: w * grow,
              height: 18,
              borderRadius: 5,
              background: isDrop
                ? `linear-gradient(90deg, ${ACCENT.web}, ${ACCENT.web}33)`
                : `linear-gradient(90deg, ${ACCENT.web}cc, ${ACCENT.web}66)`,
              boxShadow: `0 0 14px ${ACCENT.web}66`,
              opacity: 0.6 + grow * 0.4,
            }}
          />
        );
      })}
    </div>
  );
};

// ─── Artifact: heatmap (CCTV) ────────────────────────────────────────────────

const HeatmapArtifact: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const cols = 9;
  const rows = 4;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 22px)`, gridTemplateRows: `repeat(${rows}, 22px)`, gap: 4 }}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const cx = i % cols;
        const cy = Math.floor(i / cols);
        // two hot-spots, breathing live
        const d1 = Math.hypot(cx - 3, cy - 1);
        const d2 = Math.hypot(cx - 6, cy - 2.5);
        const heat = clamp(1 - Math.min(d1, d2) / 3.5, 0, 1);
        const breathe = loop01(frame, 8, TOTAL, i) * 0.25 + 0.75;
        const reveal = interpolate(frame, [appearAt, appearAt + 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const v = heat * breathe * reveal;
        return (
          <div
            key={i}
            style={{
              width: 22,
              height: 22,
              borderRadius: 4,
              background: v > 0.05 ? `rgba(0,212,255,${0.12 + v * 0.85})` : 'rgba(255,255,255,0.04)',
              boxShadow: v > 0.5 ? `0 0 ${10 * v}px ${ACCENT.cctv}` : 'none',
            }}
          />
        );
      })}
    </div>
  );
};

// ─── Artifact: sentiment spike (Social) ──────────────────────────────────────

const SpikeArtifact: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [appearAt, appearAt + 36], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const spike = spring({ frame: frame - (appearAt + 40), fps: FPS, config: { damping: 11, stiffness: 200 }, durationInFrames: 22 });
  const peakY = interpolate(spike, [0, 1], [70, 8]);
  const glintOp = interpolate(frame, [appearAt + 42, appearAt + 50, appearAt + 64], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flatPath = 'M0,60 L60,58 L120,62 L180,57 L240,60';
  const fullPath = `M0,60 L60,58 L120,62 L180,57 L240,60 L300,${peakY.toFixed(1)} L360,30 L420,40`;
  return (
    <svg width={420} height={90} viewBox="0 0 420 90" style={{ overflow: 'visible' }}>
      <path d={fullPath} fill="none" stroke={ACCENT.social} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={520} strokeDashoffset={520 * (1 - draw)} style={{ filter: `drop-shadow(0 0 8px ${ACCENT.social})` }} />
      <circle cx={300} cy={peakY} r={6} fill="#fff" opacity={draw > 0.8 ? 1 : 0} style={{ filter: `drop-shadow(0 0 10px ${ACCENT.social})` }} />
      <circle cx={300} cy={peakY} r={13} fill="none" stroke={ACCENT.social} strokeWidth={2} opacity={glintOp} />
    </svg>
  );
};

const RegionPill: React.FC<{ label: string; idx: number; appearAt: number }> = ({ label, idx, appearAt }) => {
  const frame = useCurrentFrame();
  const drift = loopWave(frame, 2, TOTAL, idx) * 6;
  const op = interpolate(frame, [appearAt + idx * 8, appearAt + 16 + idx * 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        ...glassChip(0.4, ACCENT.cctv),
        padding: '8px 18px',
        borderRadius: 30,
        fontFamily: FONTS.primary,
        fontSize: 22,
        fontWeight: 700,
        color: ACCENT.cctv,
        letterSpacing: 3,
        transform: `translateY(${drift}px)`,
        opacity: op,
      }}
    >
      {label}
    </div>
  );
};

// ─── Scene 6: convergence node + reform logo ─────────────────────────────────

const ConvergeNode: React.FC = () => {
  const frame = useCurrentFrame();
  const bloom = spring({ frame: frame - 700, fps: FPS, config: { damping: 13, stiffness: 150 }, durationInFrames: 26 });
  const coreScale = interpolate(bloom, [0, 1], [0.2, 1]);
  const coreOp = envelope(frame, 695, 712, 742, 760);
  const logoOp = envelope(frame, 712, 736, 752, 770);
  const logoScale = interpolate(
    spring({ frame: frame - 712, fps: FPS, config: { damping: 14, stiffness: 140 }, durationInFrames: 24 }),
    [0, 1],
    [0.6, 1],
  );
  const rayInt = interpolate(frame, [698, 712, 744], [0, 0.85, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flareInt = interpolate(frame, [700, 713, 742], [0, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <LightRays cx={960} cy={540} intensity={rayInt} />
      <Shockwave cx={960} cy={540} start={701} color="#ffffff" />
      <AnamorphicFlare cx={960} cy={540} width={1280} color="#cfe0ff" intensity={flareInt} />
      {/* localized bloom (flash-safe, <10% full-frame luminance) */}
      {coreOp > 0.001 && (
        <div
          style={{
            position: 'absolute',
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: `radial-gradient(circle, #ffffff 0%, ${ACCENT.core}cc 28%, ${ACCENT.web}44 55%, transparent 72%)`,
            transform: `scale(${coreScale})`,
            opacity: coreOp,
            filter: 'blur(4px)',
          }}
        />
      )}
      {logoOp > 0.001 && (
        <div style={{ opacity: logoOp, transform: `scale(${logoScale})`, marginTop: -40 }}>
          <CrowLogo size={150} glow={0.9} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─── Scene 7: AI analyst card ────────────────────────────────────────────────

const AICard: React.FC = () => {
  const frame = useCurrentFrame();
  const cardOp = envelope(frame, 752, 776, 850, 868);
  const cardY = interpolate(frame, [752, 776], [28, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const insure = spring({ frame: frame - 808, fps: FPS, config: { damping: 20, stiffness: 150 }, durationInFrames: 22 });
  const insightOp = interpolate(insure, [0, 1], [0, 1]);
  const insightY = interpolate(insure, [0, 1], [16, 0]);
  const glint = interpolate(frame, [812, 820, 836], [0, 1, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        top: 600,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: cardOp,
        transform: `translateY(${cardY}px)`,
      }}
    >
      <div style={{ ...glassCard(0.4), borderRadius: 22, padding: '30px 44px', width: 1180, maxWidth: '80%' }}>
        {/* query row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width={30} height={30} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={ACCENT.cctv} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <TypeQuery text="Why did footfall spike in Colombo?" start={760} end={802} color={ACCENT.cctv} size={32} />
        </div>
        {/* insight row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 24,
            paddingTop: 22,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            opacity: insightOp,
            transform: `translateY(${insightY}px)`,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              flexShrink: 0,
              background: `radial-gradient(circle, ${ACCENT.core}, ${ACCENT.web})`,
              boxShadow: `0 0 ${14 + glint * 16}px ${ACCENT.cctv}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            ✦
          </div>
          <span style={{ fontFamily: FONTS.primary, fontSize: 34, fontWeight: 700, color: COLORS.text }}>
            Social spike
            {' '}
            <span style={{ color: ACCENT.muted }}>→</span>
            {' '}
            in-store queue
            {' '}
            <span style={{ color: ACCENT.cctv, filter: `drop-shadow(0 0 10px ${ACCENT.cctv})` }}>+22%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  Main composition
// ════════════════════════════════════════════════════════════════════════════

export const CrowBoothLoop: React.FC = () => {
  const frame = useCurrentFrame();

  // Hero opacity envelopes — both ends settle to the IDENTICAL rest lockup.
  const openHeroOp = interpolate(frame, [102, 122], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const closeHeroOp = interpolate(frame, [864, 892], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', fontFamily: FONTS.primary }}>
      <BoothBackground />
      <LaneSystem />

      {/* S1 — opening hero lockup + hook flourish (this is the seam) */}
      {openHeroOp > 0.001 && (
        <div style={{ opacity: openHeroOp }}>
          <Hero frame={frame} flourish />
        </div>
      )}

      {/* S2 — split / the problem */}
      <Headline lines={['THREE SIGNALS.', 'SCATTERED.']} appearAt={130} vanishAt={196} size={140} top={360} />

      {/* S3 — WEB */}
      <ChannelWord word="WEB" sub="FUNNELS · DROP-OFF · SESSIONS" color={ACCENT.web} appearAt={216} vanishAt={346} />
      <SupportStrip appearAt={250} vanishAt={344}>
        <FunnelArtifact appearAt={252} />
        <CountUp start={236} end={330} from={6120} to={12480} label="SESSIONS" color={ACCENT.cctv} suffix=" ↗" />
      </SupportStrip>

      {/* S4 — CCTV */}
      <ChannelWord word="CCTV" sub="FOOTFALL · QUEUES · HEATMAPS" color={ACCENT.cctv} appearAt={366} vanishAt={496} />
      <SupportStrip appearAt={400} vanishAt={494}>
        <HeatmapArtifact appearAt={402} />
        <CountUp start={386} end={480} from={1740} to={3902} label="FOOTFALL" color={ACCENT.cctv} suffix=" ↑" />
      </SupportStrip>

      {/* S5 — SOCIAL */}
      <ChannelWord word="SOCIAL" sub="MENTIONS · SENTIMENT · SPIKES" color={ACCENT.social} appearAt={516} vanishAt={616} />
      <SupportStrip appearAt={548} vanishAt={616}>
        <SpikeArtifact appearAt={544} />
        <CountUp start={520} end={600} from={42} to={318} label="MENTIONS" color={ACCENT.cctv} prefix="+" suffix="% ▲" />
        <RegionPill label="COLOMBO" idx={0} appearAt={556} />
        <RegionPill label="KANDY" idx={1} appearAt={556} />
      </SupportStrip>

      {/* S6 — convergence money-shot */}
      <ConvergeNode />
      <Headline lines={['THREE SIGNALS.', 'ONE MODEL.']} appearAt={704} vanishAt={748} size={110} top={664} accent={ACCENT.core} />

      {/* S7 — AI analyst (cross-channel proof) */}
      <Headline lines={['ASK.', 'IT ALREADY SAW IT.']} appearAt={760} vanishAt={852} size={120} top={250} />
      <AICard />

      {/* S8 — closing hero lockup → invisible seam */}
      {closeHeroOp > 0.001 && (
        <div style={{ opacity: closeHeroOp }}>
          <Hero frame={frame} flourish={false} />
        </div>
      )}

      <Vignette intensity={0.55} />
      <CinematicGrade />
    </AbsoluteFill>
  );
};
