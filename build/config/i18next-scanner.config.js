const fs = require('fs-extra');
const path = require('path');
const { crc32 } = require('crc');
const esbuild = require('esbuild');

console.log('Scanning Translation in src folder...');

module.exports = {
  input: [
    'web/**/*.{ts,tsx}',
    'shared/**/*.{ts,tsx}',
    // 'src/shared/i18n/__internal__/__scan__.ts',
    // Use ! to filter out files or directories
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!web/e2e/**/*.test.{ts,tsx}',
    // '!src/shared/i18n/**',
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
      loadPath: './src/shared/i18n/langs/{{lng}}/{{ns}}.json', //输入路径
      savePath: './src/shared/i18n/langs/{{lng}}/{{ns}}.json', //输出路径
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
  transform: async function customTransform(file, enc, done) {
    //自己通过该函数来加工key或value
    'use strict';
    const parser = this.parser;
    const content = await fs.readFile(file.path, enc);

    parser.parseFuncFromString(
      content,
      { list: ['lang', 't'] },
      (key, options) => {
        options.defaultValue = key;
        const hashKey = `k${crc32(key).toString(16)}`;
        parser.set(hashKey, options);
      }
    );

    // 如果是 tsx 文件，则使用esbuild转换成jsx后再输入
    if (path.extname(file.path) === '.tsx') {
      const { code } = await esbuild.transform(content, {
        jsx: 'preserve',
        loader: 'tsx',
      });
      parser.parseTransFromString(
        code,
        { component: 'Trans', i18nKey: 'i18nKey' },
        (key, options) => {
          /**
           * 处理scanner与react-i18next算法不一致导致的问题
           * Reference: https://github.com/i18next/i18next-scanner/issues/125
           */
          let sentence = options.defaultValue;
          // remove <Tag> surrounding interopations to match i18next simpilied result
          // @see https://github.com/i18next/react-i18next/blob/master/CHANGELOG.md#800
          sentence = sentence.replace(/<(\d+)>{{(\w+)}}<\/\1>/g, '{{$2}}');
          sentence = sentence.replace(/\s+/g, ' ');
          options.defaultValue = sentence;

          const hashKey = `k${crc32(key || sentence).toString(16)}`;
          parser.set(hashKey, options);
        }
      );
    }

    done();
  },
};
