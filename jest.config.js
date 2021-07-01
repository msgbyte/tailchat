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
  },
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: [],
  globals: {
    window: {},
  },
};
