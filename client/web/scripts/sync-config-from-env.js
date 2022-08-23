/**
 * 用于 dockerfile 启动命令
 * 将环境变量的信息同步到 dist/config.json 文件中
 */

const fs = require('fs-extra');
const path = require('path');

const envConfig = require('../assets/config.json'); // 获取默认配置

if (process.env.SERVICE_URL) {
  envConfig.serviceUrl = process.env.SERVICE_URL;
}

if (envConfig) {
  fs.writeJsonSync(path.resolve(__dirname, '../dist/config.json'), envConfig, {
    spaces: 2,
  });
  console.log('从环境变量更新config完毕:', envConfig);
}
