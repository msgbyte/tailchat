import glob from 'glob';
import path from 'path';
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

Promise.all(feplugins.map((path) => fs.readJson(path))).then(async (list) => {
  await writeMarkdown(
    feMD,
    list.filter((item) => !item.name.includes('.theme.')),
    `---
sidebar_position: 1
title: 纯前端插件
---`
  );

  await writeMarkdown(
    themeMD,
    list.filter((item) => item.name.includes('.theme.')),
    `---
sidebar_position: 2
title: 自定义主题
---`
  );

  console.log('纯前端插件文档自动生成完毕');
});

Promise.all(beplugins.map((path) => fs.readJson(path))).then(async (list) => {
  await writeMarkdown(
    beMD,
    list,
    `---
sidebar_position: 3
title: 前后端插件
---`
  );

  console.log('前后端插件文档自动生成完毕');
});

/**
 * 写入markdown
 */
async function writeMarkdown(path: string, list: PluginMeta[], header: string) {
  const text = `${header}

${list.map(renderPluginDetail).join('\n\n')}
`;

  await fs.writeFile(path, text);
}

function renderPluginDetail(meta: PluginMeta) {
  return `### ${meta.name} ${meta.label}

${meta.description}
`;
}
