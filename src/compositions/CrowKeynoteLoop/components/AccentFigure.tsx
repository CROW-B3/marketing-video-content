import React from 'react';
import { COLOR } from '../../../design';

// The single body-colour event: the lone proof figure in the accent purple.
// Keep it a FACT, not an infographic callout — colour only, no box/glow.
export const AccentFigure: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: COLOR.accent }}>{children}</span>
);
