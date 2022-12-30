import posthog from 'posthog-js';
import { sharedEvent } from '@capital/common';

try {
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
      const d = window.localStorage['$TailchatInstalledPlugins'];
      if (!d) {
        posthog.capture('Report Plugin', {
          plugins: [],
          pluginNum: 0,
          pluginRaw: '',
        });
        return;
      }
      const storage = JSON.parse(d);
      const list = storage.rawData;
      if (!list || !Array.isArray(list)) {
        // 格式不匹配
        return;
      }

      posthog.capture('Report Plugin', {
        plugins: list.map((item) => item.name), // 主要收集名称列表
        pluginNum: list.length,
        pluginRaw: JSON.stringify(list), // 原始信息
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

  sharedEvent.on('appLoaded', () => {
    // 上报加载耗时
    posthog.capture('App Loaded', {
      usage: performance.now(),
    });
  });
} catch (err) {
  console.error(err);
}
