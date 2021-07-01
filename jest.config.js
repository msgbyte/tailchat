const regeneratorRuntime = require('regenerator-runtime');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  // projects: ['<rootDir>/web/'], // https://jestjs.io/docs/configuration#projects-arraystring--projectconfig
  rootDir: '.',
  testRegex: '.*\\.(test|spec)\\.tsx?$',
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/fileTransformer.js',
    '^.+\\.jsx?$': 'babel-jest', //这个是jest的默认配置
    '^.+\\.ts?$': 'ts-jest' //typescript转换
  },
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: [],
  globals: {
    window: {},
  },
};
