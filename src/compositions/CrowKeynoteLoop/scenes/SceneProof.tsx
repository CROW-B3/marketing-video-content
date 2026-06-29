import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLOR, DUR, FONT, LAYOUT, REVEAL, TYPE } from '../../../design';
import { SCENE } from '../constants';
import { AccentFigure } from '../components/AccentFigure';
import { CrossDissolve } from '../components/CrossDissolve';
import { KineticTitle } from '../components/KineticTitle';

// Scene 5 — QUIET PROOF. One plain-language question, a beat of silence, one
// specific certain cross-channel answer (social → store). "2,300" is the lone
// colour event. "footfall" / "store visits" stay tack-sharp so the meaning lands.
export const SceneProof: React.FC = () => {
  const start = SCENE.proof.in + DUR.sceneCross;
  const answerAt = start + DUR.hold + DUR.slow; // question holds, then a silent beat
  const qStyle: React.CSSProperties = {
    fontFamily: FONT.family,
    fontSize: TYPE.title.size,
    fontWeight: TYPE.title.weight,
    letterSpacing: TYPE.title.tracking,
    lineHeight: 1.25,
  };
  return (
    <CrossDissolve inAt={SCENE.proof.in} outAt={SCENE.proof.out - DUR.sceneCross}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
        <div style={{ position: 'absolute', top: '40%', transform: 'translateY(-50%)', width: 1320, textAlign: 'center' }}>
          <KineticTitle appearAt={start} style={{ ...qStyle, color: COLOR.textSecondary }}>
            Why did footfall spike on Tuesday?
          </KineticTitle>
        </div>
        <div style={{ position: 'absolute', top: '57%', transform: 'translateY(-50%)', width: 1320, textAlign: 'center' }}>
          <KineticTitle appearAt={answerAt} rise={REVEAL.riseSmall} style={{ ...qStyle, color: COLOR.textPrimary }}>
            A social mention drove
            {' '}
            <AccentFigure>2,300</AccentFigure>
            {' '}
            store visits.
          </KineticTitle>
        </div>
      </AbsoluteFill>
    </CrossDissolve>
  );
};
