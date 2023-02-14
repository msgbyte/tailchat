const tailchat = require('tailchat-client-sdk');
const fs = require('fs-extra');

// reference: https://docs.codemagic.io/yaml-basic-configuration/environment-variables/#artifact-links
const artifactLinks = process.env['CM_ARTIFACT_LINKS'];
const tailchatSubscribeId = process.env['TAILCHAT_SUBSCRIBE_ID'];

console.log('artifactLinks:', artifactLinks);

if (tailchatSubscribeId) {
  try {
    if (fs.existsSync('~/SUCCESS')) {
      const links = JSON.parse(artifactLinks) ?? [];
      const text =
        '[b]App 构建成功:[/b]\n' +
        links
          .map((link) => {
            const { name, url, md5, versionName } = link;
            return (
              `${name}\n` +
              `version: ${versionName}(${md5})\n` +
              `[url=${url}]下载安装包[/url]`
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
        '[b]App 构建失败:[/b]\n' +
        `[url=https://codemagic.io/app/${process.env['CM_PROJECT_ID']}/build/${process.env['CM_BUILD_ID']}]查看详情[/url]`;

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
