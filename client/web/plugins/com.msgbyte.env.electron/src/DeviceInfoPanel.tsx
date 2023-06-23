import React from 'react';
import { Translate } from './translate';

interface WindowElectronDeviceInfo {
  version: string;
}

export const DeviceInfoPanel: React.FC = React.memo(() => {
  const deviceInfo: WindowElectronDeviceInfo =
    (window as any).__electronDeviceInfo ?? {};
  return (
    <div>
      <div>
        {Translate.clientVersion}: {deviceInfo.version}
      </div>
    </div>
  );
});
DeviceInfoPanel.displayName = 'DeviceInfoPanel';
