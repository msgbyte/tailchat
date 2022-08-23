const path = require('path');
const nodePolyfills = require('rollup-plugin-polyfill-node')

module.exports = {
  externalDeps: ['react', 'react-router'],
  pluginRoot: path.resolve(__dirname, './web'),
  outDir: path.resolve(__dirname, '../../public'),
  rollupPlugins: [nodePolyfills()]
};
