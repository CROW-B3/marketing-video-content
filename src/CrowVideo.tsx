import React from 'react';
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from 'remotion';
// eslint-disable-next-line deprecation/deprecation
import { Audio } from 'remotion';
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

// Scene timing (in frames at 30fps)
const SCENES = {
  intro: { start: 0, duration: 240 },        // 0-8s
  problem: { start: 240, duration: 300 },     // 8-18s
  solution: { start: 540, duration: 300 },    // 18-28s
  features: { start: 840, duration: 540 },    // 28-46s
  dashboard: { start: 1380, duration: 240 },  // 46-54s
  cta: { start: 1620, duration: 180 },        // 54-60s
} as const;

export const CrowVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        filter: 'contrast(1.03) saturate(1.08) brightness(0.98)',
      }}
    >
      {/* Animated background glow - subtle shifting radial gradient */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${50 + Math.sin(frame * 0.02) * 8}% ${50 + Math.cos(frame * 0.015) * 6}%, rgba(0, 212, 255, 0.05) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Sequence from={SCENES.intro.start} durationInFrames={SCENES.intro.duration}>
        <IntroScene />
      </Sequence>

      <Sequence from={SCENES.problem.start} durationInFrames={SCENES.problem.duration}>
        <ProblemScene />
      </Sequence>

      <Sequence from={SCENES.solution.start} durationInFrames={SCENES.solution.duration}>
        <SolutionScene />
      </Sequence>

      <Sequence from={SCENES.features.start} durationInFrames={SCENES.features.duration}>
        <FeaturesScene />
      </Sequence>

      <Sequence from={SCENES.dashboard.start} durationInFrames={SCENES.dashboard.duration}>
        <DashboardScene />
      </Sequence>

      <Sequence from={SCENES.cta.start} durationInFrames={SCENES.cta.duration}>
        <CTAScene />
      </Sequence>

      {/* Voiceover audio tracks - synced to each scene */}
      <Sequence from={SCENES.intro.start + 15} durationInFrames={SCENES.intro.duration}>
        <Audio src={staticFile(VOICEOVER.intro)} volume={0.9} />
      </Sequence>
      <Sequence from={SCENES.problem.start + 10} durationInFrames={SCENES.problem.duration}>
        <Audio src={staticFile(VOICEOVER.problem)} volume={0.9} />
      </Sequence>
      <Sequence from={SCENES.solution.start + 10} durationInFrames={SCENES.solution.duration}>
        <Audio src={staticFile(VOICEOVER.solution)} volume={0.9} />
      </Sequence>
      <Sequence from={SCENES.features.start + 15} durationInFrames={SCENES.features.duration}>
        <Audio src={staticFile(VOICEOVER.features)} volume={0.9} />
      </Sequence>
      <Sequence from={SCENES.dashboard.start + 10} durationInFrames={SCENES.dashboard.duration}>
        <Audio src={staticFile(VOICEOVER.dashboard)} volume={0.9} />
      </Sequence>
      <Sequence from={SCENES.cta.start + 10} durationInFrames={SCENES.cta.duration}>
        <Audio src={staticFile(VOICEOVER.cta)} volume={0.9} />
      </Sequence>

      {/* Global subtle vignette overlay - cinematic edge darkening */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.15) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Scene transition overlays - smooth dip-to-black between scenes */}
      {Object.values(SCENES).map((scene, i) => {
        if (i === 0) return null;
        const transitionStart = scene.start - 20;
        const transitionEnd = scene.start + 20;
        if (frame >= transitionStart && frame <= transitionEnd) {
          const progress = (frame - transitionStart) / 40;
          // Smooth ease-in-out using sine curve: 0 -> 0.6 -> 0
          const opacity = Math.sin(progress * Math.PI) * 0.6;
          return (
            <AbsoluteFill
              key={i}
              style={{
                backgroundColor: '#0a0a0f',
                opacity,
                pointerEvents: 'none',
              }}
            />
          );
        }
        return null;
      })}
    </AbsoluteFill>
  );
};
