import React from 'react';

// A controlled radial bloom (violet → white) that swells and fades — NOT a harsh
// flash. Used for the push-through transition and the answer reconvergence.
export const Bloom: React.FC<{
  x: number;
  y: number;
  progress: number; // 0..1 (swells then fades via a sine envelope)
  size?: number;
  color?: string;
  peak?: number; // max opacity
}> = ({ x, y, progress, size = 1500, color = '#c4b5fd', peak = 1 }) => {
  if (progress <= 0.001 || progress >= 1) return null;
  const scale = 0.18 + progress * 1.05;
  const op = Math.sin(progress * Math.PI) * peak;
  const core = 3 + progress * 7;
  const mid = 16 + progress * 12;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: '50%',
        background: `radial-gradient(circle, #ffffff ${core}%, ${color} ${mid}%, ${color}00 56%)`,
        transform: `scale(${scale})`,
        opacity: op,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        filter: 'blur(2px)',
      }}
    />
  );
};
