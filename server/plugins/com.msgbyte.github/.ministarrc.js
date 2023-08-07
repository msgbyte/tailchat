const path = require('path');

module.exports = {
  externalDeps: ['react', 'react-router'],
  pluginRoot: path.resolve(__dirname, './web'),
  outDir: path.resolve(__dirname, '../../public'),
};
