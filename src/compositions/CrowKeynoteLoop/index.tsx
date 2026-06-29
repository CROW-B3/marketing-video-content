import React from 'react';
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { COLOR, DUR, EASE } from '../../design';
import { CameraMove } from './components/CameraMove';
import { CrossDissolve } from './components/CrossDissolve';
import { CrowLockup } from './components/CrowLockup';
import { PersistentFooter } from './components/PersistentFooter';
import { SoftGradientBackground } from './components/SoftGradientBackground';
import { DURATION, SCENE, SEAM_HOLD } from './constants';
import { SceneDemo } from './scenes/SceneDemo';
import { SceneModel } from './scenes/SceneModel';
import { SceneOneIdea } from './scenes/SceneOneIdea';
import { SceneWatcher } from './scenes/SceneWatcher';
import { SceneWorld } from './scenes/SceneWorld';

// CROW — "It already saw it."  A 48s (1440f) Apple-grade black-keynote loop with
// a product-demo act at its centre. One continuous camera over the void scenes,
// cross-dissolves only; opens and closes on the identical motionless lockup.
//
//   1  0–60      LOCKUP / seam open       — the eye at rest
//   2  54–210    SET THE WORLD            — Online · In-store · Social
//   3  198–360   THE ONE IDEA             — "Three signals."
//   4  348–528   ONE BEHAVIOUR MODEL      — the braid / glass panel
//   5  516–1146  THE DEMO                 — app → type → click → behind-the-scenes → answer
//   6  1134–1266 THE WATCHER              — "It already saw it."
//   7  1254–1440 LOCKUP / seam close      — identical to frame 0
export const CrowKeynoteLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const openOp = interpolate(frame, [SEAM_HOLD, SCENE.lockupOpen.out], [1, 0], {
    easing: EASE.in,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.bg }}>
      {/* ── Void (keynote) scenes under one continuous camera ── */}
      <CameraMove>
        <SoftGradientBackground />

        {openOp > 0.001 && (
          <AbsoluteFill style={{ opacity: openOp }}>
            <CrowLockup />
          </AbsoluteFill>
        )}

        <SceneWorld />
        <SceneOneIdea />
        <SceneModel />
        <SceneWatcher />

        <CrossDissolve inAt={SCENE.lockupClose.in} inLen={DUR.lockupCross} outAt={DURATION} outLen={1}>
          <CrowLockup />
        </CrossDissolve>
      </CameraMove>

      {/* ── The demo act (own internal camera, on top of the void) ── */}
      <Sequence from={SCENE.demo.in} durationInFrames={SCENE.demo.len} layout="none">
        <SceneDemo />
      </Sequence>

      <PersistentFooter />
    </AbsoluteFill>
  );
};
