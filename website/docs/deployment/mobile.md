---
sidebar_position: 12
title: Mobile Self Compile (optional)
---

The source code of `Tailchat` mobile terminal is located in `client/mobile`. The technology stack is `react-native`

You can download the compiled general version directly from the official website: [https://tailchat.msgbyte.com/downloads](https://tailchat.msgbyte.com/downloads), or compile it yourself from the source code

This section mainly explains how to compile the mobile version of `Tailchat`.

## Prepare the development environment

You can see the complete development environment preparation operation at [https://reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup), so I won’t go into details here.

### Install dependencies

```bash
cd client/mobile
yarn
```

### Environment check

```bash
yarn doctor
```

## Prepare environment variables

```bash
cp.env.example.env
```

In the `.env` file we configure the required environment variables for compilation

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

## Certificate signing

If you are only using it for testing, you can skip this section and Tailchat will sign it for you using a public test certificate.

### Android

If you need to use your own certificate for signing, you need to fill in the following:

```ini
TAILCHAT_UPLOAD_STORE_FILE=
TAILCHAT_UPLOAD_STORE_PASSWORD=
TAILCHAT_UPLOAD_KEY_ALIAS=
TAILCHAT_UPLOAD_KEY_PASSWORD=
```

Need to fill in: certificate file name, password, alias, alias password
The certificate file needs to be placed in the `client/mobile/android/app` directory, usually a `*.keystore` file

> As for how to generate it, you can use `Android Studio` or `keytool` tool to generate it.

### iOS

TODO

## Push

`Tailchat` implements Android multi-vendor message push by integrating personal tweets as a relay

You can get all the required configuration in the application configuration of `getui`

Among them `GETUI_APPID`, `GETUI_APPKEY`, `GETUI_APPSECRET` are filled in in order

Corresponding configuration is required on the server side `GETUI_APPID`, `GETUI_APPKEY`, `GETUI_MASTERSECRET` so that the self-deployed push service can send push messages correctly

![](/img/misc/getui.png)

### Manufacturer Push

Manufacturer push can be turned on or off as needed

The source code needs to be modified as follows:
- `manifestPlaceholders` section and `dependencies` section of `client/mobile/android/app/build.gradle`
- `.env` environment variable configuration


## Compile

### Android

```bash
cd android
./gradlew assembleRelease
```

### iOS

iOS compilation needs to be done through `xcode`

> Screenshot cannot be taken due to lack of equipment, please follow the public information on the Internet.

### FAQ

If the following types of errors occur:

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

It may be because your environment variable is missing, you can leave the value empty, but the entry must exist

like:
```ini
GETUI_APPID=xxxxxxxxxxxx
GETUI_APPKEY=yyyyyyyyy
GETUI_APPSECRET=zzzzzzzzzz
GETUI_HUAWEI_APP_ID=
```

instead of

```ini
GETUI_APPID=xxxxxxxxxxxx
GETUI_APPKEY=yyyyyyyyy
GETUI_APPSECRET=zzzzzzzzzz
```

#### Can I compile it myself and publish it to the app store?

Yes, but please modify the application name, package name, icon and other information to prevent conflicts with official applications.
