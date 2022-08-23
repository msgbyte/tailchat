const vfs = require('vinyl-fs');
const fs = require('fs-extra');
const sort = require('gulp-sort');
const path = require('path');
const scanner = require('i18next-scanner');
const _ = require('lodash');
const { crc32 } = require('crc');

const scannerConfig = {
  input: [
    'services/**/*.{ts,tsx}',
    'plugins/**/*.{ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
  output: './', //输出目录
  options: {
    debug: false,
    sort: true,
    func: false,
    trans: false,
    lngs: ['zh-CN', 'en-US'],
    defaultLng: 'zh-CN',
    resource: {
      loadPath: './locales/{{lng}}/{{ns}}.json', //输入路径
          savePath: './locales/{{lng}}/{{ns}}.json', //输出路径
      jsonIndent: 2,
      lineEnding: '\n',
      endWithEmptyTrans: true,
    },
    removeUnusedKeys: true,
    nsSeparator: false, // namespace separator
    keySeparator: false, // key separator
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
  transform: function customTransform(file, enc, done) {
    //自己通过该函数来加工key或value
    'use strict';
    const parser = this.parser;
    const content = fs.readFileSync(file.path, enc);
    parser.parseFuncFromString(
      content,
      { list: ['lang', 't'] },
      (key, options) => {
        options.defaultValue = key;
        let hashKey = `k${crc32(key).toString(16)}`;
        parser.set(hashKey, options);
      }
    );
    done();
  },
};


const output = path.resolve(__dirname, '../');

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
      },
      scannerConfig.transform
    )
  )
  .pipe(vfs.dest(path.resolve(__dirname, output)));

mainstream.on('finish', () => {
  console.log('项目翻译生成完毕!');
});
