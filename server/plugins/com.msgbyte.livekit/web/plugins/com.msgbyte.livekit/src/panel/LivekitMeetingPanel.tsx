import React from 'react';
import { LivekitView } from '../components/LivekitView';
import { useParams } from 'react-router';
import { PLUGIN_ID } from '../consts';
import { useLivekitState } from '../store/useLivekitState';
import { NotFound } from '@capital/component';
import { Translate } from '../translate';

const LivekitMeetingPanel: React.FC = React.memo(() => {
  const { currentMeetingId, autoInviteIds } = useLivekitState();
  const { meetingId: paramsMeetingId } = useParams<{ meetingId?: string }>();

  const meetingId = paramsMeetingId || currentMeetingId;
  const url = paramsMeetingId
    ? `/${PLUGIN_ID}/meeting/${paramsMeetingId}`
    : `/main/personal/custom/${PLUGIN_ID}/livekitPersonMeeting`;

  if (!meetingId) {
    return (
      <div className="w-full h-full" style={{ paddingTop: 40 }}>
        <NotFound message={Translate.notFoundMeeting} />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <LivekitView
        className="w-full h-full"
        roomName={meetingId}
        url={url}
        autoInviteIds={autoInviteIds}
      />
    </div>
  );
});
LivekitMeetingPanel.displayName = 'LivekitMeetingPanel';

export default LivekitMeetingPanel;
