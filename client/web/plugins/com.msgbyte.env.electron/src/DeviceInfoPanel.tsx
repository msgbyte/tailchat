import { showSuccessToasts } from '@capital/common';
import { Button } from '@capital/component';
import React from 'react';
import { checkUpdate } from './checkUpdate';
import { Translate } from './translate';
import { getDeviceInfo } from './utils';

export const DeviceInfoPanel: React.FC = React.memo(() => {
  const deviceInfo = getDeviceInfo();

  return (
    <div>
      <div>
        {Translate.clientName}: {deviceInfo.name}
      </div>
      <div>
        {Translate.clientVersion}: {deviceInfo.version}
      </div>
      <div>
        {Translate.platform}: {deviceInfo.platform}
      </div>
      <Button
        onClick={async () => {
          const res = await checkUpdate();
          if (res === false) {
            showSuccessToasts(Translate.isLatest);
          }
        }}
      >
        {Translate.checkVersion}
      </Button>
    </div>
  );
});
DeviceInfoPanel.displayName = 'DeviceInfoPanel';
