import React from 'react';
import { Translate } from './translate';

interface WindowRnDeviceInfo {
  version: string;
  readableVersion: string;
}

export const DeviceInfoPanel: React.FC = React.memo(() => {
  const deviceInfo: WindowRnDeviceInfo = (window as any).__rnDeviceInfo ?? {};
  return (
    <div>
      <div>
        {Translate.clientVersion}: {deviceInfo.version}(
        {deviceInfo.readableVersion})
      </div>
    </div>
  );
});
DeviceInfoPanel.displayName = 'DeviceInfoPanel';
