import React from 'react';
import { AbsoluteFill } from 'remotion';
import { AppMock } from './components/AppMock';

// Dev-only preview of the app mock chrome (with a typed question + active send).
export const CrowAppPreview: React.FC = () => (
  <AbsoluteFill>
    <AppMock typed="Why did footfall spike on Tuesday?" caret sendActive />
  </AbsoluteFill>
);
