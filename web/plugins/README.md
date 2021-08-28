## 如何创建一个插件

### 内部插件

> 内部插件是指随 `tailchat` 分发而提供的插件

在web目录执行:

```bash
yarn ministar createPlugin 
```

插件名请准守反域名模式, 如: `com.msgbyte.xxx`

设置`tsconfig.json`如下: 
```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "baseUrl": "./src",
    "esModuleInterop": true,
    "jsx": "react",
    "paths": {
      "@capital/*": ["../../../src/plugin/*"],
    }
  }
}
```

创建一个`manifest.json`文件

示例:
```json
{
  "label": "网页面板插件",
  "name": "com.msgbyte.webview",
  "url": "/plugins/com.msgbyte.webview/index.js",
  "version": "0.0.0",
  "author": "msgbyte",
  "description": "为群组提供创建网页面板的功能",
  "requireRestart": false
}
```
