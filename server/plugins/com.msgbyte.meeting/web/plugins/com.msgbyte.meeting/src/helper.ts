import { getJWTUserInfo, sendMessage } from '@capital/common';
import { request } from './request';

/**
 * 创建会议与分享
 */
export async function createMeetingAndShare(groupId: string, panelId: string) {
  const userInfo = await getJWTUserInfo();
  const { data } = await request.post('create');
  const meetingId = data.roomId;
  const fullUrl = `${location.origin}/plugin/meeting/${meetingId}`;

  // 临时方案, 数据可能会变更因此需要在外面包一层
  window.open(fullUrl);

  sendMessage({
    groupId,
    converseId: panelId,
    content: `${userInfo.nickname} 发起了通话，点击链接快速加入会议: ${fullUrl}`,
  });
}
