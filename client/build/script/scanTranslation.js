const vfs = require('vinyl-fs');
const fs = require('fs-extra');
const sort = require('gulp-sort');
const path = require('path');
const scanner = require('i18next-scanner');
// const utils = require('./utils');
const _ = require('lodash');
const { crc32 } = require('crc');
const scannerConfig = require('../config/i18next-scanner.config');

const output = path.resolve(__dirname, '../../');

const originJson = fs.readJsonSync(
  path.resolve(output, './shared/i18n/langs/zh-CN/translation.json')
);

// For main
const mainstream = vfs
  .src([
    ...scannerConfig.input,
    // '!src/plugins/**'
  ])
  .pipe(sort()) // Sort files in stream by path
  .pipe(
    scanner(
      {
        ...scannerConfig.options,
        resource: {
          ...scannerConfig.options.resource,
          loadPath: './shared/i18n/langs/{{lng}}/{{ns}}.json', //输入路径
          savePath: './shared/i18n/langs/{{lng}}/{{ns}}.json', //输出路径
        },
      },
      scannerConfig.transform
    )
  )
  .pipe(vfs.dest(path.resolve(__dirname, output)));

mainstream.on('finish', () => {
  // 主流完毕后进行插件生成
  // console.log('主项目翻译生成完毕, 开始进行子项目翻译生成...');
  const transJson = fs.readJsonSync(
    path.resolve(output, './shared/i18n/langs/zh-CN/translation.json')
  );
  const originKeys = Object.keys(originJson);
  const transKeys = Object.keys(transJson);
  const addedNum = _.without(transKeys, ...originKeys).length;
  const deletededNum = _.without(originKeys, ...transKeys).length;

  console.log(
    `主项目翻译生成完毕! 新增翻译 ${addedNum} 条, 移除翻译 ${deletededNum} 条`
  );

  // For plugins
  // utils.getPluginDirs().forEach((plugin) => {
  //   const stream = vfs
  //     .src([`src/plugins/${plugin}/**/*.{ts,tsx}`])
  //     .pipe(sort()) // Sort files in stream by path
  //     .pipe(
  //       scanner(
  //         {
  //           ...scannerConfig.options,
  //           resource: {
  //             ...scannerConfig.options.resource,
  //             loadPath: `./src/plugins/${plugin}/i18n/{{lng}}/{{ns}}.json`, //输入路径
  //             savePath: `./src/plugins/${plugin}/i18n/{{lng}}/{{ns}}.json`, //输出路径
  //           },
  //         },
  //         scannerConfig.transform
  //       )
  //     )
  //     .pipe(vfs.dest(path.resolve(__dirname, output)));

  //   stream.on('finish', () => {
  //     let sharedKeyNum = 0;
  //     scannerConfig.options.lngs.forEach((lang) => {
  //       const mainTrans = fs.readJSONSync(
  //         path.resolve(
  //           output,
  //           `./src/shared/i18n/langs/${lang}/translation.json`
  //         )
  //       );

  //       const pluginTransPath = path.resolve(
  //         output,
  //         `./src/plugins/${plugin}/i18n/${lang}/translation.json`
  //       );
  //       const pluginTrans = fs.readJSONSync(pluginTransPath);

  //       const sharedTransKey = _.intersection(
  //         Object.keys(pluginTrans),
  //         Object.keys(mainTrans)
  //       );
  //       sharedKeyNum = sharedTransKey.length;
  //       sharedTransKey.forEach((key) => {
  //         delete pluginTrans[key];
  //       });
  //       fs.writeJsonSync(pluginTransPath, pluginTrans, {
  //         spaces: 2,
  //       });
  //     });
  //     console.log(
  //       `子项目 [${plugin}] 翻译生成完毕, 自动移除与主项目共享的翻译 ${sharedKeyNum} 条`
  //     );
  //   });
  // });
});
