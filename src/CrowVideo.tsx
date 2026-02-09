import React from 'react';
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from 'remotion';
// eslint-disable-next-line deprecation/deprecation
import { Audio } from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { clockWipe } from '@remotion/transitions/clock-wipe';
import IntroScene from './scenes/IntroScene';
import ProblemScene from './scenes/ProblemScene';
import SolutionScene from './scenes/SolutionScene';
import FeaturesScene from './scenes/FeaturesScene';
import DashboardScene from './scenes/DashboardScene';
import CTAScene from './scenes/CTAScene';

// Voiceover audio files mapped to scene timing
const VOICEOVER = {
  intro: 'audio/intro.mp3',
  problem: 'audio/problem.mp3',
  solution: 'audio/solution.mp3',
  features: 'audio/features.mp3',
  dashboard: 'audio/dashboard.mp3',
  cta: 'audio/cta.mp3',
} as const;

// Transition duration (frames at 30fps)
const T = 30;

// Scene durations (in frames at 30fps)
const DURATIONS = {
  intro: 240,       // 8s
  problem: 300,     // 10s
  solution: 300,    // 10s
  features: 540,    // 18s
  dashboard: 240,   // 8s
  cta: 180,         // 6s
} as const;

// Scene start times accounting for transition overlaps:
// intro:     0
// problem:   240 - 30 = 210
// solution:  210 + 300 - 30 = 480
// features:  480 + 300 - 30 = 750
// dashboard: 750 + 540 - 30 = 1260
// cta:       1260 + 240 - 30 = 1470
// total:     1470 + 180 = 1650

const AUDIO_STARTS = {
  intro: 15,
  problem: 220,
  solution: 490,
  features: 765,
  dashboard: 1270,
  cta: 1480,
} as const;

export const CrowVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        filter: 'contrast(1.03) saturate(1.1) brightness(0.98)',
      }}
    >
      {/* Animated dual-tone background glow */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse at ${50 + Math.sin(frame * 0.015) * 10}% ${50 + Math.cos(frame * 0.012) * 8}%, rgba(0, 212, 255, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse at ${50 + Math.cos(frame * 0.018) * 12}% ${50 + Math.sin(frame * 0.01) * 10}%, rgba(124, 58, 237, 0.04) 0%, transparent 55%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Professional scene transitions via TransitionSeries */}
      <TransitionSeries>
        {/* Intro Scene */}
        <TransitionSeries.Sequence durationInFrames={DURATIONS.intro}>
          <IntroScene />
        </TransitionSeries.Sequence>

        {/* Intro -> Problem: Smooth crossfade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Problem Scene */}
        <TransitionSeries.Sequence durationInFrames={DURATIONS.problem}>
          <ProblemScene />
        </TransitionSeries.Sequence>

        {/* Problem -> Solution: Dramatic wipe reveals the answer */}
        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        {/* Solution Scene */}
        <TransitionSeries.Sequence durationInFrames={DURATIONS.solution}>
          <SolutionScene />
        </TransitionSeries.Sequence>

        {/* Solution -> Features: Slide up to reveal features */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        {/* Features Scene */}
        <TransitionSeries.Sequence durationInFrames={DURATIONS.features}>
          <FeaturesScene />
        </TransitionSeries.Sequence>

        {/* Features -> Dashboard: Clock wipe for a cinematic reveal */}
        <TransitionSeries.Transition
          presentation={clockWipe({ width: 1920, height: 1080 })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Dashboard Scene */}
        <TransitionSeries.Sequence durationInFrames={DURATIONS.dashboard}>
          <DashboardScene />
        </TransitionSeries.Sequence>

        {/* Dashboard -> CTA: Elegant fade for the closing */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* CTA Scene */}
        <TransitionSeries.Sequence durationInFrames={DURATIONS.cta}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Voiceover audio tracks - synced to TransitionSeries timing */}
      <Sequence from={AUDIO_STARTS.intro} durationInFrames={DURATIONS.intro}>
        <Audio src={staticFile(VOICEOVER.intro)} volume={0.9} />
      </Sequence>
      <Sequence from={AUDIO_STARTS.problem} durationInFrames={DURATIONS.problem}>
        <Audio src={staticFile(VOICEOVER.problem)} volume={0.9} />
      </Sequence>
      <Sequence from={AUDIO_STARTS.solution} durationInFrames={DURATIONS.solution}>
        <Audio src={staticFile(VOICEOVER.solution)} volume={0.9} />
      </Sequence>
      <Sequence from={AUDIO_STARTS.features} durationInFrames={DURATIONS.features}>
        <Audio src={staticFile(VOICEOVER.features)} volume={0.9} />
      </Sequence>
      <Sequence from={AUDIO_STARTS.dashboard} durationInFrames={DURATIONS.dashboard}>
        <Audio src={staticFile(VOICEOVER.dashboard)} volume={0.9} />
      </Sequence>
      <Sequence from={AUDIO_STARTS.cta} durationInFrames={DURATIONS.cta}>
        <Audio src={staticFile(VOICEOVER.cta)} volume={0.9} />
      </Sequence>

      {/* Global cinematic vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.2) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
