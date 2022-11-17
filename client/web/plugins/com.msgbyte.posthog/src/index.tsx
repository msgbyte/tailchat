import posthog from 'posthog-js';

posthog.init('phc_xRCv3qbbOBMQkz31kbYMngXxn7Ey5JMu0BZIFktO6km', {
  api_host: 'https://app.posthog.com',
  autocapture: false, // 关闭autocapture以节约事件用量
  disable_session_recording: true, // 关闭自动录屏(不需要且一直报错)
});

const PLUGIN_NAME = 'posthog';

console.log(`Plugin ${PLUGIN_NAME} is loaded`);

setTimeout(() => {
  console.log('Report plugin install status');

  const storage = JSON.parse(window.localStorage['$TailchatInstalledPlugins']);
  try {
    posthog.capture('Report Plugin', {
      plugins: storage.rawData,
      pluginNum: Array.isArray(storage.rawData) ? storage.rawData.length : 0,
    });
  } catch (err) {
    posthog.capture('Report Plugin error', {
      err: String(err),
      storage,
    });
  }
}, 2000);
