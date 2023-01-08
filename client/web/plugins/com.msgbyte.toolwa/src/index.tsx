import { regCustomPanel } from '@capital/common';
import { Webview } from '@capital/component';
import React from 'react';
import { Translate } from './translate';

const PLUGIN_NAME = 'com.msgbyte.toolwa';

regCustomPanel({
  name: `${PLUGIN_NAME}/personPanel`,
  position: 'personal',
  label: Translate.panelName,
  icon: 'openmoji:frog',
  render: () => (
    <Webview className="w-full h-full bg-white" url="https://toolwa.com/" />
  ),
});
