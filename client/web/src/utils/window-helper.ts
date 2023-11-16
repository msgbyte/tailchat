/**
 * 多窗口管理工具
 */

/**
 * 窗口序列号
 * 一个自增数
 */
let windowIndex = 0;

export function buildWindowFeatures(
  options: Record<string, string | number | boolean>
): string {
  return Object.entries(options)
    .map(([key, val]) => `${key}=${val}`)
    .join(',');
}

interface OpenInNewWindowOptions {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
}

/**
 * 在新窗口打开
 * @param url 新窗口地址
 */
export function openInNewWindow(
  url: string,
  options: OpenInNewWindowOptions = {}
) {
  const width = options.width ?? 414;
  const height = options.height ?? 736;
  const top = options.top ?? (window.screen.height - height) / 2;
  const left = options.left ?? (window.screen.width - width) / 2;

  // 打开窗口
  const win = window.open(
    url,
    `tailwindow#${windowIndex++}`,
    buildWindowFeatures({
      top,
      left,
      width,
      height,
      menubar: false,
      toolbar: false,
      location: false,
      status: false,
      resizable: true,
    })
  );

  return win;
}

class PanelWindowManager {
  openedPanelWindows: Record<string, Window> = {};

  /**
   * 打开一个独立窗口
   * @param url 窗口Url
   */
  open(
    url: string,
    options: { onClose?: () => void } & OpenInNewWindowOptions = {}
  ): Window {
    if (this.openedPanelWindows[url]) {
      this.openedPanelWindows[url].focus();
      return this.openedPanelWindows[url];
    }

    const win = openInNewWindow(url);
    if (!win) {
      throw new Error('Create window failed');
    }

    const timer = setInterval(() => {
      // 目前没有好的办法可以检测打开的窗口是否被直接关闭
      // 轮询检测是否被关闭
      if (win.closed) {
        // 窗口已经被用户关闭
        delete this.openedPanelWindows[url];
        clearInterval(timer);

        if (typeof options?.onClose === 'function') {
          // 触发回调
          options.onClose?.();
        }
      }
    }, 1000);

    this.openedPanelWindows[url] = win;

    return win;
  }

  /**
   * 关闭窗口
   * @param url 窗口url
   */
  close(url: string): void {
    if (!this.openedPanelWindows[url]) {
      return;
    }

    this.openedPanelWindows[url].close();
    delete this.openedPanelWindows[url];
  }

  /**
   * 检查窗口是否被打开
   * @param url 窗口Url
   */
  has(url: string): boolean {
    return !!this.openedPanelWindows[url];
  }
}

export const panelWindowManager = new PanelWindowManager();
