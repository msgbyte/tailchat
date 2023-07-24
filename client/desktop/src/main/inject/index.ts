import { app } from 'electron';

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
        label: 'Electron Support',
        'label.zh-CN': 'Electron 支持',
        name: 'com.msgbyte.env.electron',
        url: '/plugins/com.msgbyte.env.electron/index.js',
        version: '0.0.0',
        author: 'moonrailgun',
        description: 'Add support for Electron environment in Tailchat',
        'description.zh-CN': '在 Tailchat 添加对 Electron 环境的支持',
        requireRestart: true,
      });
  }`;

  const raw = `(${inner})()`;
  return raw;
}

export function generateInjectedScript(): string {
  return [generateDeviceInfo()].join(';');
}

function getPlatform() {
  if (process.platform === 'darwin') {
    return 'mac';
  } else if (process.platform === 'win32') {
    return 'windows';
  } else if (process.platform === 'linux') {
    return 'linux';
  } else {
    return process.platform;
  }
}

function generateDeviceInfo() {
  return `window.__electronDeviceInfo = { version: "${app.getVersion()}", name: "${app.getName()}", platform: "${getPlatform()}" }`;
}
