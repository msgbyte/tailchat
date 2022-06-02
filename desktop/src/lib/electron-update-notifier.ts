/**
 * Fork from https://github.com/ankurk91/electron-update-notifier/blob/master/src/index.ts
 */

import path from 'path';
import axios from 'axios';
import electron from 'electron';
import compareVersions from 'compare-versions';
import gh from 'github-url-to-object';

interface Options {
  repository?: string;
  token?: string;
  debug?: boolean;
  silent?: boolean;
}

interface GithubReleaseObject {
  tag_name: string;
  body: string;
  html_url: string;
}

export const defaultOptions: Options = {
  debug: false, // force run in development
  silent: true,
};

export function setUpdateNotification(options: Options = defaultOptions) {
  const withDefaults = Object.assign(defaultOptions, options);

  if (electron.app.isReady()) {
    checkForUpdates(withDefaults);
  } else {
    electron.app.on('ready', () => {
      checkForUpdates(withDefaults);
    });
  }
}

export async function checkForUpdates({
  repository,
  token,
  debug,
  silent,
}: Options = defaultOptions) {
  if (!electron.app.isPackaged && !debug) {
    return;
  }

  if (!repository) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require(path.join(electron.app.getAppPath(), 'package.json'));
    const ghObj = gh(pkg.repository);

    if (!ghObj) {
      throw new Error('Repository URL not found in package.json file.');
    }

    repository = ghObj.user + '/' + ghObj.repo;
  }

  let latestRelease: null | GithubReleaseObject = null;

  try {
    const { data: releases } = await axios.get(
      `https://api.github.com/repos/${repository}/releases`,
      {
        headers: token ? { authorization: `token ${token}` } : {},
      }
    );

    latestRelease = releases[0] as GithubReleaseObject;
  } catch (error) {
    console.error(error);

    if (!silent) {
      showDialog(
        'Unable to check for updates at this moment. Try again.',
        'error'
      );
    }
  }

  if (!latestRelease) {
    return;
  }

  if (
    compareVersions.compare(
      latestRelease.tag_name,
      electron.app.getVersion(),
      '>'
    )
  ) {
    showUpdateDialog(latestRelease);
  } else {
    if (!silent) {
      showDialog(`You are already running the latest version.`);
    }
  }
}

export function showUpdateDialog(release: GithubReleaseObject) {
  electron.dialog
    .showMessageBox({
      title: electron.app.getName(),
      type: 'info',
      message: `New release available`,
      detail:
        `Installed Version: ${electron.app.getVersion()}\nLatest Version: ${
          release.tag_name
        }\n\n${release.body}`.trim(),
      buttons: ['Download', 'Later'],
      defaultId: 0,
      cancelId: 1,
    })
    .then(({ response }) => {
      if (response === 0) {
        setImmediate(() => {
          electron.shell.openExternal(release.html_url);
        });
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
}

const showDialog = (detail: string, type = 'info') => {
  electron.dialog.showMessageBox({
    title: electron.app.getName(),
    message: 'Update checker',
    buttons: ['Close'],
    defaultId: 0,
    cancelId: 0,
    type,
    detail,
  });
};
