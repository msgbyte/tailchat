import { generateInstallPluginScript } from '.';
import log from 'electron-log';
import { startScreenshots } from '../screenshots';

export function handleTailchatMessage(
  type: string,
  payload: any,
  webview: Electron.WebContents
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
}
