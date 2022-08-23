import React from 'react';
import type { Peer } from 'tailchat-meeting-sdk';
import { Avatar } from '@capital/component';

interface PeerViewProps {
  peer: Peer;
}
export const PeerView: React.FC<PeerViewProps> = React.memo((props) => {
  const { peer } = props;

  return (
    <div>
      <Avatar size={92} src={peer.picture} name={peer.displayName} />
    </div>
  );
});
PeerView.displayName = 'PeerView';
