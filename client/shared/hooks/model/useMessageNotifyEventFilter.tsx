import { sharedEvent, useSharedEventHandler } from '../../event';
import { useUserNotifyMute } from './useUserSettings';

/**
 * 消息通知翻译
 * 检查用户设置，接受已读消息并发送未静音消息
 *
 * 接收到消息事件{receiveMessage} -> 检查是否被静音 -> 没有静音，发送{receiveUnmutedMessage}事件
 *                                             -> 静音, 不做任何处理
 */
export function useMessageNotifyEventFilter() {
  const { checkIsMuted } = useUserNotifyMute();

  useSharedEventHandler('receiveMessage', (payload) => {
    if (!payload) {
      return;
    }

    if (!checkIsMuted(payload.converseId, payload.groupId)) {
      sharedEvent.emit('receiveUnmutedMessage', payload);
    }
  });
}
