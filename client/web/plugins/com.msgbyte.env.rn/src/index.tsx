import {
  getGlobalState,
  sharedEvent,
  getCachedUserInfo,
  getCachedBaseGroupInfo,
} from '@capital/common';
import { Translate } from './translate';

const PLUGIN_NAME = 'ReactNative支持';

console.log(`Plugin ${PLUGIN_NAME} is loaded`);

/**
 * 转发事件
 */
function forwardSharedEvent(
  eventName: string,
  processPayload?: (payload: any) => Promise<{ type: string; payload: any }>
) {
  if (!(window as any).ReactNativeWebView) {
    return;
  }

  sharedEvent.on(eventName, async (payload: any) => {
    let type = eventName;
    if (processPayload) {
      const res = await processPayload(payload);
      payload = res.payload;
      type = res.type;
    }

    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({
        _isTailchat: true,
        type,
        payload,
      })
    );
  });
}

forwardSharedEvent('loadColorScheme');
forwardSharedEvent('receiveUnmutedMessage', async (payload) => {
  const message = payload;
  const currentUserId = getGlobalState()?.user.info._id;

  if (currentUserId === message.author) {
    // 忽略本人消息
    return;
  }

  const [userInfo, scopeName] = await Promise.all([
    getCachedUserInfo(message.author),
    message.groupId
      ? getCachedBaseGroupInfo(message.groupId).then((d) => d.name)
      : Promise.resolve(Translate.dm),
  ]);
  const nickname = userInfo?.nickname ?? '';
  const icon = userInfo?.avatar ?? undefined;
  const content = message.content;

  const title = `${Translate.from} [${scopeName}] ${nickname}`;
  const body = content;

  return {
    type: 'showNotification',
    payload: {
      title,
      body,
      icon,
    },
  };
});
