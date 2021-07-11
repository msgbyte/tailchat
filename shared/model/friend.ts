import { request } from '../api/request';

export interface FriendRequest {
  from: string;
  to: string;
  message: string;
}

/**
 * 发送好友请求
 * @param targetId 目标用户id
 */
export async function addFriendRequest(
  targetId: string
): Promise<FriendRequest> {
  const { data } = await request.post('/api/friend/request/add', {
    to: targetId,
  });

  return data;
}
