import {
  getGlobalState,
  getCachedUserInfo,
  getCachedBaseGroupInfo,
  getMessageTextDecorators,
  getServiceUrl,
  regCustomPanel,
} from '@capital/common';
import { DeviceInfoPanel } from './DeviceInfoPanel';
import { Translate } from './translate';
import { forwardSharedEvent } from './utils';

const PLUGIN_NAME = 'ReactNative Support';

console.log(`Plugin ${PLUGIN_NAME} is loaded`);

regCustomPanel({
  position: 'setting',
  icon: '',
  name: 'com.msgbyte.env.rn/deviceInfoPanel',
  label: Translate.deviceInfo,
  render: DeviceInfoPanel,
});

forwardSharedEvent('loadColorScheme');
forwardSharedEvent('loginSuccess', async (payload) => {
  let token = window.localStorage.getItem('jsonwebtoken');
  try {
    token = JSON.parse(token).rawData;
  } catch (e) {}

  if (typeof token !== 'string') {
    console.error('Cannot get token:', token);
    return;
  }

  return {
    type: 'bindWebsocket',
    payload: {
      url: getServiceUrl(),
      token,
      userInfo: payload,
    },
  };
});
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
  const body = getMessageTextDecorators().serialize(content);

  return {
    type: 'showNotification',
    payload: {
      title,
      body,
      icon,
    },
  };
});
