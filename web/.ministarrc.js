const copy = require('rollup-plugin-copy');
const path = require('path');

module.exports = {
  externalDeps: ['react'],
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
      ],
    }),
  ],
};
