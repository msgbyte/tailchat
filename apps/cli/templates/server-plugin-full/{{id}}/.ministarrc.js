const path = require('path');

const pluginRoot = path.resolve(__dirname, './web');
const outDir = path.resolve(__dirname, '../../public');

module.exports = {
  externalDeps: [
    'react',
    'react-router',
    'axios',
    'styled-components',
    'zustand',
    'zustand/middleware/immer'
  ],
  pluginRoot,
  outDir,
};
