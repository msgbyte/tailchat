/**
 * 将翻译文件集合到dist目录
 */
const path = require('path');
const fs = require('fs-extra');
const scannerConfig = require('../config/i18next-scanner.config');
// const utils = require('./utils');
const langs = scannerConfig.options.lngs;
const distDir = path.resolve(__dirname, '../../');
// const plugins = utils.getPluginDirs();

const filepath = [
  path.resolve(__dirname, '../../shared/i18n/langs/{{lang}}/translation.json'),
  // ...plugins.map((plugin) =>
  //   path.resolve(
  //     __dirname,
  //     `../../src/plugins/${plugin}/i18n/{{lang}}/translation.json`
  //   )
  // ),
];

console.log('Build locales:', langs);
for (const lang of langs) {
  Promise.all(
    filepath
      .map((p) => {
        return p.replace('{{lang}}', lang);
      })
      .map((p) => fs.readJSON(p))
  )
    .then((jsons) => {
      let res = {};
      for (const json of jsons) {
        res = {
          ...res,
          ...json,
        };
      }

      return res;
    })
    .then((trans) => {
      const filePath = path.resolve(
        distDir,
        `./locales/${lang}/translation.json`
      );
      return fs.ensureFile(filePath).then(() => {
        fs.writeJSON(filePath, trans, {
          spaces: 2,
        });
      });
    })
    .then(() => {
      console.log(`Build [${lang}] Success!`);
    });
}
