import glob from 'glob';
import path from 'path';
import url from 'url';
import fs from 'fs-extra';

interface PluginMeta {
  label: string;
  name: string;
  url: string;
  version: string;
  author: string;
  description: string;
  documentUrl: string;
  requireRestart: boolean;
}

const githubRepoUrl = 'https://github.com/msgbyte/tailchat';
const rootDir = path.resolve(__dirname, '../../');
const feMD = path.resolve(__dirname, '../docs/plugin-list/fe.md');
const themeMD = path.resolve(__dirname, '../docs/plugin-list/theme.md');
const beMD = path.resolve(__dirname, '../docs/plugin-list/full.md');

const feplugins = glob.sync(
  path.join(rootDir, './client/web/plugins/*/manifest.json')
);
const beplugins = glob.sync(
  path.join(rootDir, './server/plugins/*/web/plugins/*/manifest.json')
);

Promise.all(
  feplugins.map(async (path) => ({
    path,
    manifest: (await fs.readJson(path)) as PluginMeta,
  }))
).then(async (list) => {
  const list1 = list.filter((item) => !item.manifest.name.includes('.theme.'));
  const list2 = list.filter((item) => item.manifest.name.includes('.theme.'));
  await writeMarkdown(
    feMD,
    list1,
    `---
sidebar_position: 1
title: Pure Frontend Plugin (${list1.length})
---`
  );

  await writeMarkdown(
    themeMD,
    list2,
    `---
sidebar_position: 2
title: Custom Theme (${list2.length})
---`
  );

  console.log('The pure frontend plugin documents is automatically generated');
});

Promise.all(
  beplugins.map(async (path) => ({
    path,
    manifest: (await fs.readJson(path)) as PluginMeta,
  }))
).then(async (list) => {
  await writeMarkdown(
    beMD,
    list,
    `---
sidebar_position: 3
title: Backend plugins (${list.length})
---`
  );

  console.log('The Backend plugin documents are automatically generated');
});

/**
 * 写入markdown
 */
async function writeMarkdown(
  path: string,
  list: { path: string; manifest: PluginMeta }[],
  header: string
) {
  const text = `${header}

${list.map(renderPluginDetail).join('\n\n')}
`;

  await fs.writeFile(path, text);
}

function renderPluginDetail(info: { path: string; manifest: PluginMeta }) {
  const sourceCodeUrl = url.resolve(
    `${githubRepoUrl}/blob/master/`,
    path.dirname(path.relative(rootDir, info.path))
  );

  return `### ${info.manifest.name} ${info.manifest.label}

${info.manifest.description}

- [Source Code](${sourceCodeUrl})
- [manifest.json](${sourceCodeUrl}/manifest.json)
`;
}
