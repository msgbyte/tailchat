import { generateInstallPluginScript } from '.';
import log from 'electron-log';
import { startScreenshots } from '../screenshots';
import { BrowserWindow } from 'electron';

export function handleTailchatMessage(
  type: string,
  payload: any,
  webview: Electron.WebContents,
  win: BrowserWindow
) {
  log.info('onMessage receive:', type, payload);

  if (type === 'init') {
    webview.executeJavaScript(generateInstallPluginScript());
    return;
  }

  if (type === 'callScreenshotsTool') {
    startScreenshots();
    return;
  }

  if (type === 'receiveUnmutedMessage') {
    if (!win.isFocused) {
      win.flashFrame(true);
    }
    return;
  }
}
