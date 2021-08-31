const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const execa = require('execa');

const pluginDirs = glob.sync(path.join(__dirname, './com.msgbyte.*'));

Promise.all(
  pluginDirs.map((dir) => {
    execa('yarn', {
      cwd: dir,
      stdout: 'inherit',
      stderr: 'inherit',
    });
  })
)
  .then(() => {
    console.log('插件依赖安装完毕');
  })
  .catch((err) => {
    console.error('插件依赖安装失败:', err);
  });
