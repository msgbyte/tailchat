/**
 * Fork from https://github.com/msgbyte/webbox/blob/main/src/main/webviewManager.ts
 */

import { BrowserView, BrowserWindow, ipcMain, Rectangle } from 'electron';
import os from 'os';
import log from 'electron-log';

interface WebviewInfo {
  view: BrowserView;
  url: string;
  hidden: boolean;
}

const webviewMap = new Map<string, WebviewInfo>();

/**
 * fix rect into correct size
 */
function fixRect(rect: Rectangle, isFullScreen: boolean): Rectangle {
  const xOffset = 1;
  const yOffset = !isFullScreen && os.platform() === 'darwin' ? 28 : 0; // add y axis offset in mac os if is not fullScreen

  return {
    x: Math.round(rect.x) + xOffset,
    y: Math.round(rect.y) + yOffset,
    width: Math.round(rect.width) - xOffset,
    height: Math.round(rect.height),
  };
}

export function initWebviewManager(win: BrowserWindow) {
  ipcMain.on('$mount-webview', (e, info) => {
    if (!win) {
      log.info('[mount-webview]', 'cannot get mainWindow');
      return;
    }

    log.info('[mount-webview] info:', info);

    const { key, url } = info;
    if (!url) {
      return;
    }

    if (webviewMap.has(key)) {
      const webview = webviewMap.get(key)!;
      win.setTopBrowserView(webview.view);
      webview.view.setBounds(fixRect(info.rect, win.isFullScreen()));
      if (webview.url !== url) {
        // url has been change.
        webview.view.webContents.loadURL(url);
      }
      return;
    }

    // hideAllWebview();
    const view = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
      },
    });
    view.setBackgroundColor('#fff');
    view.setBounds(fixRect(info.rect, win.isFullScreen()));
    view.webContents.loadURL(url);
    win.addBrowserView(view);
    webviewMap.set(key, { view, url, hidden: false });
  });

  ipcMain.on('$unmount-webview', (e, info) => {
    if (!win) {
      log.info('[unmount-webview]', 'cannot get mainWindow');
      return;
    }

    log.info('[unmount-webview] info:', info);

    const { key } = info;
    const webview = webviewMap.get(key);
    if (webview) {
      win.removeBrowserView(webview.view);
      webviewMap.delete(key);
    }
  });

  ipcMain.on('$update-webview-rect', (e, info) => {
    if (!win) {
      log.info('[update-webview-rect]', 'cannot get mainWindow');
      return;
    }

    log.info('[update-webview-rect] info:', info);

    // Change All View to avoid under view display on resize.
    // webviewMap.forEach((webview) => {
    //   webview.hidden = false;
    //   webview.view.setBounds(fixRect(info.rect, win.isFullScreen()));
    // });

    // Change Single View
    const webview = webviewMap.get(info.key);
    if (webview) {
      webview.hidden = false;
      webview.view.setBounds(fixRect(info.rect, win.isFullScreen()));
    }
  });

  ipcMain.on('$show-webview', (e, info) => {
    log.info('[show-webview] info:', info);

    const webview = webviewMap.get(info.key);
    if (webview) {
      showWebView(webview);
    }
  });

  ipcMain.on('$hide-webview', (e, info) => {
    log.info('[hide-webview] info:', info);

    const webview = webviewMap.get(info.key);
    if (webview) {
      hideWebView(webview);
    }
  });

  ipcMain.on('$hide-all-webview', () => {
    log.info('[hide-all-webview]');

    hideAllWebview();
  });

  ipcMain.on('$clear-all-webview', () => {
    if (!win) {
      log.info('[clear-all-webview]', 'cannot get mainWindow');
      return;
    }

    log.info('[clear-all-webview]');

    win.getBrowserViews().forEach((view) => {
      win.removeBrowserView(view);
    });

    webviewMap.clear();
  });
}

const HIDDEN_OFFSET = 3000;

/**
 * Show webview with remove offset in y
 */
function showWebView(webview: WebviewInfo) {
  if (webview.hidden === false) {
    return;
  }

  webview.hidden = false;
  const oldBounds = webview.view.getBounds();
  webview.view.setBounds({
    ...oldBounds,
    y: oldBounds.y - HIDDEN_OFFSET,
  });
}

/**
 * Hide webview with append offset in y
 */
function hideWebView(webview: WebviewInfo) {
  if (webview.hidden === true) {
    return;
  }

  webview.hidden = true;
  const oldBounds = webview.view.getBounds();
  webview.view.setBounds({
    ...oldBounds,
    y: oldBounds.y + HIDDEN_OFFSET,
  });
}

function hideAllWebview() {
  Array.from(webviewMap.values()).forEach((webview) => {
    hideWebView(webview);
  });
}
