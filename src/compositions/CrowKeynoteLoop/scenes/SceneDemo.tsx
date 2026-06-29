import React from 'react';
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { EASE } from '../../../design';
import { AppMock } from '../components/AppMock';
import { Bloom } from '../components/Bloom';
import { CinematicDataFlow } from '../components/CinematicDataFlow';
import { Cursor } from '../components/Cursor';
import { DataTunnel } from '../components/DataTunnel';

// Scene 5 — THE DEMO (self-contained, local frame 0..690).
//   app → zoom into input → type → cursor clicks send → DIVE through a TUNNEL of
//   streaming data into the backend → the cinematic data-flow → TUNNEL back out
//   to the chat → the answer returns in the app.
const QUESTION = 'Why did footfall spike on Tuesday?';
const INPUT_ORIGIN = '57.3% 60%';
const INPUT_SCREEN = { x: 1100, y: 648 };

const TYPE = [150, 270] as const;
const CURSOR_MOVE = [282, 306] as const;
const CLICK = 310;
const GRAPH_START = 372;
const ANSWER_IN = [632, 660] as const;
const ANSWER_OUT = [676, 690] as const;

const REST = { x: 1180, y: 760 };
const SEND = { x: 1551, y: 648 };

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function ramp(f: number, a: number, b: number): number {
  return interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}
function appScale(f: number): number {
  if (f < 60) return interpolate(f, [0, 60], [1.0, 1.05], { easing: EASE.inOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (f < 130) return interpolate(f, [60, 130], [1.05, 1.65], { easing: EASE.inOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (f < 330) return 1.65;
  return interpolate(f, [330, 400], [1.65, 2.15], { easing: EASE.in, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}

export const SceneDemo: React.FC = () => {
  const f = useCurrentFrame();

  const n = Math.floor(interpolate(f, [TYPE[0], TYPE[1]], [0, QUESTION.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const typed = QUESTION.slice(0, n);
  const typing = f >= TYPE[0] && f < TYPE[1];
  const caret = f < CURSOR_MOVE[0] && (typing || Math.sin(f * 0.35) > 0);

  const moveT = interpolate(f, [CURSOR_MOVE[0], CURSOR_MOVE[1]], [0, 1], { easing: EASE.inOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cx = lerp(REST.x, SEND.x, moveT);
  const cy = lerp(REST.y, SEND.y, moveT);
  const press = interpolate(f, [CLICK, CLICK + 3, CLICK + 10], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ripple = f >= CLICK && f < CLICK + 18 ? interpolate(f, [CLICK, CLICK + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const cursorOp = ramp(f, 118, 138) * (1 - ramp(f, 330, 348));
  const sendActive = f >= CLICK;

  const scale = appScale(f);
  const appOp = ramp(f, 0, 22) * (1 - ramp(f, 334, 376));
  const appBlur = interpolate(f, [334, 376], [0, 14], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // input lights, then we fly through the tunnel into the backend, then back out
  const inputBloom = ramp(f, CLICK + 6, CLICK + 44);
  const tunnelIn = ramp(f, 326, 356) * (1 - ramp(f, 398, 426));
  const tunnelOut = ramp(f, 566, 596) * (1 - ramp(f, 632, 658));

  const graphOp = ramp(f, 392, 428) * (1 - ramp(f, 566, 596));
  const graphScale = interpolate(f, [392, 452], [1.06, 1.0], { easing: EASE.out, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const answerOp = ramp(f, ANSWER_IN[0], ANSWER_IN[1]) * (1 - ramp(f, ANSWER_OUT[0], ANSWER_OUT[1]));

  return (
    <AbsoluteFill style={{ backgroundColor: '#040409' }}>
      {/* backend: deep-space data flow */}
      {graphOp > 0.001 && (
        <AbsoluteFill style={{ opacity: graphOp, transform: `scale(${graphScale})`, transformOrigin: 'center' }}>
          <Sequence from={GRAPH_START} layout="none">
            <CinematicDataFlow />
          </Sequence>
        </AbsoluteFill>
      )}

      {/* the app (zoomed) + cursor */}
      {appOp > 0.001 && (
        <AbsoluteFill style={{ opacity: appOp, transform: `scale(${scale})`, transformOrigin: INPUT_ORIGIN, filter: appBlur > 0.1 ? `blur(${appBlur}px)` : undefined }}>
          <AppMock typed={typed} caret={caret} sendActive={sendActive} />
          {cursorOp > 0.001 && <Cursor x={cx} y={cy} press={press} ripple={ripple} opacity={cursorOp} />}
        </AbsoluteFill>
      )}

      {/* input lights up as we dive in */}
      <Bloom x={INPUT_SCREEN.x} y={INPUT_SCREEN.y} progress={inputBloom} size={1000} peak={0.9} />

      {/* tunnel IN — data flying toward the backend */}
      {tunnelIn > 0.001 && <DataTunnel frame={f} dir={1} intensity={tunnelIn} seed="in" />}

      {/* tunnel OUT — data flying back to the chat */}
      {tunnelOut > 0.001 && <DataTunnel frame={f} dir={-1} intensity={tunnelOut} seed="out" />}

      {/* answer in the app */}
      {answerOp > 0.001 && (
        <AbsoluteFill style={{ opacity: answerOp }}>
          <AppMock mode="answer" answerReveal={1} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
