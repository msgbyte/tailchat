import {
  regPluginSettings,
  getCachedUserSettings,
  sharedEvent,
} from '@capital/common';
import { PLUGIN_CONFIG, PLUGIN_ID } from './const';
import { Translate } from './translate';
import _get from 'lodash/get';

console.log(`Plugin ${PLUGIN_ID} is loaded`);

regPluginSettings({
  name: PLUGIN_CONFIG,
  label: Translate.name,
  position: 'system',
  type: 'select',
  defaultValue: '',
  options: [
    { label: Translate.default, value: '' },
    { label: Translate.md, value: 'md' },
    { label: Translate.lg, value: 'lg' },
    { label: Translate.xl, value: 'xl' },
  ],
});

getCachedUserSettings().then((settings) => {
  updateFontsize(settings);
});

sharedEvent.on('userSettingsUpdate', (settings) => {
  updateFontsize(settings);
});

function updateFontsize(settings: any) {
  const fontSize = _get(settings, PLUGIN_CONFIG);

  if (typeof settings === 'object' && typeof fontSize === 'string') {
    if (fontSize === '') {
      // 清除字号设置
      document.documentElement.style.fontSize = '';
    } else if (fontSize === 'md') {
      document.documentElement.style.fontSize = '18px';
    } else if (fontSize === 'lg') {
      document.documentElement.style.fontSize = '20px';
    } else if (fontSize === 'xl') {
      document.documentElement.style.fontSize = '22px';
    }
  }
}
