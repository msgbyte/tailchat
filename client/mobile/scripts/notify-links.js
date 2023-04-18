const tailchat = require('tailchat-client-sdk');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');

// reference: https://docs.codemagic.io/yaml-basic-configuration/environment-variables/#artifact-links
const artifactLinks = process.env['CM_ARTIFACT_LINKS'];
const tailchatSubscribeId = process.env['TAILCHAT_SUBSCRIBE_ID'];
const branch = process.env['CM_BRANCH'];

console.log('artifactLinks:', artifactLinks);

if (tailchatSubscribeId) {
  try {
    if (fs.existsSync(path.join(os.homedir(), './SUCCESS'))) {
      const links = JSON.parse(artifactLinks) ?? [];
      const text =
        '[b]App Building Success:[/b]\n' +
        links
          .map((link) => {
            const { name, url, md5, versionName } = link;
            const pagesUrl =
              branch === 'master'
                ? 'https://tailchat.pages.dev/app-release.apk'
                : `https://${branch}.tailchat.pages.dev/app-release.apk`;

            return (
              `${name}\n` +
              `version: ${versionName}(${md5})\n` +
              `[url=${pagesUrl}]Download from Pages[/url] or [url=${url}]Download from CI[/url]`
            );
          })
          .join('\n=========\n');

      tailchat.sendSimpleNotify(
        'https://tailchat-nightly.moonrailgun.com',
        tailchatSubscribeId,
        text
      );
    } else {
      const text =
        '[b]App Building Failed:[/b]\n' +
        `[url=https://codemagic.io/app/${process.env['CM_PROJECT_ID']}/build/${process.env['CM_BUILD_ID']}]View Detail[/url]`;

      tailchat.sendSimpleNotify(
        'https://tailchat-nightly.moonrailgun.com',
        tailchatSubscribeId,
        text
      );
    }
  } catch (e) {
    console.error(e);
  }
} else {
  console.error('Not found tailchatSubscribeId');
}
