import { TailchatMeetingClient } from 'tailchat-meeting-sdk';
import { showToasts } from '@capital/common';

/**
 * 初始化会话客户端
 */
export function initMeetingClient(signalingHost: string, userId: string) {
  const client = new TailchatMeetingClient(signalingHost, userId);

  client.on('clientClose', () => {
    showToasts('会话已断开', 'info');
  });

  return client;
}
