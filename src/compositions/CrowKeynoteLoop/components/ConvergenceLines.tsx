import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLOR, EASE } from '../../../design';

export interface Pt {
  x: number;
  y: number;
}

// Three clean hairlines easing from the scattered signal positions to one
// center node — three strokes, NEVER particles. The node is the seed that
// becomes the model and then the eye.
export const ConvergenceLines: React.FC<{
  from: Pt[];
  to: Pt;
  appearAt: number;
  drawDur?: number;
}> = ({ from, to, appearAt, drawDur = 40 }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [appearAt, appearAt + drawDur], [0, 1], {
    easing: EASE.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const nodeOp = interpolate(frame, [appearAt + drawDur - 10, appearAt + drawDur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        {from.map((p, i) => {
          const x = interpolate(draw, [0, 1], [p.x, to.x]);
          const y = interpolate(draw, [0, 1], [p.y, to.y]);
          return (
            <line
              key={i}
              x1={p.x}
              y1={p.y}
              x2={x}
              y2={y}
              stroke={COLOR.line}
              strokeWidth={1.25}
            />
          );
        })}
        <circle cx={to.x} cy={to.y} r={3} fill={COLOR.textPrimary} opacity={nodeOp} />
      </svg>
    </AbsoluteFill>
  );
};
