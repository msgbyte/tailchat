import React from 'react';
import { useAsync, getJWTUserInfo } from '@capital/common';
import { request } from './request';
import { LoadingSpinner } from '@capital/component';
import _get from 'lodash/get';
import { useParams } from 'react-router';

function useMeetingContext() {
  const { loading, value } = useAsync(async () => {
    const { data } = await request.get('url');
    const userInfo = await getJWTUserInfo();

    return { tailchatMeetingUrl: data.tailchatMeetingUrl, userInfo };
  }, []);

  return {
    loading,
    tailchatMeetingUrl: value?.tailchatMeetingUrl,
    userInfo: value?.userInfo,
  };
}

const MeetingUrlWrapper: React.FC = React.memo(() => {
  const params = useParams<{ meetingId: string }>();
  const { loading, tailchatMeetingUrl, userInfo } = useMeetingContext();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!tailchatMeetingUrl) {
    return <div>视频会议页面加载失败</div>;
  }

  const meetingId = _get(params, 'meetingId');
  if (!meetingId) {
    return <div>视频会议号加载失败</div>;
  }

  return (
    <iframe
      style={{ width: '100%', height: '100%' }}
      src={`${tailchatMeetingUrl}/room/${meetingId}?displayName=${userInfo.nickname}&avatarUrl=${userInfo.avatar}&from=tailchat`}
    />
  );
});
MeetingUrlWrapper.displayName = 'MeetingUrlWrapper';

export default MeetingUrlWrapper;
