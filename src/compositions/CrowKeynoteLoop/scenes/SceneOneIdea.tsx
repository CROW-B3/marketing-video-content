import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLOR, DUR, FONT, LAYOUT, TYPE } from '../../../design';
import { NODE, SCENE, SIGNAL_POS } from '../constants';
import { CrossDissolve } from '../components/CrossDissolve';
import { ConvergenceLines } from '../components/ConvergenceLines';
import { KineticTitle } from '../components/KineticTitle';

// Scene 3 — THE ONE IDEA. The three scattered labels collapse inward as three
// hairlines toward one node; the headline resolves in the same optical column.
export const SceneOneIdea: React.FC = () => (
  <CrossDissolve inAt={SCENE.oneIdea.in} outAt={SCENE.oneIdea.out - DUR.sceneCross}>
    <ConvergenceLines
      from={SIGNAL_POS.map(p => ({ x: p.x, y: p.y }))}
      to={NODE}
      appearAt={SCENE.oneIdea.in + DUR.sceneCross}
      drawDur={48}
    />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
      <div
        style={{
          position: 'absolute',
          top: `${LAYOUT.opticalCenterY * 100}%`,
          transform: 'translateY(-50%)',
          width: LAYOUT.contentMaxWidth,
          textAlign: 'center',
        }}
      >
        <KineticTitle
          appearAt={SCENE.oneIdea.in + DUR.sceneCross + 42}
          style={{
            fontFamily: FONT.family,
            fontSize: TYPE.hero.size,
            fontWeight: TYPE.hero.weight,
            letterSpacing: TYPE.hero.tracking,
            lineHeight: TYPE.hero.line,
            color: COLOR.textPrimary,
          }}
        >
          Three signals.
        </KineticTitle>
      </div>
    </AbsoluteFill>
  </CrossDissolve>
);
