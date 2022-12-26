const path = require('path');
const copy = require('rollup-plugin-copy');
const normalize = require('normalize-path');
const replace = require('@rollup/plugin-replace');

const pluginRoot = path.resolve(__dirname, './web');
const outDir = path.resolve(__dirname, '../../public');

module.exports = {
  externalDeps: [
    'react',
    'react-router',
    'axios',
    'styled-components',
    'zustand',
    'zustand/middleware/immer',
  ],
  pluginRoot,
  outDir,
  rollupPlugins: ({ pluginName }) => [
    copy({
      targets: [
        {
          src: path.resolve(
            pluginRoot,
            `./plugins/${pluginName}`,
            './assets/**/*'
          ),
          dest: path.resolve(outDir, `./plugins/${pluginName}/assets/`),
        },
        {
          src: path.resolve(
            pluginRoot,
            `./plugins/${pluginName}`,
            './docs/**/*'
          ),
          dest: path.resolve(outDir, `./plugins/${pluginName}/docs/`),
        },
        {
          src: path.resolve(
            pluginRoot,
            `./plugins/${pluginName}`,
            './README.md'
          ),
          dest: path.resolve(outDir, `./plugins/${pluginName}/`),
        },
      ].map((item) => ({
        // For windows
        src: normalize(item.src),
        dest: normalize(item.dest, false),
      })),
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};
