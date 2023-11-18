import React from 'react';
import { PureLivekitView } from '../components/LivekitView';
import { useParams } from 'react-router';

const LivekitMeetingPanel: React.FC = React.memo(() => {
  const { meetingId } = useParams<{ meetingId: string }>();

  return (
    <div className="w-full h-full">
      <PureLivekitView roomName={meetingId} />
    </div>
  );
});
LivekitMeetingPanel.displayName = 'LivekitMeetingPanel';

export default LivekitMeetingPanel;
