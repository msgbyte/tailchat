const path = require('path');

module.exports = {
  externalDeps: ['react', 'styled-components'],
  pluginRoot: path.resolve(__dirname, './web'),
  outDir: path.resolve(__dirname, '../../public'),
};
