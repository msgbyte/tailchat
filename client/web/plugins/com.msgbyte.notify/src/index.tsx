import { regPluginSettings, showToasts } from '@capital/common';
import { initNotify } from './notify';
import { Translate } from './translate';
import { PLUGIN_SYSTEM_SETTINGS_DISABLED_SOUND } from './const';

if ('Notification' in window) {
  initNotify();
} else {
  if ((window as Window).innerWidth >= 768) {
    // if not mobile
    showToasts(Translate.nosupport, 'warning');
  }
  console.warn(Translate.nosupport);
}

regPluginSettings({
  name: PLUGIN_SYSTEM_SETTINGS_DISABLED_SOUND,
  label: Translate.disabledSound,
  position: 'system',
  type: 'boolean',
});
