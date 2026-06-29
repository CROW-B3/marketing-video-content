import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLOR } from '../../../design';

// The committed near-black void. One static, frozen radial vignette toward
// COLOR.bgElevated behind the hero cluster for depth — NO drift, so the loop
// seam has zero moving variables.
export const SoftGradientBackground: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLOR.bg }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(58% 50% at 50% 46%, ${COLOR.bgElevated} 0%, ${COLOR.bg} 72%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background: 'radial-gradient(92% 82% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)',
      }}
    />
  </AbsoluteFill>
);
