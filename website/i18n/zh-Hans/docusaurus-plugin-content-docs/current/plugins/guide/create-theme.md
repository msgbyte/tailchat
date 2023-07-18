---
sidebar_position: 3
title: 开发一个主题插件
---

在 `Tailchat` 中开发插件是非常方便的，我们从开发一个主题插件来开始

## 最终效果

![](/img/tutorial/plugin/2.png)

![](/img/tutorial/plugin/3.png)

![](/img/tutorial/plugin/4.png)

## 创建插件

> 如果是第一次开发需要确保已经初始化了插件开发环境。 [了解更多](./init-env.md)

```bash
tailchat create --template client-plugin 
```

因为主题样式是一个纯前端的实现，因此我们选择`client-plugin`模板

通过交互式命令行提示完成创建工作

![](/img/tutorial/plugin/5.png)

此时的目录结构应该是这样的:
```
.
├── package-lock.json
├── package.json
├── node_modules
└── plugins
    └── com.test.hutao
        ├── manifest.json
        ├── package.json
        ├── src
        │   ├── index.tsx
        │   └── translate.ts
        ├── tsconfig.json
        └── types
            └── tailchat.d.ts
```

这时候我们就可以立即开始编译插件了

```bash
npm run plugins:all
```

编译的产物会出现在 `/dist/plugins/com.test.hutao`。通过修改 `mini-star` 的配置可以让其输出在其他目录 *(这点会在服务端开发插件中会用到)*。

## 在 Tailchat 中安装插件

对于前端插件，我们需要把产物用一个http静态服务提供出来，比如在本地开发中我们可以这样:

```bash
npx http-server .
```

![](/img/tutorial/plugin/6.png)

此时我们可以通过地址访问到我们编译出来的结果了，如 [http://127.0.0.1:8080/dist/plugins/com.test.hutao/index.js](http://127.0.0.1:8080/dist/plugins/com.test.hutao/index.js)

在 Tailchat 中提供了手动安装插件的方式，我们可以通过手动安装的方式安装插件。

复制插件目录下 `plugins/com.test.hutao/manifest.json` 的内容，粘贴到手动安装插件部分。

修改url为可以访问到的真实地址。点击确定按钮后自动执行安装命令:

![](/img/tutorial/plugin/7.png)

如果提示安装成功，打开控制台则可以看到对应输出:

![](/img/tutorial/plugin/8.png)

这里是插件里默认生成的逻辑，当日志输出了插件加载完毕的提示说明我们的插件已经被安装成功了。

## 编写样式文件并应用

因为我们需要修改主题样式，因此涉及到样式文件和静态资源的处理。接下来我们先来创建我们主题的样式

在`plugins/com.test.hutao/src/theme.less`中写入样式:

```less
#tailchat-app.theme-genshin-hutao {
  @primary-color: #dd5545;

  --tc-primary-color: @primary-color;
  --tc-background-image: url(./bg.jpg);
  --tc-content-background-image: url(./avatar.png);
  --tc-content-background-image-opacity: 0.15;

  .bg-navbar-light {
    background-color: @primary-color;

    .bg-gray-400 {
      background-color: darken(@primary-color, 10%);
    }
  }

  .bg-sidebar-light {
    background-color: lighten(@primary-color, 20%);
  }

  .bg-content-light {
    background-color: lighten(@primary-color, 40%);
  }

  &.dark {
    --tc-primary-color: darken(@primary-color, 10%);

    .dark\:bg-navbar-dark {
      background-color: darken(@primary-color, 40%);
    }

    .dark\:bg-sidebar-dark {
      background-color: darken(@primary-color, 20%);
    }

    .dark\:bg-content-dark {
      background-color: @primary-color;
    }
  }
}
```

这个样式文件做了三件事情:

- 通过 `less变量` 的方式指定主色调, 大幅度减少冗余代码
- 通过 `css变量` 的方式指定 `Tailchat` 的各处背景图, 主要是登录页的背景图与头像
- 在根节点使用`#tailchat-app.theme-genshin-hutao`选择器确保不会污染全局样式。

**对应的，需要在根节点下放入`bg.jpg`和`avatar.png`作为静态资源**

为了让 `Tailchat` 能够知道有这么一个主题存在，我们需要将这个主题相关的信息注册到 `Tailchat` 中.

```js
// plugins/com.test.hutao/src/index.tsx
import { regPluginColorScheme, sharedEvent } from '@capital/common';

regPluginColorScheme({
  label: '原神-胡桃测试主题',
  name: 'light+genshin-hutao',
});

sharedEvent.on('loadColorScheme', (colorSchemeName) => {
  if (colorSchemeName === 'light+genshin-hutao') {
    console.log('正在加载胡桃主题...');
    import('./theme.less');
  }
});
```

这个插件做了两件事情:
- 调用 `regPluginColorScheme` 将主题生命注册到 `Tailchat` 中，这样 `Tailchat` 就会在系统设置中显示该主题。
  - 需要注意的是主题的 `name` 是以 `<color>+<theme-name>`的形式组成的，默认的 `Tailchat` 会提供 `auto`/`light`/`dark`三种配色方案，这里是指基于亮色模式追加样式覆盖的意思。
- 通过 `sharedEvent` 监听加载主题样式事件，如果配色主题是我们的主题，则异步加载主题(异步加载的目的是减少无意义的网络请求)

此时我们的编译是无法通过的，因为对于less类型的文件还没有处理

`mini-star` 已经默认对less文件进行处理，我们只需要安装一下 `less` 包以后 `mini-star` 会自动调用安装的less进行编译

```bash
npm install less
```

此时执行`npm run plugins:all`进行编译操作，最后目录应当如下:

```
.
├── dist
│   └── plugins
│       └── com.test.hutao
│           ├── index.js
│           ├── index.js.map
│           ├── theme-475203da.js
│           └── theme-475203da.js.map
├── package-lock.json
├── package.json
└── plugins
    └── com.test.hutao
        ├── manifest.json
        ├── package.json
        ├── src
        │   ├── avatar.png
        │   ├── bg.jpg
        │   ├── index.tsx
        │   ├── theme.less
        │   └── translate.ts
        ├── tsconfig.json
        └── types
            └── tailchat.d.ts
```

为了便于管理，`mini-star` 在处理less引用的静态资源时会直接以 `base64` 的格式把图片打包到样式文件中。因此主题文件会非常大，这也是为什么我们需要按需异步加载的原因

![](/img/tutorial/plugin/9.png)

因为我们之前已经在 Tailchat 中安装过我们开发中的插件了，因此直接刷新即可。

在左下角设置菜单中点开系统设置的主题页面，我们就可以看到我们的主题了。切换过去立即界面会变成我们想要的主题风格。

![](/img/tutorial/plugin/10.png)


## 源码参考

官方的该主题实现可以访问 [https://github.com/msgbyte/tailchat/tree/master/client/web/plugins/com.msgbyte.theme.genshin](https://github.com/msgbyte/tailchat/tree/master/client/web/plugins/com.msgbyte.theme.genshin) 查看
