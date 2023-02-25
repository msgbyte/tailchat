const path = require('path');
const _ = require('lodash')

function pickPluginName(text) {
  const [_1, _2, ...others] = text.split('.');
  return others.join('-');
}
function upperFirst(text) {
  return _.upperFirst(_.camelCase(text));
}

module.exports = function (
  /** @type {import('plop').NodePlopAPI} */
  plop
) {
  plop.setHelper('pickPluginName', pickPluginName);
  plop.setHelper('pickPluginNameUp', (text) => {
    return upperFirst(pickPluginName(text));
  });

  const namePrompts = [
    {
      type: 'input',
      name: 'name',
      require: true,
      message: 'Plugin Name',
    }
  ]

  const serverPrompts = [
    {
      type: 'input',
      name: 'id',
      require: true,
      default: 'com.msgbyte.example',
      message: 'Plugin unique id, a unique string in reverse domain name format',
    },
    {
      type: 'input',
      name: 'author',
      message: 'Plugin Author',
      default: 'anonymous',
    },
    {
      type: 'input',
      name: 'desc',
      message: 'Plugin description',
      default: '',
    },
  ];

  // 服务端插件的前端模板代码
  plop.setGenerator('client-plugin', {
    description: 'Pure frontend plugin template',
    prompts: [
      ...namePrompts,
      ...serverPrompts,
    ],
    actions: [
      {
        type: 'addMany',
        destination: path.resolve(process.cwd(), './plugins'),
        base: './client-plugin',
        templateFiles: [
          './client-plugin/**/*',
        ],
        skipIfExists: true,
        globOptions: {},
      },
    ],
  });

  // 服务端插件的前端模板代码
  plop.setGenerator('server-plugin', {
    description: 'Pure backtend plugin template',
    prompts: serverPrompts,
    actions: [
      {
        type: 'addMany',
        destination: path.resolve(process.cwd(), './plugins'),
        base: './server-plugin',
        templateFiles: ['./server-plugin/**/*'],
        skipIfExists: true,
        globOptions: {},
      },
    ],
  });

  // 服务端插件的前端模板代码
  plop.setGenerator('server-plugin-web', {
    description: 'web plugin in backtend plugin template',
    prompts: [
      ...namePrompts,
      ...serverPrompts,
    ],
    actions: [
      {
        type: 'addMany',
        destination: path.resolve(process.cwd(), './plugins'),
        base: './server-plugin-web',
        templateFiles: [
          './server-plugin-web/**/*',
          './server-plugin-web/*/.ministarrc.js',
        ],
        skipIfExists: true,
        globOptions: {},
      },
    ],
  });

  // 服务端插件的前端模板代码
  plop.setGenerator('server-plugin-full', {
    description: 'Full backend plugin template',
    prompts: [
      ...namePrompts,
      ...serverPrompts,
    ],
    actions: [
      {
        type: 'addMany',
        destination: path.resolve(process.cwd(), './plugins'),
        base: './server-plugin-full',
        templateFiles: [
          './server-plugin-full/**/*',
          './server-plugin-full/*/.ministarrc.js',
        ],
        skipIfExists: true,
        globOptions: {},
      },
    ],
  });
};
