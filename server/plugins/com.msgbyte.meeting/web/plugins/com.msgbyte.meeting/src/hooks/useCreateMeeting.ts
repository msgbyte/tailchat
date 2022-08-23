import { useAsyncRequest, useCurrentUserInfo } from '@capital/common';
import { request } from '../request';

/**
 * 创建会议的hooks
 */
export function useCreateMeeting() {
  const userInfo = useCurrentUserInfo();
  const [{ loading }, createMeeting] = useAsyncRequest(async () => {
    const { data } = await request.post('create');

    const meetingUrl = data.url;

    // 临时方案, 数据可能会变更因此需要在外面包一层
    return {
      ...data,
      url: `${meetingUrl}?displayName=${userInfo.nickname}&avatarUrl=${userInfo.avatar}&from=tailchat`,
    };
  }, [userInfo]);

  return {
    loading,
    createMeeting,
  };
}
