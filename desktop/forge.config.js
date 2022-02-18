const {
  utils: { fromBuildIdentifier },
} = require('@electron-forge/core');
const path = require('path');

// Reference: https://www.electronforge.io/configuration
module.exports = {
  // packagerConfig: { ... },
  // electronRebuildConfig: { ... },
  // makers: [ ... ],
  // publishers: [ ... ],
  // plugins: [ ... ],
  // hooks: { ... },
  buildIdentifier: process.env.IS_BETA ? 'beta' : 'prod',

  // https://electron.github.io/electron-packager/main/interfaces/electronpackager.options.html
  packagerConfig: {
    appBundleId: fromBuildIdentifier({
      beta: 'com.tailchat.desktop',
      prod: 'com.tailchat.beta.desktop',
    }),
    icon: path.resolve(__dirname, './build/logo@512'),
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'desktop',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
