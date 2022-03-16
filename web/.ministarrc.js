const copy = require('rollup-plugin-copy');
const replace = require('rollup-plugin-replace');
const path = require('path');

module.exports = {
  externalDeps: [
    'react',
    'axios', // Use for some deps which will use axios and reduce bundle size
  ],
  rollupPlugins: ({ pluginName }) => [
    copy({
      targets: [
        {
          src: path.resolve(
            __dirname,
            `./plugins/${pluginName}`,
            './assets/**/*'
          ),
          dest: path.resolve(__dirname, `./dist/plugins/${pluginName}/assets/`),
        },
        {
          src: path.resolve(
            __dirname,
            `./plugins/${pluginName}`,
            './docs/**/*'
          ),
          dest: path.resolve(__dirname, `./dist/plugins/${pluginName}/docs/`),
        },
        {
          src: path.resolve(
            __dirname,
            `./plugins/${pluginName}`,
            './README.md'
          ),
          dest: path.resolve(__dirname, `./dist/plugins/${pluginName}/`),
        },
      ],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};
