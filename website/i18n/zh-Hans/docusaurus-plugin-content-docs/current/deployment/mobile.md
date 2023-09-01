---
sidebar_position: 12
title: 移动端自编译(可选)
---

`Tailchat` 移动端的源码位于 `client/mobile`. 技术栈为 `react-native`

你可以直接在官网中下载已经编译好的通用版本: [https://tailchat.msgbyte.com/downloads](https://tailchat.msgbyte.com/downloads)，或者自行通过源码编译

本节内容主要就是讲解如何对 `Tailchat` 的移动端进行编译。

## 准备开发环境

你可以在 [https://reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup) 看到完整的开发环境准备操作，这里就不再赘述。

### 安装依赖

```bash
cd client/mobile
yarn
```

### 环境检查

```bash
yarn doctor
```

## 准备环境变量

```bash
cp .env.example .env
```

在 `.env` 文件中我们来配置所需的环境变量用于编译

```ini
TAILCHAT_UPLOAD_STORE_FILE=
TAILCHAT_UPLOAD_STORE_PASSWORD=
TAILCHAT_UPLOAD_KEY_ALIAS=
TAILCHAT_UPLOAD_KEY_PASSWORD=

GETUI_APPID=
GETUI_APPKEY=
GETUI_APPSECRET=
GETUI_HUAWEI_APP_ID=
```

## 证书签名

如果仅用于测试，则可以跳过本节内容，Tailchat 会为你使用公开测试证书进行签名

### Android

如果需要使用你自己的证书进行签名，你需要填入以下内容:

```ini
TAILCHAT_UPLOAD_STORE_FILE=
TAILCHAT_UPLOAD_STORE_PASSWORD=
TAILCHAT_UPLOAD_KEY_ALIAS=
TAILCHAT_UPLOAD_KEY_PASSWORD=
```

需要依次填入: 证书文件名、密码、别名、别名密码
证书文件需要放在`client/mobile/android/app`目录下，一般是 `*.keystore` 文件

> 至于具体如何生成，你可以使用 `Android Studio` 或者 `keytool` 工具来生成，这个有很多公开资料就不在此赘述了

### iOS

TODO

## 推送

`Tailchat` 通过集成个推作为中转来实现安卓多厂商的消息推送

你可以在 `getui` 的应用配置中获得所有所需要的配置

其中 `GETUI_APPID`, `GETUI_APPKEY`, `GETUI_APPSECRET` 依次填入

在服务端需要对应配置 `GETUI_APPID`, `GETUI_APPKEY`, `GETUI_MASTERSECRET` 来使自部署的推送服务能正确发送推送

![](/img/misc/getui.png)

### 厂商推送

厂商推送可以按需打开或者关闭

需要修改源码如下:
- `client/mobile/android/app/build.gradle` 的 `manifestPlaceholders` 部分 和 `dependencies` 部分
- `.env` 环境变量配置


## 编译

### 安卓

```bash
cd android
./gradlew assembleRelease
```

### iOS

iOS 编译需要通过 `xcode` 进行操作

> 因为缺少设备无法截图，请按照网络上公开资料进行操作即可

### 常见问题

如果出现以下类型的报错:

```
error Failed to install the app. Make sure you have the Android development environment set up: https://reactnative.dev/docs/environment-setup.
Error: Command failed: gradlew.bat app:installDebug -PreactNativeDevServerPort=8081

FAILURE: Build failed with an exception.

* What went wrong:
Could not determine the dependencies of task ':app:compileDebugJavaWithJavac'.
> Could not resolve all dependencies for configuration ':app:debugRuntimeClasspath'.
   > Could not create task ':app:generateDebugLintModel'.
      > java.lang.NullPointerException (no error message)

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 27s
```

可能是因为你的环境变量有缺失, 你可以保留值为空，但该条目必须存在

如:
```ini
GETUI_APPID=xxxxxxxxxxxx
GETUI_APPKEY=yyyyyyyyy
GETUI_APPSECRET=zzzzzzzzzz
GETUI_HUAWEI_APP_ID=
```

而不是

```ini
GETUI_APPID=xxxxxxxxxxxx
GETUI_APPKEY=yyyyyyyyy
GETUI_APPSECRET=zzzzzzzzzz
```

#### 我能自己编译后发布到应用商店么

可以，但是请修改应用的名称、包名、图标等信息防止与官方应用冲突
