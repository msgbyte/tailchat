import React from 'react';
import { useAsync } from '@capital/common';
import { Button, LoadingSpinner } from '@capital/component';
import { request } from '../request';
import { useCreateMeeting } from '../hooks/useCreateMeeting';

/**
 * 视频会议面板
 */
const MeetingPanel: React.FC = React.memo(() => {
  const { loading, createMeeting } = useCreateMeeting();
  const handleCreate = async () => {
    const { url } = await createMeeting();
    window.open(url);
  };

  const { loading: availableLoading, value: available } = useAsync(async () => {
    const { data } = await request.get('available');

    return data;
  }, []);

  if (availableLoading) {
    return <LoadingSpinner />;
  }

  if (!available) {
    return <div>音视频服务不可用</div>;
  }

  return (
    <div style={{ padding: 10 }}>
      <Button type="primary" loading={loading} onClick={handleCreate}>
        快速发起会议
      </Button>
    </div>
  );
});
MeetingPanel.displayName = 'MeetingPanel';

export default MeetingPanel;
