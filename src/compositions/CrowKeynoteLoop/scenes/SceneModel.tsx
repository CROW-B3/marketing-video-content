import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLOR, DUR, FONT, LAYOUT, REVEAL, TYPE } from '../../../design';
import { SCENE } from '../constants';
import { CrossDissolve } from '../components/CrossDissolve';
import { BehaviourModelOrb } from '../components/BehaviourModelOrb';
import { KineticTitle } from '../components/KineticTitle';

// Scene 4 — ONE BEHAVIOUR MODEL. The convergence becomes ONE calm, tangible
// object shown once, big and centered, in soft depth of field. The concrete proof.
export const SceneModel: React.FC = () => {
  const start = SCENE.model.in + DUR.sceneCross;
  return (
    <CrossDissolve inAt={SCENE.model.in} outAt={SCENE.model.out - DUR.sceneCross}>
      <BehaviourModelOrb appearAt={start} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
        <div style={{ position: 'absolute', top: '74%', transform: 'translateY(-50%)', width: LAYOUT.contentMaxWidth, textAlign: 'center' }}>
          <KineticTitle
            appearAt={start + 34}
            style={{
              fontFamily: FONT.family,
              fontSize: TYPE.display.size,
              fontWeight: TYPE.display.weight,
              letterSpacing: TYPE.display.tracking,
              lineHeight: TYPE.display.line,
              color: COLOR.textPrimary,
            }}
          >
            One behaviour model.
          </KineticTitle>
          <KineticTitle
            appearAt={start + 34 + REVEAL.lineStagger * 2}
            rise={REVEAL.riseSmall}
            style={{
              marginTop: 20,
              fontFamily: FONT.family,
              fontSize: TYPE.headline.size,
              fontWeight: TYPE.headline.weight,
              letterSpacing: TYPE.headline.tracking,
              color: COLOR.textSecondary,
            }}
          >
            Three signals, one understanding.
          </KineticTitle>
        </div>
      </AbsoluteFill>
    </CrossDissolve>
  );
};
