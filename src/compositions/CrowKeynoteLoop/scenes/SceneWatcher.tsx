import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { COLOR, DUR, EASE, FONT, LAYOUT, REVEAL, TYPE } from '../../../design';
import { SCENE } from '../constants';
import { CrossDissolve } from '../components/CrossDissolve';
import { KineticTitle } from '../components/KineticTitle';

// Scene 6 — THE WATCHER. The pull-back begins; the model resolves back into the
// crow's watching eye. The personality, stated once and quietly.
export const SceneWatcher: React.FC = () => {
  const frame = useCurrentFrame();
  const start = SCENE.watcher.in + DUR.sceneCross;
  const markOp = interpolate(frame, [start, start + REVEAL.settleDur], [0, 1], {
    easing: EASE.soft,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <CrossDissolve inAt={SCENE.watcher.in} outAt={SCENE.watcher.out - DUR.sceneCross}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
        <div style={{ position: 'absolute', left: '50%', top: '37%', transform: 'translate(-50%, -50%)', opacity: markOp }}>
          <Img src={staticFile('logo.png')} style={{ width: 124, height: 124, objectFit: 'contain' }} />
        </div>
        <div style={{ position: 'absolute', top: '58%', transform: 'translateY(-50%)', width: LAYOUT.contentMaxWidth, textAlign: 'center' }}>
          <KineticTitle
            appearAt={start + 12}
            style={{
              fontFamily: FONT.family,
              fontSize: TYPE.display.size,
              fontWeight: TYPE.display.weight,
              letterSpacing: TYPE.display.tracking,
              lineHeight: TYPE.display.line,
              color: COLOR.textPrimary,
            }}
          >
            It already saw it.
          </KineticTitle>
        </div>
      </AbsoluteFill>
    </CrossDissolve>
  );
};
