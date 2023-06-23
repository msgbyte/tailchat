import { regCustomPanel } from '@capital/common';
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
