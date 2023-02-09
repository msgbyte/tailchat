// @ts-nocheck

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
        label: 'ReactNative支持',
        name: 'com.msgbyte.env.rn',
        url: '/plugins/com.msgbyte.env.rn/index.js',
        version: '0.0.0',
        author: 'moonrailgun',
        description: '在Tailchat添加对ReactNative环境的支持',
        requireRestart: true,
      });
  }`;

  const raw = `(${inner})()`;
  return raw;
}

export function generatePostMessageScript() {
  return `window.postMessage = function (data) {
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
  };`;
}
