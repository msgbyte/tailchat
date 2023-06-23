import {
  regCustomPanel,
  regChatInputButton,
  postMessageEvent,
} from '@capital/common';
import { Icon } from '@capital/component';
import React from 'react';
import { DeviceInfoPanel } from './DeviceInfoPanel';
import { Translate } from './translate';

const PLUGIN_NAME = 'Electron Support';

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
