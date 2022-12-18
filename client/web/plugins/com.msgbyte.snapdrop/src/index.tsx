import { regCustomPanel } from '@capital/common';
import { WebviewKeepAlive } from '@capital/component';
import React from 'react';
import { Translate } from './translate';

const PLUGIN_NAME = 'com.msgbyte.snapdrop';

regCustomPanel({
  name: `${PLUGIN_NAME}/personPanel`,
  position: 'personal',
  label: Translate.panelName,
  icon: 'mdi:radio-tower',
  render: () => (
    <WebviewKeepAlive
      className="w-full h-full bg-white"
      url="https://snapdrop.net/"
    />
  ),
});
