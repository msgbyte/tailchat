import { URL } from 'url';
import path from 'path';
import is from 'electron-is';
import { startLocalServer } from './lib/http';
import getPort, { makeRange } from 'get-port';
import log from 'electron-log';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

/**
 * 获取主界面的窗口地址
 */
export async function getMainWindowUrl() {
  if (is.dev()) {
    const port = process.env.PORT || 1212;
    return `http://localhost:${port}/index.html`;
  } else {
    const port = await getPort({
      port: makeRange(11000, 20000), // 使用高位端口
    });
    await startLocalServer(path.resolve(__dirname, '../renderer/'), port);

    return `http://localhost:${port}/index.html`;
  }
}

export function getDefaultLoggerPath(): string {
  return log.transports.file.getFile().path;
}
