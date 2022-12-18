

## [1.3.1](https://github.com/msgbyte/tailchat/compare/v1.3.0...v1.3.1) (2022-12-18)


### Bug Fixes

* 修复Markdown 引用没有样式的bug ([4e21735](https://github.com/msgbyte/tailchat/commit/4e21735d7b11906808c9010a06c45bfe9179fc94))
* 修复markdown引用样式问题 ([1326b9d](https://github.com/msgbyte/tailchat/commit/1326b9dd055ee19719cc90bfc86ebc0e087b6079))
* 优化withKeepAliveOverlay的参数依赖管理，修复不强制渲染时无法取消挂载的情况 ([42e004c](https://github.com/msgbyte/tailchat/commit/42e004ce206afd98f4cba5c04d28f14fd630a2fa))

# [1.3.0](https://github.com/msgbyte/tailchat/compare/v1.2.0...v1.3.0) (2022-12-18)


### Bug Fixes

* 修复markdown组件 ul ol 样式缺失的问题 ([bcfd1db](https://github.com/msgbyte/tailchat/commit/bcfd1db90f56c029b8d438f4038392c3646a7d6f))


### Features

* 用户增加extra字段用于存储额外信息 ([b5cc18f](https://github.com/msgbyte/tailchat/commit/b5cc18fbe1dff57ecfd2c33f87c1ddad122908c5))
* 增加成员面板数量统计 ([cca3e26](https://github.com/msgbyte/tailchat/commit/cca3e2633a5691905cc2dcee1e08b8406c6fd1b0))
* 增加新组件 CopyableText ([6424199](https://github.com/msgbyte/tailchat/commit/6424199be2291133ef53d6d1823c476309eef190))
* 增加自定义用户信息 ([1ad880b](https://github.com/msgbyte/tailchat/commit/1ad880b9485526b80180f9565546ad24252658cd))
* 增加github项目可交互按钮并增加全局code样式 ([5e4ee9b](https://github.com/msgbyte/tailchat/commit/5e4ee9bd421902c9f00d07da8552858ba5758772))
* 增加KeepAliveOverlay组件用于缓存iframe ([373e424](https://github.com/msgbyte/tailchat/commit/373e424e6ad5d56ce478f5952b9b698997c889f9))
* 增加webview组件封装，统一webview渲染方式 ([fcc2684](https://github.com/msgbyte/tailchat/commit/fcc2684a34a5909c27bd49af5a30a331e83120c3))


### Performance Improvements

* 修改dropdown的overlay到menu, 这是因为会被逐渐弃用 ([922f0ad](https://github.com/msgbyte/tailchat/commit/922f0ad229e12d0f3cd4bf25bd7c1171cc6c459e))
* 优化逻辑，并在常用请求增加索引以加速查找 ([0426c2b](https://github.com/msgbyte/tailchat/commit/0426c2bbeff3f1370bbb5edc1b11aa3e8cf26fde))
* 增加更多的性能埋点与报告 ([ed06245](https://github.com/msgbyte/tailchat/commit/ed06245a6416a244efa8cc5c4b5dfed8f24e158d))