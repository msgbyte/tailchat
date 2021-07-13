import { request } from '../api/request';

export interface FriendRequest {
  _id: string;
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

/**
 * 同意好友请求
 * @param requestId 好友请求ID
 */
export async function acceptFriendRequest(requestId: string): Promise<void> {
  await request.post('/api/friend/request/accept', {
    requestId,
  });
}

/**
 * 拒绝好友请求
 * @param requestId 好友请求ID
 */
export async function denyFriendRequest(requestId: string): Promise<void> {
  await request.post('/api/friend/request/deny', {
    requestId,
  });
}

/**
 * 取消好友请求
 * @param requestId 好友请求ID
 */
export async function cancelFriendRequest(requestId: string): Promise<void> {
  await request.post('/api/friend/request/cancel', {
    requestId,
  });
}
