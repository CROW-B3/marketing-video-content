import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { EASE } from '../../design';
import { AppMock } from './components/AppMock';
import { Cursor } from './components/Cursor';

// Preview of the demo's input choreography: type the question → caret →
// cursor glides to the send button → press + ripple → send activates.
// Timings are deliberate (Apple-paced); the real demo scene reuses this logic.
const QUESTION = 'Why did footfall spike on Tuesday?';

export const TYPE_START = 10;
export const TYPE_END = 64; // ~0.85 chars/frame over 33 chars (deliberate)
export const MOVE_START = TYPE_END + 12;
export const MOVE_END = MOVE_START + 18;
export const CLICK = MOVE_END + 3;

// Input/send-button positions in the 1920×1080 app frame.
const SEND = { x: 1551, y: 648 };
const REST = { x: 1180, y: 690 };

export function typedText(frame: number): string {
  const n = Math.floor(
    interpolate(frame, [TYPE_START, TYPE_END], [0, QUESTION.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  return QUESTION.slice(0, n);
}

export const CrowDemoAskPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = typedText(frame);
  const typing = frame >= TYPE_START && frame < TYPE_END;
  const caret = frame < MOVE_START && (typing || Math.sin(frame * 0.35) > 0);

  const moveT = interpolate(frame, [MOVE_START, MOVE_END], [0, 1], {
    easing: EASE.inOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cx = interpolate(moveT, [0, 1], [REST.x, SEND.x]);
  const cy = interpolate(moveT, [0, 1], [REST.y, SEND.y]);
  const press = interpolate(frame, [CLICK, CLICK + 3, CLICK + 9], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ripple = frame >= CLICK && frame < CLICK + 18
    ? interpolate(frame, [CLICK, CLICK + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const sendActive = frame >= CLICK;

  return (
    <AbsoluteFill>
      <AppMock typed={typed} caret={caret} sendActive={sendActive} />
      <Cursor x={cx} y={cy} press={press} ripple={ripple} />
    </AbsoluteFill>
  );
};
