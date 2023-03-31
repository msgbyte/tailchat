import { getVersion, getReadableVersion } from 'react-native-device-info';

/**
 * 生成注入到Webview中的js代码
 */
export function generateInstallPluginScript() {
  /**
   * manifest copy from:
   * com.msgbyte.env.rn/manifest.json
   */
  const inner = `function main() {
    window.tailchat
      .installPlugin({
        label: 'React Native Support',
        'label.zh-CN': 'ReactNative 支持',
        name: 'com.msgbyte.env.rn',
        url: '/plugins/com.msgbyte.env.rn/index.js',
        version: '0.0.0',
        author: 'moonrailgun',
        description: 'Add support for ReactNative environment in Tailchat',
        'description.zh-CN': '在 Tailchat 添加对 ReactNative 环境的支持',
        requireRestart: true,
      });
  }`;

  const raw = `(${inner})()`;
  return raw;
}

export function generateInjectedScript(): string {
  return [generateDeviceInfo(), generatePostMessageScript()].join(';');
}

function generateDeviceInfo() {
  return `window.__rnDeviceInfo = { version: "${getVersion()}", readableVersion: "${getReadableVersion()}" }`;
}

function generatePostMessageScript() {
  return `window.postMessage = function (data) {
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
  };`;
}
