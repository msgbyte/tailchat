/**
 * 消息生命周期
 */
interface MessageEventMap {
  init: undefined; // 初始化阶段
  loaded: undefined; // 插件加载完毕
}

export function postMessageEvent<T extends keyof MessageEventMap>(
  eventType: T,
  eventData?: MessageEventMap[T]
) {
  window.postMessage(
    {
      _isTailchat: true,
      type: eventType,
      payload: eventData,
    },
    '*'
  );
}
