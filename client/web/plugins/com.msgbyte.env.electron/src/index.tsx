import {
  regCustomPanel,
  regChatInputButton,
  postMessageEvent,
  sharedEvent,
  regPluginSettings,
  getCachedUserSettings,
} from '@capital/common';
import { Icon } from '@capital/component';
import React from 'react';
import { DeviceInfoPanel } from './DeviceInfoPanel';
import { Translate } from './translate';
import { forwardSharedEvent } from './utils';
import { checkUpdate } from './checkUpdate';
import { setWebviewKernel, resetWebviewKernel } from '@capital/common';
import { ElectronWebview } from './ElectronWebview';
import './overwrite.css';

const PLUGIN_NAME = 'Electron Support';
const WEBVIEW_CONFIG = 'electron:nativeWebviewRender';

console.log(`Plugin ${PLUGIN_NAME} is loaded`);

regCustomPanel({
  position: 'setting',
  icon: '',
  name: 'com.msgbyte.env.electron/deviceInfoPanel',
  label: Translate.deviceInfo,
  render: DeviceInfoPanel,
});

regChatInputButton({
  render: () => {
    return (
      <Icon
        className="text-2xl cursor-pointer"
        icon="mdi:content-cut"
        rotate={3}
        onClick={() => {
          postMessageEvent('callScreenshotsTool');
        }}
      />
    );
  },
});

regPluginSettings({
  position: 'system',
  type: 'boolean',
  name: WEBVIEW_CONFIG,
  label: Translate.nativeWebviewRender,
  desc: Translate.nativeWebviewRenderDesc,
});

forwardSharedEvent('receiveUnmutedMessage');

setTimeout(() => {
  checkUpdate();
}, 1000);

let changedWithElectron = false;

const checkSettingConfig = (settings: Record<string, any>) => {
  if (settings[WEBVIEW_CONFIG] === true) {
    setWebviewKernel(() => ElectronWebview);
    changedWithElectron = true;
  } else if (changedWithElectron === true) {
    // 如果关闭了配置且仅当之前用electron设置了webview，则重置
    resetWebviewKernel();
  }
};

sharedEvent.on('loginSuccess', () => {
  getCachedUserSettings().then((settings) => {
    checkSettingConfig(settings);
  });
});

sharedEvent.on('userSettingsUpdate', (settings) => {
  checkSettingConfig(settings);
});

navigator.mediaDevices.getDisplayMedia = async (
  options: DisplayMediaStreamOptions
) => {
  const source = await (
    window as any
  ).electron.ipcRenderer.getDesktopCapturerSource();

  const stream = await window.navigator.mediaDevices.getUserMedia({
    // audio: options.audio,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id,
      },
    } as any,
  });

  return stream;
};
