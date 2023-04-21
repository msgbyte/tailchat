const path = require('path');
const copy = require('rollup-plugin-copy');
const normalize = require('normalize-path');

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
      ].map((item) => ({
        // For windows
        src: normalize(item.src),
        dest: normalize(item.dest, false),
      })),
    }),
  ],
};
