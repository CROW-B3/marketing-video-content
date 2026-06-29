import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { COLOR, FONT, LAYOUT, SPACE, TYPE } from '../../../design';

// The bookend end-card — IS the loop rest state (pixel-identical at f0 and f899).
// A small crow mark as a cinematic jewel (its red→purple gradient is the only
// colour; no glow, no shadow), the calm two-line tagline, a hairline, and a
// quiet brand+url. Lives at the optical center, slightly above true center.
export const CrowLockup: React.FC = () => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
    <div
      style={{
        position: 'absolute',
        top: `${LAYOUT.opticalCenterY * 100}%`,
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* mark — small jewel, no glow */}
      <Img src={staticFile('logo.png')} style={{ width: 148, height: 148, objectFit: 'contain' }} />

      {/* tagline — the calm statement, one thought per line */}
      <div style={{ marginTop: SPACE.lg, textAlign: 'center' }}>
        {['See everything.', 'Ask anything.'].map(line => (
          <div
            key={line}
            style={{
              fontFamily: FONT.family,
              fontSize: TYPE.display.size,
              fontWeight: TYPE.display.weight,
              letterSpacing: TYPE.display.tracking,
              lineHeight: TYPE.display.line,
              color: COLOR.textPrimary,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* hairline */}
      <div style={{ width: 200, height: 1, background: COLOR.lineStrong, marginTop: SPACE.xl }} />

      {/* brand + url */}
      <div
        style={{
          marginTop: SPACE.md,
          fontFamily: FONT.family,
          fontSize: TYPE.caption.size,
          fontWeight: TYPE.caption.weight,
          letterSpacing: 5,
          textTransform: 'uppercase',
          color: COLOR.textSecondary,
        }}
      >
        CROW
        {'   ·   '}
        crowai.dev
      </div>
    </div>
  </AbsoluteFill>
);
