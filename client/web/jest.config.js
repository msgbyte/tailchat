const regeneratorRuntime = require('regenerator-runtime');
const { pathsToModuleNameMapper } = require('ts-jest');
const webCompilerOptions = require('./tsconfig.test.json').compilerOptions;

// 用于处理编译出来是esmodule会抛出 SyntaxError: Unexpected token 'export' 问题的包
const esModules = [
  'react-markdown',
  'vfile',
  'unist-util-stringify-position',
  'unified',
  'bail',
  'is-plain-obj',
  'trough',
  'remark-parse',
  'mdast-util-from-markdown',
  'mdast-util-to-string',
  'micromark',
  'decode-named-character-reference',
  'character-entities',
  'remark-rehype',
  'mdast-util-to-hast',
  'unist-builder',
  'unist-util-visit',
  'unist-util-is',
  'unist-util-position',
  'unist-util-generated',
  'mdast-util-definitions',
  'trim-lines',
  'property-information',
  'hast-util-whitespace',
  'space-separated-tokens',
  'comma-separated-tokens',
].join('|');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    ...pathsToModuleNameMapper(webCompilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  },
  // projects: ['<rootDir>/web/'], // https://jestjs.io/docs/configuration#projects-arraystring--projectconfig
  rootDir: '.',
  testRegex: '.*\\.(test|spec)\\.tsx?$',
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  transform: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/fileTransformer.js',
    [`(${esModules}).+\\.(j|t)sx?$`]: 'ts-jest',
  },
  transformIgnorePatterns: [`/node_modules/\.pnpm/(?!(${esModules}))`],
  setupFiles: ['<rootDir>/test/setup.js'],
  setupFilesAfterEnv: [],
  globals: {
    window: {},
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
};
