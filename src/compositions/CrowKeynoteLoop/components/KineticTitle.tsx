import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { EASE, REVEAL } from '../../../design';

// The opacity-led "settle" reveal. Opacity LEADS and finishes first (presence
// registers via brightness); a tiny translateY rise TRAILS and only "lands".
// Frame-driven only — never spring on type. All money-lines use this.
interface KineticTitleProps {
  children: React.ReactNode;
  appearAt: number; // global frame the reveal starts
  exitAt?: number; // optional opacity-led exit start
  rise?: number; // px (default REVEAL.rise)
  blurIn?: number; // px rack-focus start (0 = none)
  style?: React.CSSProperties;
}

export const KineticTitle: React.FC<KineticTitleProps> = ({
  children,
  appearAt,
  exitAt,
  rise = REVEAL.rise,
  blurIn = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const opIn = interpolate(frame, [appearAt, appearAt + REVEAL.opacityDur], [0, 1], {
    easing: EASE.soft,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opOut = exitAt == null
    ? 1
    : interpolate(frame, [exitAt, exitAt + REVEAL.exitDur], [1, 0], {
        easing: EASE.in,
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  const y = interpolate(frame, [appearAt, appearAt + REVEAL.settleDur], [rise, 0], {
    easing: EASE.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const blur = blurIn <= 0
    ? 0
    : interpolate(frame, [appearAt, appearAt + REVEAL.settleDur], [blurIn, 0], {
        easing: EASE.out,
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  return (
    <div
      style={{
        opacity: opIn * opOut,
        transform: `translateY(${y}px)`,
        filter: blur > 0.01 ? `blur(${blur}px)` : undefined,
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
