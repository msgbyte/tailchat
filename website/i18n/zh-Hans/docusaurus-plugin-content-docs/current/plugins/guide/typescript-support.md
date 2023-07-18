---
sidebar_position: 2
title: Typescript 类型支持
---

在 `Tailchat` 中拥有一些从核心项目共享出来的工具函数或者组件，你可以通过 `@capital/common` 或 `@capital/component` 来引用。

当然，如果直接引用的话会有一些类型问题。因为此时typescript的类型系统是不知道能够引入什么以及有什么类型的。

在这里可能会有两种情况:

## 在Tailchat本体项目中进行开发

你可以通过`tsconfig.json`的`paths`字段来引入同一目录下的文件, 这样在解析时typescript可以直接加载完整的类型系统

如:

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "esModuleInterop": true,
    "jsx": "react",
    "paths": {
      "@capital/*": ["../../../src/plugin/*"],
    }
  }
}
```

## 在独立项目中进行开发

你可以通过获取 Tailchat 预生成好的声明文件进行开发。

> 因为类型要手动重写因为有部分类型尚是any。但是能够保证开发者不会引入不存在的函数

如果你使用的是 `tailchat create` 命令创建的项目，命令行工具模板已为您添加了如下命令

```json
"scripts": {
  "sync:declaration": "tailchat declaration github"
},
```

用法

```bash
pnpm sync:declaration
```

该命令会自动拉取远程的配置文件并写入当前目录下的 `types/tailchat.d.ts` 文件中。如果你是手动创建的项目，你可以将其添加到你的`package.json`中以方便后续使用
