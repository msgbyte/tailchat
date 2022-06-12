import { app } from 'electron';
import {
  setUpdateNotification,
  checkForUpdates,
} from '../lib/electron-update-notifier';
// import updateElectronApp from 'update-electron-app';
// import logger from 'electron-log';

const repo = 'msgbyte/tailchat';

app.whenReady().then(() => {
  switch (process.platform) {
    // case 'darwin': // NOTICE: require codesign
    // case 'win32':
    //   updateElectronApp({
    //     repo,
    //     logger,
    //   });
    //   break;
    default: {
      // 检测更新
      setUpdateNotification({
        repository: repo, // Optional, use repository field from your package.json when not specified
        silent: true, // Optional, notify when new version available, otherwise remain silent
      });
    }
  }
});

/**
 * 手动检查更新
 */
export function checkUpdates(): Promise<void> {
  return checkForUpdates({
    repository: repo,
    silent: false,
  });
}
