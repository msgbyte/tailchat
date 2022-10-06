import {
  regGroupPanelBadge,
  regPluginGroupTextPanelExtraMenu,
  sharedEvent,
  showToasts,
} from '@capital/common';
import { Icon } from '@capital/component';
import React from 'react';
import { appendSilent, hasSilent, removeSilent } from './silent';
import { initNotify } from './notify';
import { Translate } from './translate';

const PLUGIN_NAME = 'com.msgbyte.notify';

if ('Notification' in window) {
  initNotify();
} else {
  showToasts(Translate.nosupport, 'warning');
  console.warn(Translate.nosupport);
}

regPluginGroupTextPanelExtraMenu({
  name: `${PLUGIN_NAME}/grouppanelmenu`,
  label: Translate.slient,
  icon: 'mdi:bell-off-outline',
  onClick: (panelInfo) => {
    if (hasSilent(panelInfo.id)) {
      removeSilent(panelInfo.id);
    } else {
      appendSilent(panelInfo.id);
    }

    sharedEvent.emit('groupPanelBadgeUpdate');
  },
});

regGroupPanelBadge({
  name: `${PLUGIN_NAME}/grouppanelbadge`,
  render: (groupId: string, panelId: string) => {
    return hasSilent(panelId) ? <Icon icon="mdi:bell-off-outline" /> : null;
  },
});
