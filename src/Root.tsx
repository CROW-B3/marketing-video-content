import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { CrowVideo } from './CrowVideo';
import { CrowLayersReel } from './CrowLayersReel';
import { CrowReel_ClicksToIntent } from './CrowReel_ClicksToIntent';
import { CrowReel_PlugAIIntoReality } from './CrowReel_PlugAIIntoReality';
import { CrowReel_3MonthsLater } from './CrowReel_3MonthsLater';
import { CrowAd_Hero } from './CrowAd_Hero';

// Load Google Fonts globally
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadJetBrainsMono } from '@remotion/google-fonts/JetBrainsMono';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';

loadInter();
loadJetBrainsMono();
loadSora();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CrowMarketingVideo"
        component={CrowVideo}
        durationInFrames={1650}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CrowLayersReel"
        component={CrowLayersReel}
        durationInFrames={690}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CrowReel-ClicksToIntent"
        component={CrowReel_ClicksToIntent}
        durationInFrames={950}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CrowReel-PlugAIIntoReality"
        component={CrowReel_PlugAIIntoReality}
        durationInFrames={1000}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CrowReel-3MonthsLater"
        component={CrowReel_3MonthsLater}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CrowAd-Hero"
        component={CrowAd_Hero}
        durationInFrames={1800}
        fps={60}
        width={3840}
        height={2160}
      />
    </>
  );
};

registerRoot(RemotionRoot);
