const { link } = require('fs');
const tailchat = require('tailchat-client-sdk');

// reference: https://docs.codemagic.io/yaml-basic-configuration/environment-variables/#artifact-links
const artifactLinks = process.env['CM_ARTIFACT_LINKS'];
const tailchatSubscribeId = process.env['TAILCHAT_SUBSCRIBE_ID'];

console.log('artifactLinks:', artifactLinks);

if (tailchatSubscribeId) {
  try {
    const links = JSON.parse(artifactLinks) ?? [];
    const text =
      '[b]App 构建成功:[/b]\n' +
      links
        .map((link) => {
          const { name, url, md5, versionName } = link;
          return `${name}
version: ${versionName}(${md5})
[url=${url}]下载链接[/url]`;
        })
        .join('\n=========\n');

    tailchat.sendSimpleNotify(
      'https://tailchat-nightly.moonrailgun.com',
      tailchatSubscribeId,
      text
    );
  } catch (e) {
    console.error(e);
  }
} else {
  console.error('Not found tailchatSubscribeId');
}
