/**
 * 安装插件的前端
 */

require('ts-node').register();
const fs = require('fs-extra');
const path = require('path');
const { argv } = require('process');
const execa = require('execa');
const _ = require('lodash');

const containerPath = path.resolve(__dirname, '../plugins');
const publicPath = path.resolve(__dirname, '../public');

const list = fs.readdirSync(containerPath);
const dirs = list.filter((item) =>
  fs.statSync(path.resolve(containerPath, item)).isDirectory()
);

async function start() {
  if (argv.length === 2) {
    console.log(`安装方式: pnpm plugin:install [pluginName]`);
    console.log('所有插件:');
    dirs.forEach((dir) => {
      console.log(`- ${dir}`);
    });

    return;
  }

  const [, , ...installPlugins] = argv;

  let availableInstallPlugins = [];
  if (installPlugins.includes('all')) {
    // 安装所有
    availableInstallPlugins = [...dirs];
  } else {
    // 安装部分
    availableInstallPlugins = installPlugins.filter((p) => dirs.includes(p));
  }
  for (const p of availableInstallPlugins) {
    console.log('┌ 开始安装:', p);
    let manifest = await fs.readJSON(
      path.resolve(containerPath, `./${p}/web/plugins/${p}/manifest.json`)
    );
    if (!manifest) {
      console.error('配置加载失败, 跳转安装');
      return;
    }

    // 编译插件文件
    await execa('pnpm', ['build:web'], {
      cwd: path.resolve(containerPath, p),
      stdout: 'inherit',
      stderr: 'inherit',
    });

    // 追加前端配置到registry
    const originRegistry =
      (await fs
        .readJSON(path.resolve(publicPath, './registry.json'))
        .catch(() => [])) ?? [];
    const newRegistry = _.uniqBy([manifest, ...originRegistry], (m) => m.name);
    await fs.writeJSON(
      path.resolve(publicPath, './registry.json'),
      newRegistry
    );

    console.log('└ 安装完毕:', p);
  }
}

start();
