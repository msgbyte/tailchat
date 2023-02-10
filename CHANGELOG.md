

## [1.6.2](https://github.com/msgbyte/tailchat/compare/v1.6.1...v1.6.2) (2023-02-10)


### Bug Fixes

* 修复收件箱过长导致样式问题 ([4088de9](https://github.com/msgbyte/tailchat/commit/4088de907f56af6f39ce893bd7d28449b0d64f60))
* 修复在亮色模式下navbar-more位置处自定义面板icon颜色不匹配问题 ([6be47e1](https://github.com/msgbyte/tailchat/commit/6be47e1f57c9f5aacaafc9523267a4e0164dbba3))


### Features

* 更新创建插件客户端模板，增加翻译 ([cda54eb](https://github.com/msgbyte/tailchat/commit/cda54ebdb68f1169e1668efd7262bd27df0155a3))
* 话题卡片增加已读未读容器 ([84584c8](https://github.com/msgbyte/tailchat/commit/84584c8bed61a44eefb8ce25b0a3dac99cd427c0))
* 增加 inbox.append 接口，用于内部调用增加收件箱内容 ([56c9f99](https://github.com/msgbyte/tailchat/commit/56c9f99c6734a5fd1bc0af63a8ab5aa05a3b59ea))
* 增加导航栏相关的插件面板注册 ([53b7195](https://github.com/msgbyte/tailchat/commit/53b719514122958de89502cbc05439d959426b14))
* 增加环境变量用于禁用日志选项 ([de37f64](https://github.com/msgbyte/tailchat/commit/de37f647a0adb21c86bf6203b830cd381841c76e))
* 增加机器人接受到新的收件箱信息时调用回调 ([7fb9ddc](https://github.com/msgbyte/tailchat/commit/7fb9ddc4b5d5477b8d17b8ab01363ff517453e99))
* 增加内置的文件发送功能 ([469f341](https://github.com/msgbyte/tailchat/commit/469f34134c0eb88d2fdf15afd4a136705750b753))
* 增加前端编译信息部分上下文暴露，用于提前获取应用信息 ([037e37d](https://github.com/msgbyte/tailchat/commit/037e37d51548cfe2f4568aa74bb7f7fc6f7e167d))
* 增加前端ack面板的概念，抽象化已读未读的面板属性而不是单纯的文本面板 ([7d14641](https://github.com/msgbyte/tailchat/commit/7d1464104abb0d135763520aff564eb4efc53810))
* 增加用户封禁标识与断开连接功能 ([e8a705d](https://github.com/msgbyte/tailchat/commit/e8a705dad74d48f7173c9ed8a578bb550f2acb70))
* 增加在线听音乐插件 ([9090ee8](https://github.com/msgbyte/tailchat/commit/9090ee8a94ca62eeeb030ee1e9447c5904c4281a))
* **openapi:** 增加开放平台机器人回调编辑 ([3382189](https://github.com/msgbyte/tailchat/commit/3382189dee6d0b7cf891601e6132679209bcc775))
* **server:** 增加面板feature定义，增加subscribe用于给自定义面板增加订阅功能(之前写死文本面板会有这个效果) ([b938fcb](https://github.com/msgbyte/tailchat/commit/b938fcb12ccd38c0d8bbde0035ef68aca136891a))


### Performance Improvements

* 优化导航栏高度不够的情况下的表现 ([f6483dd](https://github.com/msgbyte/tailchat/commit/f6483dd396024b19eac28740169a5ce187a9abda))
* 优化消息已读容器逻辑，方便第三方复用 ([66a67bf](https://github.com/msgbyte/tailchat/commit/66a67bf02bd6cebf63a5e59fc8dc8813923ce927))
* 优化github app 并增加白名单模糊匹配 ([f77d267](https://github.com/msgbyte/tailchat/commit/f77d267f8032c4e2fe895f6d629cd8f67fa60267))
* 增加emoji图片picker的内置打包，优化在国内网络获取图集慢的问题 ([056d185](https://github.com/msgbyte/tailchat/commit/056d185debd4a8cb49b2b67c2b7127fa7c5abaf6))

## [1.6.1](https://github.com/msgbyte/tailchat/compare/v1.6.0...v1.6.1) (2023-02-02)


### Bug Fixes

* **cli:** v1.5.4 修复bench命令的计算问题和容错机制 ([9b7499a](https://github.com/msgbyte/tailchat/commit/9b7499a23eb6b7c1da93566db1fa02db3e335c1e))
* 修复admin socketio平台链接协议问题 ([089dbbb](https://github.com/msgbyte/tailchat/commit/089dbbb37fa07076e36a97b85b22559fd1233699))
* 修复admin静态资源的访问路径问题 ([3635653](https://github.com/msgbyte/tailchat/commit/3635653798160062e347b6b345ef8e33243d5096))
* 修复pin面板后宽度异常的bug ([b44ccfd](https://github.com/msgbyte/tailchat/commit/b44ccfd76204d6d8ac1218283e68dd02739660fa))
* 修复tailchat bench message 命令参数 ([11f28af](https://github.com/msgbyte/tailchat/commit/11f28af3bdeca6fe9c86d673d8a85094bf697996))
* 修复修改免打扰ui不会更新的bug ([3121002](https://github.com/msgbyte/tailchat/commit/312100277c95be687dd9ea792d5145bbf43b74ab))
* 修复国际化文案问题 ([e56eda0](https://github.com/msgbyte/tailchat/commit/e56eda0387799cdfb4adaed2247a2537758dd5c8))
* 修复注册账号时没有增加长度限制的bug ([2ed79fb](https://github.com/msgbyte/tailchat/commit/2ed79fb5dd5a91568b9b6283cae5e2ae46a3c455))


### Features

* **admin:** 增加user资源的国际化写法 ([184daa3](https://github.com/msgbyte/tailchat/commit/184daa3e733fffe263943660675332dbd3f6d4d4))
* **admin:** 增加用户详情页，并增加重置密码功能 ([8a8be0b](https://github.com/msgbyte/tailchat/commit/8a8be0b0856fd51aba1aa79fa59c9a0d31f35d52))
* **admin:** 增加群组列表详情页的展示 ([6dcfd64](https://github.com/msgbyte/tailchat/commit/6dcfd647f55344f4308f9abad7030f0c61b7437c))
* 升级emoji-mart的版本: v3 -> v5 ([749c2f7](https://github.com/msgbyte/tailchat/commit/749c2f7961f9fa8307a53f338ada77b888e71553))
* 增加socket.io admin ([9f71fc0](https://github.com/msgbyte/tailchat/commit/9f71fc05e45fd632af60984269b2df5333897f9c))
* 增加tailchat usage命令 ([1253101](https://github.com/msgbyte/tailchat/commit/12531017871b2573180a7f8b9ffaa56dd4185f73))
* 增加引用时可以跳转到某个面板 ([1e00834](https://github.com/msgbyte/tailchat/commit/1e00834b1a0610ebe007c70ad9e94fbca94912df))
* 增加成员管理面板 ([31c62b2](https://github.com/msgbyte/tailchat/commit/31c62b21a43638dd10869cf8a3e0914079f49d8c))
* 设定静音状态下群组小红点为灰色 ([0c5e5c3](https://github.com/msgbyte/tailchat/commit/0c5e5c3cf47b570d4ec060a9ff5e7656aadfe58e))


### Performance Improvements

* **admin:** 整理admin鉴权相关的逻辑并强化对于token过期的处理 ([998e7a6](https://github.com/msgbyte/tailchat/commit/998e7a67073fa8d5db514fd213ad6acb66bfe1f1))
* break change: socketio传输效率优化 ([424d451](https://github.com/msgbyte/tailchat/commit/424d451cd9a471314d2f620994e77b42adc5012e))
* **cli:** 优化bench命令对于请求超时(失败)的处理 ([8aa944e](https://github.com/msgbyte/tailchat/commit/8aa944e7e513b510703cea7b25b5f8f8100f8803))
* 优化在小屏幕移动端上的界面表现，移除不恰当的边距 ([90a30c7](https://github.com/msgbyte/tailchat/commit/90a30c7e98fdf5e0f3151e83d1090957fe5fb113))

# [1.6.0](https://github.com/msgbyte/tailchat/compare/v1.5.0...v1.6.0) (2023-01-25)

### Hightlight

- 增加了 **Admin后台管理系统** 初版代码
- 增强了邮箱认证相关逻辑
- 声网插件增加了屏幕共享

### Bug Fixes

* 修复类型问题 ([79390d3](https://github.com/msgbyte/tailchat/commit/79390d329eac877ead7033f74f6a65e453fd44e1))
* 修复校验失败不会跳转回登录页的bug ([79581d6](https://github.com/msgbyte/tailchat/commit/79581d6226a456e2f9fa88ec5b62e7521081aad3))


### Features

* 页面增加opengraph属性 ([64859eb](https://github.com/msgbyte/tailchat/commit/64859eb885df59de9928ac231f3b12ee036fdd6d))
* 邮箱校验属性变更 ([ce97957](https://github.com/msgbyte/tailchat/commit/ce97957fa94dda5228c3b4d2ceb088622e8f0260))
* 增加更多的资源(message/group/file) ([bacb5b3](https://github.com/msgbyte/tailchat/commit/bacb5b30313317097048c5f25f08ecd105dbd8a6))
* 增加屏幕共享功能 ([2747e09](https://github.com/msgbyte/tailchat/commit/2747e0945ece59aeff979a355a8175e5b952f1f5))
* 增加群组卡片创建者标签以及角色列表 ([f559c2b](https://github.com/msgbyte/tailchat/commit/f559c2ba96649701e392814d6e400ca27e21d651))
* 增加文件列表 ([4f51ec4](https://github.com/msgbyte/tailchat/commit/4f51ec4aa85af2dc024683365405d6239aacae1a))
* 增加邮箱认证功能 ([2e774d1](https://github.com/msgbyte/tailchat/commit/2e774d104f5ffb470c5a3358a289373a3eb7441a))
* 增加注册账号/游客认领账号时进行邮箱校验(配置) ([099a906](https://github.com/msgbyte/tailchat/commit/099a906b4a55a9abbb1cb44fdc72002c35b78e12))
* 增加admin登录鉴权逻辑 ([2c1aa02](https://github.com/msgbyte/tailchat/commit/2c1aa02428b0ea04dde1ac0cf40511c690e2e635))
* 增加broker并增加相关接口 ([7cdb522](https://github.com/msgbyte/tailchat/commit/7cdb5220c5875a915178e283170e805606c1e4c6))
* 增加tailchat 网络菜单 ([1151417](https://github.com/msgbyte/tailchat/commit/11514175e6ad7eeac2c7d6f5952d9b8f533eb270))
* admin 初始化与基本界面 ([96292a2](https://github.com/msgbyte/tailchat/commit/96292a23baacc39767a598a5976b08ef7e3e270c))
* admin 增加dashboard ([867fbd3](https://github.com/msgbyte/tailchat/commit/867fbd322318db87531a4043c8e57149d21333fc))
* cli 增加更新提示 ([09b56b9](https://github.com/msgbyte/tailchat/commit/09b56b9c7cd4c2f79642f53b3d61ca7203e3c815))
* cli docker init初始化增加引导 ([ee9a01d](https://github.com/msgbyte/tailchat/commit/ee9a01d552f2b55075bc52f732ee2dde7c2de35d))
* Loadable增加配置项允许增加加载中提示 ([f13478a](https://github.com/msgbyte/tailchat/commit/f13478a98441a3a643bff8169fc62a07710aca9d))
* tailchat docker init 命令增加自定义文件夹支持 ([9b4b375](https://github.com/msgbyte/tailchat/commit/9b4b375d08958f4a2e6dcdb73477846fde1e3007))


### Performance Improvements

* 优化获取群组设置的逻辑，增强代码可读性 ([0f5dc6a](https://github.com/msgbyte/tailchat/commit/0f5dc6aec6d8e3ca7ee85ee7ea63fc196cf5652d))
* 优化网络请求错误抛出 ([c0ecd5e](https://github.com/msgbyte/tailchat/commit/c0ecd5e25b6b0afc905dc522a659a52abcb6f0f5))
* 优化getUserOnlineStatus的网络请求连接，自动合并多个请求为一个后端请求 ([8f58788](https://github.com/msgbyte/tailchat/commit/8f587887eeabd96eb6c5a1c0b015279f1caf1a40))

# [1.5.0](https://github.com/msgbyte/tailchat/compare/v1.4.0...v1.5.0) (2023-01-21)


### Bug Fixes

* 修复登录时可能会因为navRedirect的问题导致循环 ([8b95af0](https://github.com/msgbyte/tailchat/commit/8b95af0d78157ee6eeb4f233b4ea266299fe688e))
* 修复内置用户信息无法获取到翻译的问题 ([935a26a](https://github.com/msgbyte/tailchat/commit/935a26ab095b8b2a02b21ab7691c5f10a54fca21))
* 修复删除身份组后位置不正确的bug ([170a243](https://github.com/msgbyte/tailchat/commit/170a243a66d71b7bec30dfb29d5d5eaeeb753c6f))
* 修复收件箱notfound的图片样式问题 ([29c7ed5](https://github.com/msgbyte/tailchat/commit/29c7ed5bbc4779a344f55cf49e223dc9030761a4))
* 修复fetchNearbyMessage获取数据/顺序不正确的bug ([b74b956](https://github.com/msgbyte/tailchat/commit/b74b956e45c43d3fca7a96f9c786d9c0baf723a1))
* 修复github webhook如果没有body会导致渲染异常的问题 ([71077d4](https://github.com/msgbyte/tailchat/commit/71077d4877cd5a1fec62099bbed690701bf9fe4d))


### Features

* 个人面板菜单选项增加记忆 ([fdb1830](https://github.com/msgbyte/tailchat/commit/fdb1830e923a99075543cea6fbd45b7fa09673b7))
* 命令行应用增加tailchat docker init命令 ([f1238ba](https://github.com/msgbyte/tailchat/commit/f1238badbd44f50940cb12ae3e1a2314629f43af))
* 收件箱侧边栏展示 ([db917d2](https://github.com/msgbyte/tailchat/commit/db917d26b9e015f245c851049e3982a5e4c53f34))
* 收件箱增加已读未读标识 ([af03bec](https://github.com/msgbyte/tailchat/commit/af03bec1a913561acec755831d4de684eb41f774))
* 收件箱增加message类型的消息内容渲染 ([a9f2d00](https://github.com/msgbyte/tailchat/commit/a9f2d00d9eca8882200a258f0596416ebed1e985))
* 收件箱增加SectionHeader ([d8ac078](https://github.com/msgbyte/tailchat/commit/d8ac078461bfe3d39679ef5d558e9d12be8c31f9))
* 消息通知插件增加开关允许禁用内置的提示音 ([c02dbed](https://github.com/msgbyte/tailchat/commit/c02dbed7e0a77300108e69f1f059b4a7aaf63fb9))
* 优化通知功能，增加icon小红点，增加提示音，优化通知场景 ([350371d](https://github.com/msgbyte/tailchat/commit/350371d6a3f84ff485cf8f97236dc284d3161d18))
* 增加工具蛙插件 ([8d539d2](https://github.com/msgbyte/tailchat/commit/8d539d2fa90d1e7d9f59b2ca00e9b44370104c28))
* 增加收件箱操作: 全部已读和清空收件箱 ([677cf76](https://github.com/msgbyte/tailchat/commit/677cf7689bf151a699e79b12cdbea428fdea28c2))
* 增加收件箱已读标识 ([badfaa0](https://github.com/msgbyte/tailchat/commit/badfaa07d343c892c1569c7598675dec554060e3))
* 增加拖拽文件发送图片的功能 ([338af09](https://github.com/msgbyte/tailchat/commit/338af097cadbc7cb1303f0169caeeb6e20538a5a))
* 增加未选中任何消息状态的placeholder ([c760d44](https://github.com/msgbyte/tailchat/commit/c760d44e87ece7d0b6513fe013c78bc15638fc62))
* 增加系统设置页面的自定义设置项注册(for plugin) ([e9b96a1](https://github.com/msgbyte/tailchat/commit/e9b96a15a238904670d6bf30c177a25e43e79f4a))
* 增加消息高亮容器用于高亮消息 ([590b572](https://github.com/msgbyte/tailchat/commit/590b572263c3752ec165941ee603c3b7163e923c))
* 增强邀请页面的已加入检查，如果已登录则会发起请求查询是否为群组成员 ([f5b71b0](https://github.com/msgbyte/tailchat/commit/f5b71b076ec59a764075f7e3acf25308b68952bc))
* github push event 增加提交者链接 ([bc64729](https://github.com/msgbyte/tailchat/commit/bc6472985758fc388f9a2ac4a4da11c1bf6e0be6))
* notify增加点击输入框跳转的功能，并增加api调用页面跳转的方式 ([1290c1e](https://github.com/msgbyte/tailchat/commit/1290c1e42646ff4fbf1e36ee5a7cd19750485774))

# [1.4.0](https://github.com/msgbyte/tailchat/compare/v1.3.1...v1.4.0) (2023-01-07)


### Bug Fixes

* 为setLastMessageMap增加数组类型校验 ([f622d6a](https://github.com/msgbyte/tailchat/commit/f622d6a37b9a3f87b26f5903504a73bc39d031d4))
* 修复挂断通话后仍然会显示正在使用摄像头/麦克风小红点的bug ([98af149](https://github.com/msgbyte/tailchat/commit/98af14969a7ff9f826e1bf015b5d88688eb81576))
* 修复迁移(升级)gateway api导致的静态文件服务返回错误的bug ([066eb96](https://github.com/msgbyte/tailchat/commit/066eb963694ea18a70b8af99e99b46076e7f8687))
* 修复声网控制器逻辑操作写反的问题 ([b515623](https://github.com/msgbyte/tailchat/commit/b515623cbfd48d3944904ac220764b8c69dd6fb7))
* 修复推送在mac os 13 以下 safari 不支持registration.showNotification的问题 ([960f6e6](https://github.com/msgbyte/tailchat/commit/960f6e6c23081585a1698f28176bd5fc3482e7f8))
* 修复消息会话点击后会卡死的问题 ([345e315](https://github.com/msgbyte/tailchat/commit/345e31553a34e18dca9b66badb60d28c44b597a5))
* 修复新加入成员不会更新群组列表的bug ([df3da7e](https://github.com/msgbyte/tailchat/commit/df3da7edba9a7949b84017c050470aa682a1369c))
* 修复在某些场景下计算高度会少1px导致无法 ([7644924](https://github.com/msgbyte/tailchat/commit/7644924ae93d2e1d4e4b4057ed56308f60840994))
* 修复在某些时候跳转引用过时导致无法跳转的bug ([5c230ca](https://github.com/msgbyte/tailchat/commit/5c230caef33378c4c0a896d2b55204a03cf74e84))
* 修复agora插件展开 收起的热区异常并顺便增加了分割线以优化显示 ([35e557f](https://github.com/msgbyte/tailchat/commit/35e557f2869725f8b2ef41af2791bb3c12ea1af1))
* 修复t参数如果是带参数的调用的话无法覆盖语言的bug ([eb3b5f9](https://github.com/msgbyte/tailchat/commit/eb3b5f9c00cdef22b02d5d724f02b566d61306d6))
* 修复workbox匹配规则问题 ([5624b92](https://github.com/msgbyte/tailchat/commit/5624b92933ada7425301c847202bf70d5431989a))
* 增加前置的beforeinstallprompt以修复加载过晚无法监听到pwa安装事件的问题 ([94fcbb7](https://github.com/msgbyte/tailchat/commit/94fcbb7445e92a0e2ea29c66e0746b18bbd0ed6d))
* resolve Promise.allSettled compatibility in android version(which 4.4 kernel) ([e4ff18a](https://github.com/msgbyte/tailchat/commit/e4ff18aebeeb76d9f5801bf43948bf07dce92160))
* **server:** 修复不恰当时机的logger调用 ([dd358ac](https://github.com/msgbyte/tailchat/commit/dd358ac79ba339e710ed2ebcd8e4048907494c9f))


### Features

* 服务端插件增加打包静态资源的支持,并为声网插件增加icon ([0cf8bdb](https://github.com/msgbyte/tailchat/commit/0cf8bdb4fba29c50d4e979d5baa26a95f5d2f13a))
* 获取指定消息附近的消息 ([8e4908f](https://github.com/msgbyte/tailchat/commit/8e4908fcedd61c2b5539b602a2f7a5a25de34afc))
* 接口加白与联通性校验特殊处理 ([f8a73d1](https://github.com/msgbyte/tailchat/commit/f8a73d1a7761525b69779fbb618c332d5c10ab76))
* 默认无背景色导致穿透的问题 ([504060e](https://github.com/msgbyte/tailchat/commit/504060e0167f2a9ab4d8418fcf4924ef85b4bb40))
* 声网插件 正在发言指示器 ([076c907](https://github.com/msgbyte/tailchat/commit/076c907a05de6a84e123bcb0728d98a2bfdb817e))
* 声网插件网络质量检测与双流功能与头像 ([141db8f](https://github.com/msgbyte/tailchat/commit/141db8f1cffc1f06425ecacf9e7519c71f2d399d))
* 声网插件增加国际化支持 ([b7feabb](https://github.com/msgbyte/tailchat/commit/b7feabbbd38d6504bba7fcd28b7a8cc3ceb93c41))
* 声网插件增加ahooks并优化初始化逻辑 ([928f1a2](https://github.com/msgbyte/tailchat/commit/928f1a25b212e382beee948792b8a0381625a358))
* 声网插件自由控制媒体流推送 ([356e7ed](https://github.com/msgbyte/tailchat/commit/356e7edd58a017ad7be787b79ecc54b26b2b9782))
* 声网插件webhhok处理与消息通知方式 ([bd3f2e1](https://github.com/msgbyte/tailchat/commit/bd3f2e129c389e40271b3d9ead10f278d5275aff))
* 声网服务增加查询频道状态的接口 ([f444fb5](https://github.com/msgbyte/tailchat/commit/f444fb51435e47e9a9421af295ab6c5255db297e))
* 声网鉴权函数完成 ([1e67c62](https://github.com/msgbyte/tailchat/commit/1e67c62626a4393281a83565dcbe812fe40da0f5))
* 使用邀请码加入群组提示增加邀请码创建人，并增加国际化翻译 ([0cb2a82](https://github.com/msgbyte/tailchat/commit/0cb2a8200f11eb33f4e6467d2cc29764423fc514))
* 输入框addon增加打开动画，并移除表情面板的内边距 ([c6ac1a8](https://github.com/msgbyte/tailchat/commit/c6ac1a800de63b9ff37a5b0053c6c71ca00e4eca))
* 提及tag增加用户名fallback ([5c07367](https://github.com/msgbyte/tailchat/commit/5c0736732fa44a7286158d5a5cdfb5ae62be046c))
* 为每个action增加了一个after hook回调 ([13134ce](https://github.com/msgbyte/tailchat/commit/13134ce4e3914b94da410a62e6f9c33a6e0591c1))
* 文件传输插件增加文叔叔与filesend ([d9acf3b](https://github.com/msgbyte/tailchat/commit/d9acf3b679db58063fe60b8e09d882ae4eca2490))
* 引导插件增加国际化支持 ([0ee2855](https://github.com/msgbyte/tailchat/commit/0ee28554c2dd03f603cf18562add43a9a9b51f2e))
* 优化pluginUserExtraInfo渲染方式，增加自定义渲染组件自定义范围 ([bc8abe5](https://github.com/msgbyte/tailchat/commit/bc8abe54b7a1051d6b9e4ab5ebc629b6e065d776))
* 优化reaction用户名显示，显示前两个用户名以强化reaction信息量 ([3f76b9e](https://github.com/msgbyte/tailchat/commit/3f76b9ee1b940e907ef9401b1bd85daf5728aff7))
* 优化workbox匹配规则，增加对跨域资源的sw管理 ([1f04b0c](https://github.com/msgbyte/tailchat/commit/1f04b0c47ca5e1427afe04074b439fd67c4d96e3))
* 增加安装应用按钮 ([dcbc148](https://github.com/msgbyte/tailchat/commit/dcbc148eebbb7956cb690801d3a6581e13224aa7))
* 增加服务端与agora后台的数据通信处理 ([f9e53d2](https://github.com/msgbyte/tailchat/commit/f9e53d205e8f5b1997b634b97a4c9e6b1e006372))
* 增加加载到主组件时上报加载耗时 ([8b80824](https://github.com/msgbyte/tailchat/commit/8b808242df95a805411f44a27ffdaa20190613b5))
* 增加了声网插件用户布局与基于用户维度的视图渲染 ([feab2c2](https://github.com/msgbyte/tailchat/commit/feab2c240c510ad95b0ef2b4208bc865858d14db))
* 增加聊天列表滚动到底部按钮 ([7f1b475](https://github.com/msgbyte/tailchat/commit/7f1b475f69352f349503676e13bdf82ec3f37c79))
* 增加群组配置权限，增加群组成员隐私控制选项 ([9b331e7](https://github.com/msgbyte/tailchat/commit/9b331e7707bc9ea9a8060e9a396190ea56e7ca6c))
* 增加删除群组角色的接口 ([49ca9ca](https://github.com/msgbyte/tailchat/commit/49ca9ca3aef0e61b1a2402adc945167fa2353ea9))
* 增加声网插件基本功能集成 ([63ee943](https://github.com/msgbyte/tailchat/commit/63ee943eecbb1fe834e4aea3efbd8c5eee9e128d))
* 增加移出群组的前端操作 ([070a762](https://github.com/msgbyte/tailchat/commit/070a762e4df78ee6e680eeb5d7add498753b7b65))
* 增加用户管理权限点 ([8e24571](https://github.com/msgbyte/tailchat/commit/8e24571462ed09ca3255802452cc4c136e5fa28d))
* 增加alpha模式，并将虚拟列表丢到alpha模式中 ([a202419](https://github.com/msgbyte/tailchat/commit/a20241966934d68f6242413b98889acc2bebfca4))
* 增加wormhole插件用于文件传输 ([f8765d1](https://github.com/msgbyte/tailchat/commit/f8765d18c1c0ba76eadcb6418de5a7f07f625641))
* add {BACKEND} support for user info avatar ([9fa420e](https://github.com/msgbyte/tailchat/commit/9fa420e79d272d4934d11716da7d3524bd150cfe))
* add w2a project ([67960ac](https://github.com/msgbyte/tailchat/commit/67960ac877101b193a13f2bc80ff81e4b832a1d3))
* markdown渲染的图片允许被放大预览 ([c15a1a7](https://github.com/msgbyte/tailchat/commit/c15a1a7dc7bbd79cd037067fb2f309bd73ad17d8))
* registerAuthWhitelist 强制增加插件名前缀 ([5638737](https://github.com/msgbyte/tailchat/commit/56387371ab4e40310a5915ca5d6ceee91d8ff1e9))
* sentry增加replay集成 ([eec05c7](https://github.com/msgbyte/tailchat/commit/eec05c708969ffaab780e0b3c1c82b5b57e25380))


### Performance Improvements

* 优化登录逻辑 ([e623aa3](https://github.com/msgbyte/tailchat/commit/e623aa312bdfc033dfb24c02d47442cb2f059cb0))
* 优化结构与导出方式 ([58dba49](https://github.com/msgbyte/tailchat/commit/58dba494a0450e09a104116e1c69a2281c908e74))
* 优化控制器的配色方案, 增强控制器状态辨识度 ([5f5b50f](https://github.com/msgbyte/tailchat/commit/5f5b50f86e15a92293368514728319b81f7dadf5))
* 优化在用户信息没有获取到前界面的表现 ([7ea7069](https://github.com/msgbyte/tailchat/commit/7ea706936e743d862b6fd0fd8df8683429042678))
* 优化fetchConverseLastMessages查询语句，防止数据量过大导致请求超时 ([91fe01f](https://github.com/msgbyte/tailchat/commit/91fe01f2476a94d30026749927aafcc9f524ea53))
* 优化notify插件代码 ([1f53781](https://github.com/msgbyte/tailchat/commit/1f537816c277ada199b2b5597f396acc4f5e7699))
* 优化tour插件的引导，增加箭头以增强显示 ([183b777](https://github.com/msgbyte/tailchat/commit/183b777c2b049003841e3dc87682366b580f6102))
* 增加预加载, 优化主要加载代码加载耗时 ([3cdcc0e](https://github.com/msgbyte/tailchat/commit/3cdcc0e9ecfd67144aba9b99507693b94034db13))
* add webpack-retry-chunk-load-plugin to fix chunk load failed error ([4dc9e0b](https://github.com/msgbyte/tailchat/commit/4dc9e0ba6c2685675364923c257e88ba81802016))
* sentry和posthog增加try...catch保护 ([1d924f1](https://github.com/msgbyte/tailchat/commit/1d924f1692b048b69aac0ad0a8cae0075a08acff))

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