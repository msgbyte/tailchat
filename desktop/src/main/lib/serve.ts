/**
 * Fork from: https://github.com/sindresorhus/electron-serve
 *
 * Has some problem
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import electron, {
  BrowserWindow,
  ProtocolRequest,
  ProtocolResponse,
} from 'electron';
import log from 'electron-log';
import is from 'electron-is';

interface Options {
  /**
  The directory to serve, relative to the app root directory.
  */
  directory: string;

  /**
  Custom scheme. For example, `foo` results in your `directory` being available at `foo://-`.
  @default 'app'
  */
  scheme?: string;

  /**
  Whether [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) should be enabled.
  Useful for testing purposes.
  @default true
  */
  isCorsEnabled?: boolean;

  /**
  The partition the protocol should be installed to, if you're not using Electron's default partition.
  @default electron.session.defaultSession
  */
  partition?: string;
}

const stat = promisify(fs.stat);

// See https://cs.chromium.org/chromium/src/net/base/net_error_list.h
const FILE_NOT_FOUND = -6;

async function getPath(_path: string): Promise<string | void> {
  try {
    const result = await stat(_path);

    if (result.isFile()) {
      return _path;
    }

    if (result.isDirectory()) {
      return getPath(path.join(_path, 'index.html'));
    }
  } catch (_) {}
}

export default (options: Options) => {
  const scheme = options.scheme ?? 'app';
  const isCorsEnabled = options.isCorsEnabled ?? true;

  if (!options.directory) {
    throw new Error('The `directory` option is required');
  }

  const directory = path.resolve(electron.app.getAppPath(), options.directory);

  const handler = async (
    request: ProtocolRequest,
    callback: (response: ProtocolResponse) => void
  ) => {
    log.info('Request custom scheme url:', request.url);

    const pathname = new URL(request.url).pathname;

    if (is.dev()) {
      callback({
        headers: request.headers,
        method: request.method,
        referrer: request.referrer,
        url: `http://localhost:1212/${request.url.replace('app://-/', '')}`,
      });
      return;
    }

    const indexPath = path.join(directory, 'index.html');
    const filePath = path.join(directory, decodeURIComponent(pathname));
    const resolvedPath = await getPath(filePath);
    const fileExtension = path.extname(filePath);

    log.info('Request custom scheme path', {
      indexPath,
      filePath,
      resolvedPath,
      fileExtension,
    });

    if (
      resolvedPath ||
      !fileExtension ||
      fileExtension === '.html' ||
      fileExtension === '.asar'
    ) {
      callback({
        path: resolvedPath || indexPath,
      });
    } else {
      callback({ error: FILE_NOT_FOUND });
    }
  };

  log.info('register scheme:', scheme);
  try {
    electron.protocol.registerSchemesAsPrivileged([
      {
        scheme,
        privileges: {
          standard: true,
          secure: true,
          allowServiceWorkers: true,
          supportFetchAPI: true,
          corsEnabled: isCorsEnabled,
        },
      },
    ]);
  } catch (e) {
    log.error('register scheme error:', e);
  }

  electron.app.on('ready', () => {
    const session = options.partition
      ? electron.session.fromPartition(options.partition)
      : electron.session.defaultSession;

    if (is.dev()) {
      session.protocol.registerHttpProtocol(scheme, handler);
    } else {
      session.protocol.registerFileProtocol(scheme, handler);
    }
  });

  return async (window: BrowserWindow) => {
    await window.loadURL(`${scheme}://-`);
  };
};
