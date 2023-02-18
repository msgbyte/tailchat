import { globalShortcut } from 'electron';
import Screenshots from 'electron-screenshots';
import _once from 'lodash/once';

export const initScreenshots = _once(() => {
  const screenshots = new Screenshots();

  globalShortcut.register('ctrl+shift+a', () => {
    screenshots.startCapture();
    // screenshots.$view.webContents.openDevTools();
  });

  // 点击确定按钮回调事件
  screenshots.on('ok', (e, buffer, bounds) => {
    console.log('capture', buffer, bounds);
  });
  // 点击取消按钮回调事件
  screenshots.on('cancel', () => {
    console.log('capture', 'cancel');
  });
  // 点击保存按钮回调事件
  screenshots.on('save', (e, buffer, bounds) => {
    console.log('capture', buffer, bounds);
  });
});
