import { Button, notification } from '@capital/component';
import React from 'react';
import { Translate } from './translate';
import { getDeviceInfo } from './utils';

const url = 'https://tailchat.msgbyte.com/downloads/client.json';

export async function checkUpdate(): Promise<boolean> {
  const deviceInfo = getDeviceInfo();
  const [semver, config] = await Promise.all([
    import('semver'),
    fetch(url).then((res) => res.json()),
  ]);

  const version = deviceInfo.version;
  const platform = deviceInfo.platform;
  const latestConfig = config?.[platform];
  const latestVersion = latestConfig?.version;
  const latestUrl = latestConfig?.url;

  if (!latestVersion) {
    console.warn('Not found latest version');
    return true;
  }
  if (!latestUrl) {
    console.warn('Not found latest url');
    return true;
  }

  if (semver.gt(latestVersion, version)) {
    // 有新版本
    notification.info({
      message: Translate.newVersionTip,
      description: (
        <div>
          <div>{Translate.newVersionDesc}</div>
          <div>
            {version} -&gt; {latestVersion}
          </div>
        </div>
      ),
      btn: (
        <Button
          type="primary"
          onClick={() => {
            window.open(latestUrl);
          }}
        >
          {Translate.upgradeNow}
        </Button>
      ),
      placement: 'topRight',
      duration: 0,
    });

    return true;
  }

  return false;
}
