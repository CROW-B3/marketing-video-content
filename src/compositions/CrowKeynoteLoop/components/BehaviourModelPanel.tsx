import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLOR, EASE, LAYOUT, RADIUS, REVEAL, SHADOW, SPRING } from '../../../design';

// One tasteful glass panel holding a single restrained curve that braids three
// strands into one — the concrete "one model" proof. Settles with SPRING.gentle
// (the one place physical mass is justified) and rack-focuses 16px → 0.
const PW = 640;
const PH = 320;

export const BehaviourModelPanel: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appearAt, fps, config: SPRING.gentle });
  const scale = interpolate(s, [0, 1], [0.965, 1]);
  const op = interpolate(frame, [appearAt, appearAt + REVEAL.opacityDur], [0, 1], {
    easing: EASE.soft,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const blur = interpolate(frame, [appearAt, appearAt + REVEAL.settleDur], [REVEAL.blurIn, 0], {
    easing: EASE.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const draw = interpolate(frame, [appearAt + 8, appearAt + 50], [0, 1], {
    easing: EASE.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
      <div
        style={{
          position: 'absolute',
          top: `${LAYOUT.opticalCenterY * 100}%`,
          transform: `translateY(-50%) scale(${scale})`,
          opacity: op,
          filter: blur > 0.01 ? `blur(${blur}px)` : undefined,
        }}
      >
        <div
          style={{
            width: PW,
            height: PH,
            borderRadius: RADIUS.lg,
            background: 'rgba(255,255,255,0.035)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: SHADOW.soft,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* edge-light rake */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(118deg, transparent 42%, rgba(255,255,255,0.07) 50%, transparent 58%)' }} />
          {/* faint accent wash behind the merged strand */}
          <div style={{ position: 'absolute', right: 80, top: '50%', width: 180, height: 180, transform: 'translateY(-50%)', borderRadius: '50%', background: `radial-gradient(circle, ${COLOR.accentSoft}, transparent 70%)`, filter: 'blur(26px)' }} />
          <svg width={PW} height={PH} viewBox={`0 0 ${PW} ${PH}`} style={{ position: 'absolute', inset: 0 }}>
            {[-72, 0, 72].map((dy, i) => (
              <path
                key={i}
                d={`M80,${160 + dy} C230,${160 + dy} 270,160 380,160`}
                fill="none"
                stroke={COLOR.textSecondary}
                strokeWidth={2}
                opacity={0.75}
                strokeDasharray={620}
                strokeDashoffset={620 * (1 - draw)}
              />
            ))}
            <path
              d="M380,160 L572,160"
              fill="none"
              stroke={COLOR.textPrimary}
              strokeWidth={3}
              strokeDasharray={220}
              strokeDashoffset={220 * (1 - draw)}
            />
            <circle cx={380} cy={160} r={4} fill={COLOR.textPrimary} opacity={draw} />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
