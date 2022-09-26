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

  const serverPrompts = [
    {
      type: 'input',
      name: 'id',
      require: true,
      default: 'com.msgbyte.example',
      message: '插件唯一id, 以反域名格式的唯一字符串',
    },
    {
      type: 'input',
      name: 'author',
      message: '插件作者',
      default: 'anonymous',
    },
    {
      type: 'input',
      name: 'desc',
      message: '插件描述',
      default: '',
    },
  ];

  // 服务端插件的前端模板代码
  plop.setGenerator('server-plugin', {
    description: '服务端插件模板代码',
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
    description: '服务端插件的前端模板代码',
    prompts: [
      {
        type: 'input',
        name: 'name',
        require: true,
        message: '插件名称',
      },
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
    description: '服务端插件的完整模板代码',
    prompts: [
      {
        type: 'input',
        name: 'name',
        require: true,
        message: '插件名称',
      },
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
