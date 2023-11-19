import log from 'electron-log';
import { URL } from 'url';
import path from 'path';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }

  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function getDefaultLoggerPath(): string {
  return log.transports.file.getFile().path;
}

export function getCapturerSourcePickerUrl() {
  if (process.env.NODE_ENV === 'development') {
    return path.resolve(__dirname, '../../assets/capturer-source-picker.html');
  } else {
    return path.resolve(
      __dirname,
      '../../../assets/capturer-source-picker.html'
    );
  }
}
