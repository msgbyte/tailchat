import type { FocusLayoutProps } from '@livekit/components-react';
import React from 'react';
import { ParticipantTile } from './ParticipantTile';

export const FocusLayout: React.FC<FocusLayoutProps> = React.memo(
  ({ track, ...htmlProps }) => {
    return <ParticipantTile {...track} {...htmlProps} />;
  }
);
FocusLayout.displayName = 'FocusLayout';
