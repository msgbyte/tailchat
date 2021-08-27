const fs = require('fs');
const { crc32 } = require('crc');

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
