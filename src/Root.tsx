import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { CrowVideo } from './CrowVideo';

// Load Google Fonts globally
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadJetBrainsMono } from '@remotion/google-fonts/JetBrainsMono';

loadInter();
loadJetBrainsMono();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CrowMarketingVideo"
        component={CrowVideo}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

registerRoot(RemotionRoot);
