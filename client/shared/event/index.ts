import { EventEmitter } from 'events';
import { useEffect } from 'react';
import { useUpdateRef } from '../hooks/useUpdateRef';
import type { ChatMessage, SendMessagePayload } from '../model/message';

/**
 * 共享事件类型
 */
export interface SharedEventMap {
  /**
   * 修改配色方案
   */
  loadColorScheme: (schemeName: string) => void;

  /**
   * 网络状态更新
   */
  updateNetworkStatus: (
    status: 'connected' | 'reconnecting' | 'disconnected'
  ) => void;

  /**
   * 发送消息
   */
  sendMessage: (payload: SendMessagePayload) => void;

  /**
   * 回复消息事件
   *
   * 如果为null则是清空
   */
  replyMessage: (payload: ChatMessage | null) => void;

  /**
   * 消息已读(消息出现在界面上)
   */
  readMessage: (payload: ChatMessage | null) => void;

  /**
   * 群组面板状态更新
   */
  groupPanelBadgeUpdate: () => void;
}
export type SharedEventType = keyof SharedEventMap;

const bus = new EventEmitter();

/**
 * 事件中心
 */
export const sharedEvent = {
  on<T extends SharedEventType>(eventName: T, listener: SharedEventMap[T]) {
    bus.on(eventName, listener);
  },
  off<T extends SharedEventType>(eventName: T, listener: SharedEventMap[T]) {
    bus.off(eventName, listener);
  },
  emit<T extends SharedEventType>(
    eventName: T,
    ...args: Parameters<SharedEventMap[T]>
  ) {
    bus.emit(eventName, ...args);
  },
};

export function useSharedEventHandler<
  T extends SharedEventType,
  H extends SharedEventMap[T]
>(eventName: T, handler: H) {
  const handlerRef = useUpdateRef(handler);

  useEffect(() => {
    const _handler: SharedEventMap[T] = (...args: any[]) => {
      (handlerRef.current as any)(...args);
    };

    sharedEvent.on(eventName, _handler);

    return () => {
      sharedEvent.off(eventName, _handler);
    };
  }, []);
}
