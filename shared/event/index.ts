import { EventEmitter } from 'events';

/**
 * 共享事件类型
 */
export interface SharedEventMap {
  /**
   * 修改配色方案
   */
  loadColorScheme: (schemeName: string) => void;
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
