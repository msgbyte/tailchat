import { useEffect } from 'react';
import { useUpdateRef } from '../hooks/useUpdateRef';
import type { ChatMessage, SendMessagePayload } from '../model/message';
import { EventEmitter } from 'eventemitter-strict';
import type { UserBaseInfo, UserSettings } from '../model/user';

/**
 * 共享事件类型
 */
export interface SharedEventMap {
  /**
   * 登录成功
   */
  loginSuccess: (userInfo: UserBaseInfo) => void;

  /**
   * app加载成功
   */
  appLoaded: () => void;

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
   * 接受到消息(所有的(相对receiveUnmutedMessage来说))
   */
  receiveMessage: (payload: ChatMessage) => void;

  /**
   * 接受到未被静音的消息
   * 一般用于消息推送
   */
  receiveUnmutedMessage: (payload: ChatMessage) => void;

  /**
   * 群组面板状态更新
   */
  groupPanelBadgeUpdate: () => void;

  /**
   * 用户设置发生了变更
   */
  userSettingsUpdate: (userSettings: UserSettings) => void;
}
export type SharedEventType = keyof SharedEventMap;

const bus = new EventEmitter<SharedEventMap>();

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
