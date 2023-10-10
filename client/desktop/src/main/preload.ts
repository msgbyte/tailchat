import {
  contextBridge,
  ipcRenderer,
  IpcRendererEvent,
  webFrame,
} from 'electron';
import { CONSTANT } from './util';

export type Channels =
  | 'ipc-example'
  | 'webview-message'
  | 'close'
  | 'selectServer'
  | 'selectCapturerSource';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    getDesktopCapturerSource:
      async (): Promise<Electron.DesktopCapturerSource> => {
        const source = await ipcRenderer.invoke(
          CONSTANT.DESKTOP_CAPTURER_GET_SOURCES
        );

        return source;
      },
  },
});

const postMessageOverride = `window.postMessage = function (data) {
  window.electron.ipcRenderer.sendMessage('webview-message', JSON.stringify(data));
};`;

webFrame.executeJavaScript(postMessageOverride);
