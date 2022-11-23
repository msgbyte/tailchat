import posthog from 'posthog-js';
import { sharedEvent } from '@capital/common';

posthog.init('phc_xRCv3qbbOBMQkz31kbYMngXxn7Ey5JMu0BZIFktO6km', {
  api_host: 'https://app.posthog.com',
  autocapture: false, // 关闭autocapture以节约事件用量
  disable_session_recording: true, // 关闭自动录屏(不需要且一直报错)
});

const PLUGIN_NAME = 'posthog';

console.log(`Plugin ${PLUGIN_NAME} is loaded`);

setTimeout(() => {
  console.log('Report plugin install status');

  try {
    const storage = JSON.parse(
      window.localStorage['$TailchatInstalledPlugins']
    );
    posthog.capture('Report Plugin', {
      plugins: storage.rawData,
      pluginNum: Array.isArray(storage.rawData) ? storage.rawData.length : 0,
    });
  } catch (err) {
    // Ignore error
  }
}, 2000);

sharedEvent.on('loginSuccess', (userInfo) => {
  posthog.identify(userInfo._id, {
    email: userInfo.email,
    username: `${userInfo.nickname}#${userInfo.discriminator}`,
    avatar: userInfo.avatar,
    temporary: userInfo.temporary,
  });
});
