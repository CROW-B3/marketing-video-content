import React from 'react';
import { COLOR, DUR, FONT, REVEAL, TYPE } from '../../../design';
import { SCENE, SIGNAL_POS } from '../constants';
import { CrossDissolve } from '../components/CrossDissolve';
import { KineticTitle } from '../components/KineticTitle';

// Scene 2 — SET THE WORLD. Behaviour is everywhere and fragmented: three
// signals live apart in the dark, named once, each kept SHARP. ≤2 move at once.
export const SceneWorld: React.FC = () => (
  <CrossDissolve inAt={SCENE.world.in} outAt={SCENE.world.out - DUR.sceneCross}>
    {SIGNAL_POS.map((p, i) => (
      <div key={p.label} style={{ position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%, -50%)' }}>
        <KineticTitle
          appearAt={SCENE.world.in + DUR.sceneCross + i * REVEAL.lineStagger * 2}
          rise={REVEAL.riseSmall}
          style={{ textAlign: 'center' }}
        >
          <div
            style={{
              fontFamily: FONT.family,
              fontSize: TYPE.title.size,
              fontWeight: TYPE.title.weight,
              letterSpacing: TYPE.title.tracking,
              color: i === 1 ? COLOR.textPrimary : COLOR.textSecondary,
            }}
          >
            {p.label}
          </div>
          <div style={{ width: 32, height: 1, background: COLOR.line, margin: '16px auto 0' }} />
        </KineticTitle>
      </div>
    ))}
  </CrossDissolve>
);
