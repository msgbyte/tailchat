

## [1.8.1](https://github.com/msgbyte/tailchat/compare/v1.8.0...v1.8.1) (2023-07-03)


### Bug Fixes

* fix audio.play() error throw which will marked as Unhandled ([741e9f7](https://github.com/msgbyte/tailchat/commit/741e9f7983748ff9aea7a04c8f31b3622b3f65bf))
* fix builtin plugin cannot load with {BACKEND} ([05aae65](https://github.com/msgbyte/tailchat/commit/05aae656a2995260d8b96fce026d705c5056c0c9))
* fix translation problem ([b038c5a](https://github.com/msgbyte/tailchat/commit/b038c5adf36c87f658a173f9f7b0d2ae05fa4f8d))
* **iam:** fix account existed problem ([d906322](https://github.com/msgbyte/tailchat/commit/d906322eb4dcdae6ce2be2e06dc7f0a08e43c661))


### Features

* add chat.inbox.batchAppend action which can batch add inbox item ([3ad1e44](https://github.com/msgbyte/tailchat/commit/3ad1e4410cd85fc3374b1d0f8517d65ae0c445c8))
* add env `DISABLE_CREATE_GROUP` which can control user allow create group ([2e56139](https://github.com/msgbyte/tailchat/commit/2e56139925dbaaa70556e8d46acb9c6268b071b3))
* add fim plugin and add github oauth strategy ([b64d037](https://github.com/msgbyte/tailchat/commit/b64d037b60f26d2d8c234d6d2951400d2a159060))
* add fim record provider create / search and sign token ([ed1d7cc](https://github.com/msgbyte/tailchat/commit/ed1d7cc1d629fee2c7118fd8fa87a5797b98a536))
* add markdown inbox item which help to develop system notice ([a1048b7](https://github.com/msgbyte/tailchat/commit/a1048b77fd11413b9c388c35cd067bc7fe6b048b))
* add nickname edit in register view ([40b0076](https://github.com/msgbyte/tailchat/commit/40b007698f478c7bc5d14a608c7ff546bc04a8e3))
* add plugin com.msgbyte.env.electron ([eb83f78](https://github.com/msgbyte/tailchat/commit/eb83f784a1d4e67040d400652c077b7e8998346f))
* **admin:** add MarkdownEditor ([ca95a0d](https://github.com/msgbyte/tailchat/commit/ca95a0dac78402b6c08b344a3af27190a1727255))
* **admin:** add system notify ([4498453](https://github.com/msgbyte/tailchat/commit/449845315e0042eec9443c0f853ee12c99441bcb))
* **desktop:** add desktop inject ([27eee90](https://github.com/msgbyte/tailchat/commit/27eee90034cfa5714d659c25457d40b70312b343))
* **desktop:** add screenshot button in chatbox at electron env ([aebcd0d](https://github.com/msgbyte/tailchat/commit/aebcd0d130877f27c240aa7449ebdabddd286ef8))
* **fim:** add avatar storage and enable fim ([a8bb744](https://github.com/msgbyte/tailchat/commit/a8bb744bfd343dec70a622c0230fb09552ee1c98))
* **fim:** add fim login callback ([f6ef59e](https://github.com/msgbyte/tailchat/commit/f6ef59e37d4563ed23de4a6ed3a3ad9a44e7653e))
* github oauth login view ([e81e7ad](https://github.com/msgbyte/tailchat/commit/e81e7ad64f76ac33584eeb5c7db96de1709a222c))
* iam plugin add into builtin plugin ([e0d6738](https://github.com/msgbyte/tailchat/commit/e0d673867725278a8e6132da1e11b65e900be5d7))
* **iam:** added a security policy that allows setting domain name verification for passing tokens ([9ae787f](https://github.com/msgbyte/tailchat/commit/9ae787f42b116a1a5d27afe94191f796a695b286))


### Performance Improvements

* beautify dashboard chart color ([fd9787f](https://github.com/msgbyte/tailchat/commit/fd9787f77bc6588eb0a6365e1e59843f3080cade))
* beautify github repo star message with emoji ([22651c7](https://github.com/msgbyte/tailchat/commit/22651c74bf86f7c603c7d4d6cd0fbbd0835e5f6c))

# [1.8.0](https://github.com/msgbyte/tailchat/compare/v1.7.6...v1.8.0) (2023-06-21)


### Bug Fixes

* fix problem on bbcode value maybe include space ([b47a22b](https://github.com/msgbyte/tailchat/commit/b47a22b51f2f05e9925b637f2e6b31a36637b00e))
* remove admin-next in source code ([c4b1af5](https://github.com/msgbyte/tailchat/commit/c4b1af5e626f79184c96594e7aa34bb40547f14a))


### Features

* add batch delete ([bde3665](https://github.com/msgbyte/tailchat/commit/bde36656d5a968bbddc0302d1fd2e34b62f9e14e))
* add group panel in PanelRoute ([99f6793](https://github.com/msgbyte/tailchat/commit/99f679363f4148018fd910999b6542d484fde19a))
* add limit for temporary to verify email ([3f6c3b0](https://github.com/msgbyte/tailchat/commit/3f6c3b08d8b364d1b3727754aeea379fda78f1b7))
* add preRenderTransform in field file.url ([886e274](https://github.com/msgbyte/tailchat/commit/886e274a52e35761302702029b5a773ca70a757b))
* **admin-next:** add resetPasswordTip ([de357bd](https://github.com/msgbyte/tailchat/commit/de357bd4e7bc409c15d213b1878fd0e0286c4c22))
* **admin-next:** add system user fields support ([2796a7d](https://github.com/msgbyte/tailchat/commit/2796a7d38a7866a010af5ec86def68fe3b8426c3))
* **cli:** add `smtp test` command which help user send test email full ([5bfa5b9](https://github.com/msgbyte/tailchat/commit/5bfa5b91bfbc1d529b4ba257960427c588d09e5c))
* **cli:** add benchmark connections and register command ([9524502](https://github.com/msgbyte/tailchat/commit/9524502d7050c7beb6a4cdaf8f6775c04366bd46))
* **cli:** add message revice test ([d096821](https://github.com/msgbyte/tailchat/commit/d09682139fa785ef3b0da1f82fcd414a338a7295))
* **cli:** cli benchmark connections add progress ([77e6927](https://github.com/msgbyte/tailchat/commit/77e6927cf02601127f8311c0d0f00590867aac04))
* health add more context ([8a9dd4f](https://github.com/msgbyte/tailchat/commit/8a9dd4f65c20675cbea99c0c4e516aa520771b9a))


### Performance Improvements

* beautify the visual experience of message text on windows [#41](https://github.com/msgbyte/tailchat/issues/41) ([2f0c8b2](https://github.com/msgbyte/tailchat/commit/2f0c8b2a265d1ed13b6a425b6bfd84cb063d2987))
* **cli:** optimize the experience of the benchmark command ([2d6eaac](https://github.com/msgbyte/tailchat/commit/2d6eaac96a1205c6762ee927054ca66969421d14))

## [1.7.6](https://github.com/msgbyte/tailchat/compare/v1.7.5...v1.7.6) (2023-06-07)


### Bug Fixes

* fix friend struct changed problem in `FriendPicker` ([fa49886](https://github.com/msgbyte/tailchat/commit/fa498867c4a40f023cdb613c9137a831fad146db))


### Features

* add ban user ([ea3ad15](https://github.com/msgbyte/tailchat/commit/ea3ad15f5fd8e5669b713d1c73f2d7b67211e991))
* add friend nickname set model and api ([7029e67](https://github.com/msgbyte/tailchat/commit/7029e67f0cc8785f3bd7a30251ce2e8cdad5fb76))
* add friend nickname support in everywhere ([20c16ad](https://github.com/msgbyte/tailchat/commit/20c16adeec66582943f952c4303a896993ea4bc4))
* add mention support friend nickname ([902ab8f](https://github.com/msgbyte/tailchat/commit/902ab8f422a8580e8d7c394bf0ef21a0d6a3d4e9))
* add message count ([db52b3d](https://github.com/msgbyte/tailchat/commit/db52b3d5d527e850609393bbf7287458eb3b0384))
* add unban operation ([1b880a5](https://github.com/msgbyte/tailchat/commit/1b880a50518fb5876783b09f8e477291802e0c82))
* **admin-next:** add cache manager ([0d7d71d](https://github.com/msgbyte/tailchat/commit/0d7d71d22f5a81f1a6ac5d4f08a8c4701229d530))
* **admin-next:** add disableGuestLogin and disableUserRegister in admin/config ([43cc8e3](https://github.com/msgbyte/tailchat/commit/43cc8e34a3c0960feff7ccaa6ba97359cb990d0e))
* **admin-next:** add user count chart ([54a7340](https://github.com/msgbyte/tailchat/commit/54a73403d73ff1acc55e4a41d49a6f1c841d533f))
* mail record createdAt and updatedAt ([4d6e85c](https://github.com/msgbyte/tailchat/commit/4d6e85c849ee1cf8f671de33a74ea4afd28ba741))


### Performance Improvements

* **admin-next:** perf message content and id field ([e0a22e0](https://github.com/msgbyte/tailchat/commit/e0a22e01be286a1c33306a657ab3011b3bcbe389))

## [1.7.5](https://github.com/msgbyte/tailchat/compare/v1.7.4...v1.7.5) (2023-05-27)


### Bug Fixes

* fix check logic in getGroupUserPermission ([bad6aa0](https://github.com/msgbyte/tailchat/commit/bad6aa05fadcececafdf129254f35c5ef5f6b05e))


### Features

* add preRenderTransform to parse avatar url and add reference field ([1ae5770](https://github.com/msgbyte/tailchat/commit/1ae5770603c7129490798cdf1e1f306368b2daaa))
* **admin-next:** custom admin header and footer ([7f08f54](https://github.com/msgbyte/tailchat/commit/7f08f5408cd8a6f53b7235805f5178e0a0eff977))
* jump to login page in invite view ([9868d24](https://github.com/msgbyte/tailchat/commit/9868d24ad569e077a678a63be5e81c7e6a16a408))

## [1.7.4](https://github.com/msgbyte/tailchat/compare/v1.7.3...v1.7.4) (2023-05-24)


### Bug Fixes

* fix after hook not work problem ([3f22037](https://github.com/msgbyte/tailchat/commit/3f220373c7471abccba1951fe556453e804d8535))
* fix updateGroupConfig not work problem ([ff86b84](https://github.com/msgbyte/tailchat/commit/ff86b84c14c631c2b9f91c098a7fcb2f69b9dcd7))
* fix website title with global config ([0922f83](https://github.com/msgbyte/tailchat/commit/0922f83bb92ddea1ed4fcc8ae8bac90a387624f0))
* fix will input enter when send image with enter key ([98e78e2](https://github.com/msgbyte/tailchat/commit/98e78e28f87a24c498b3e76ba5048affbf286a6a))


### Features

* add cache refresh when load user popover ([0b116e5](https://github.com/msgbyte/tailchat/commit/0b116e54060049fe2e2e0383108a26fdef66020b))
* add group data get and save action in group.extra ([d83300e](https://github.com/msgbyte/tailchat/commit/d83300e141e0a5e44479fdb6c3860baa87e5cff2))
* add multi line support for chatbox ([7b17614](https://github.com/msgbyte/tailchat/commit/7b176141be79a4bd223b9900161a7b96f1fca8b2))
* add regPluginGroupConfigItem ([41cdfb0](https://github.com/msgbyte/tailchat/commit/41cdfb071514fd062faf2185820042c47a31a236))
* add sender nickname in wxpusher ([5b238bf](https://github.com/msgbyte/tailchat/commit/5b238bf860d20bf4e99ead656a8083129bff16ef))
* add welcome plugin for user which can send welcome message when user join group ([dbebbc5](https://github.com/msgbyte/tailchat/commit/dbebbc54e66172653006a002c03b8932cb9d8ed2))
* **admin-next:** add custom dashboard ([4ee2fa8](https://github.com/msgbyte/tailchat/commit/4ee2fa81e2a49ff52dde730002091f5457c583be))
* **admin-next:** add custom translation ([ba28719](https://github.com/msgbyte/tailchat/commit/ba287195b5e7ca89302f1ad227e1939ca5029688))
* **admin-next:** add mail ([60b050d](https://github.com/msgbyte/tailchat/commit/60b050d416599b0be84a4b9d2eaf3df3e38fb4a1))
* **admin-next:** add reset password ([26f4c6a](https://github.com/msgbyte/tailchat/commit/26f4c6a8646f495bf3bea5cd465fc30ba6e2b5d8))
* **cli:** add smtp tools which help user positioning issue ([e357d2e](https://github.com/msgbyte/tailchat/commit/e357d2e1c56e4db376e2b1b29139581e4b32596d))


### Performance Improvements

* **admin-next:** optimize mongodb's performance on statistical quantities ([11154f7](https://github.com/msgbyte/tailchat/commit/11154f735b3ddbfcb33f4b6819ec78993e8a2044))

## [1.7.3](https://github.com/msgbyte/tailchat/compare/v1.7.2...v1.7.3) (2023-05-11)


### Features

* patch moleculer ([467a13c](https://github.com/msgbyte/tailchat/commit/467a13c5b043889c234a816929b371ae506ffd99))

## [1.7.2](https://github.com/msgbyte/tailchat/compare/v1.7.1...v1.7.2) (2023-05-10)


### Bug Fixes

* resolve zIndex problem which will make zIndex level incorrect ([52f1534](https://github.com/msgbyte/tailchat/commit/52f153472f075c214cc10d52f9e2d6d09921ca77))
* upgrade level with zIndex in PageContent ([c902731](https://github.com/msgbyte/tailchat/commit/c902731aec4ebba3f4f1c5f0640366e09f67d958))


### Features

* add AI Assistant plugin for Tailchat with ChatGPT ([060d07a](https://github.com/msgbyte/tailchat/commit/060d07ae8ee36dcf088ad253a18e6cabcd80f4d7))
* add starred event push for github service ([2b20aee](https://github.com/msgbyte/tailchat/commit/2b20aee3dd58c0ef00bd1209bf72f68e69bb59cb))
* **admin-next:** add custom routes ([ef88363](https://github.com/msgbyte/tailchat/commit/ef88363bbf0ade9d328164543a665d45cd98dc90))
* **admin-next:** add file list ([d68108b](https://github.com/msgbyte/tailchat/commit/d68108b21a1b7e9da6edf56d0bc41443927fe461))
* **admin-next:** add message and group list ([65e7cfe](https://github.com/msgbyte/tailchat/commit/65e7cfe11647dc785d03014423c7e86c03d8fa23))
* **ai:** add message summary ([12c8813](https://github.com/msgbyte/tailchat/commit/12c8813b68d174d3ecfcc28533ea4c2c6c49a150))
* **ai:** add output apply ([00c45d3](https://github.com/msgbyte/tailchat/commit/00c45d305024301ffb4ec13e17ab5efadc6fe8e5))

## [1.7.1](https://github.com/msgbyte/tailchat/compare/v1.7.0...v1.7.1) (2023-04-29)


### Bug Fixes

* fix react-router version not match problem ([b3ae79b](https://github.com/msgbyte/tailchat/commit/b3ae79bf7809a79ccfb84c07b6882b621a925138))
* fix return error problem in message.fetchNearbyMessage ([44ec059](https://github.com/msgbyte/tailchat/commit/44ec0599e22b2541ab1cb8e2aa187b7314fbd398))


### Features

* add disableUserRegister and disableGuestLogin ([dedeaa8](https://github.com/msgbyte/tailchat/commit/dedeaa805fae4a06edc484c09ed0d998b3338cd2))
* add message author in inbox event ([7f0568f](https://github.com/msgbyte/tailchat/commit/7f0568feed53a44bcabbe24abf781d73d9940bc4))
* add openapi bot client ([7c65858](https://github.com/msgbyte/tailchat/commit/7c658583c23ac7019124ee4fd3aca8b92f120968))
* add sakana widget ([d5db57d](https://github.com/msgbyte/tailchat/commit/d5db57dfdcd54168b8a05112c5701b285faa6742))
* add stripMentionTag utils in tailchat-client-sdk ([14255b6](https://github.com/msgbyte/tailchat/commit/14255b680494c9ceee5d313f695233a8692a77d3))

# [1.7.0](https://github.com/msgbyte/tailchat/compare/v1.6.8...v1.7.0) (2023-04-24)


### Bug Fixes

* fix plugin manifest validator checker not allowed i18n ([b9c829d](https://github.com/msgbyte/tailchat/commit/b9c829d024f5dcc9cd68afcfc19742df86ee9538))
* fix the problem that the version of react-query is not uniform ([1d5c061](https://github.com/msgbyte/tailchat/commit/1d5c061f0ce94f4435751e3f75e5db293dd5c038))


### Features

* add common service available check ([0cb61bc](https://github.com/msgbyte/tailchat/commit/0cb61bcf85d120a53184a85755834f00316bca22))
* add fe ui in wxpusher plugin ([44595b3](https://github.com/msgbyte/tailchat/commit/44595b351f9888709958e979f983de630da95571))
* add markdown editor into panel ([694a62c](https://github.com/msgbyte/tailchat/commit/694a62cd5aba9b6f2a83c3880ef622fcb5a56849))
* add markdown gfm support and add markdown editor ([9f24bb1](https://github.com/msgbyte/tailchat/commit/9f24bb1de0e3294d84cca0291312ecc60d2738ea))
* add more badge ([d0176b0](https://github.com/msgbyte/tailchat/commit/d0176b03138fd86ba22f995a7c291ddd824917ab))
* add plain text with send text message ([1fa1293](https://github.com/msgbyte/tailchat/commit/1fa1293d1a3c8f43a758a30bd25bed369e77cdee))
* add plugin com.msgbyte.wxpusher ([32de5b1](https://github.com/msgbyte/tailchat/commit/32de5b17e5e895b5388c0a135a165c46355f1e8a))
* add url document support for http protocol ([6edb013](https://github.com/msgbyte/tailchat/commit/6edb013af79d4534f4374088c52ee854da3cbfa2))
* add wxpusher message push ([1c09b17](https://github.com/msgbyte/tailchat/commit/1c09b17211189b4f0992941fe149095b33648475))
* append openapi and integration plugin into registry ([c370347](https://github.com/msgbyte/tailchat/commit/c370347cf47b4c92c9e4b44c47f6a2fce6295bc2))
* **getui:** add requestId record with single push ([4a068ee](https://github.com/msgbyte/tailchat/commit/4a068ee3d5e720d8bf0a43e14f1838210e90af57))
* hidden github icon from markdown editor ([f25eea9](https://github.com/msgbyte/tailchat/commit/f25eea90ebad981e68b169738db3e8d17966d99a))
* **mobile:** add cid in entry view ([781d413](https://github.com/msgbyte/tailchat/commit/781d4135273319626fd5bb93703b4204a029ace9))
* **mobile:** add com.huawei.agconnect:agconnect-core in huawei ([4192d35](https://github.com/msgbyte/tailchat/commit/4192d35234c4f77d7377f97c9ab6dd07418a227f))


### Performance Improvements

* add ErrorBoundary for routes ([f426d92](https://github.com/msgbyte/tailchat/commit/f426d92a9f486784ec943f2f096a6b2091d82e6e))
* beautify the visual performance of scroll bars caused by too many groups ([85d501d](https://github.com/msgbyte/tailchat/commit/85d501dae5bb2db6fa3cce7ac5d897c94362f956))
* optimize the rendering animation and layer sequence of withKeepAliveOverlay ([f099307](https://github.com/msgbyte/tailchat/commit/f09930796bb67544fc9809bc0cefc0a929bdb69e))
* perf mobile view display in pagecontent ([add116c](https://github.com/msgbyte/tailchat/commit/add116cffc6e7b86da9b3ed1b1f77f381e394f38))

## [1.6.8](https://github.com/msgbyte/tailchat/compare/v1.6.7...v1.6.8) (2023-04-02)


### Bug Fixes

* **admin:** fix unit incorrect problem ([3747776](https://github.com/msgbyte/tailchat/commit/3747776239e4bb72abda893aac1f723dd5244661))
* fix emoji render problem  if not found ([deceb60](https://github.com/msgbyte/tailchat/commit/deceb60da38587812f813d4d7c69aa2884ecfb59))
* fix getui.service cannot get client problem ([a245373](https://github.com/msgbyte/tailchat/commit/a245373e0031a39bb296092af64ee695967f5621))
* fix rn plugin error and plain message ([fcf8373](https://github.com/msgbyte/tailchat/commit/fcf837394a590bfd764361810099903a0f70f6aa))
* fix url problem about avatar url in popover ([dcaa279](https://github.com/msgbyte/tailchat/commit/dcaa2799aa133dff104d31366f9a565af121b934))
* fix url which without protocol will not been correct parse ([cfd1479](https://github.com/msgbyte/tailchat/commit/cfd1479ac628f3a8b87775d616d77c2e2fb26945))


### Features

* add device version display in settings ([11827f7](https://github.com/msgbyte/tailchat/commit/11827f7a4cfb4692c5c16f307c517ea0f6c3e7f1))
* add event tracker in website ([82a08d6](https://github.com/msgbyte/tailchat/commit/82a08d65efb8bda162019b49bc2b6ef0f90adb68))
* add huawei vendor SDK integration ([3c94ac2](https://github.com/msgbyte/tailchat/commit/3c94ac2438f624f10bdb9ed3e657b8bc34c4095e))
* add mobile level socket to subscribe remote message ([91a6721](https://github.com/msgbyte/tailchat/commit/91a6721671c39d9bd62abe2b0b6f00717e564ac3))
* add send button when message input has content ([ed05d61](https://github.com/msgbyte/tailchat/commit/ed05d61511d355e426a5ad23486d25ae70dd85d8))
* add server getui.service ([e6e13db](https://github.com/msgbyte/tailchat/commit/e6e13db307774d121c4f7b2564c6c49f1a881843))
* **mobile:** add i18n support in rn ([5668e09](https://github.com/msgbyte/tailchat/commit/5668e091edbabed6c8d54dfbf339cf2a1535fdd0))
* **mobile:** custom release store file and bind alias with native modules ([e028998](https://github.com/msgbyte/tailchat/commit/e0289988d5dffd9c77383fa2871eb1bb8f2a9569))
* **mobile:** integrate getui for chinese mainland notify push ([256cb43](https://github.com/msgbyte/tailchat/commit/256cb43c934c9dad3a010fbad091a686e3830397))
* **mobile:** remove getui build problem ([c62e551](https://github.com/msgbyte/tailchat/commit/c62e551274f585c9925571d141481788d000d0ae))
* **server:** add getuiclient lib and plugin ([1605b2d](https://github.com/msgbyte/tailchat/commit/1605b2d1869ad68b1e79baeb0c8b3e9f04b0fc4f))


### Performance Improvements

* beautify url tag style ([db4e4e8](https://github.com/msgbyte/tailchat/commit/db4e4e8958bac923ef193325acaee4e183d9deea))
* reuse script in same image in single emoji ([fdf527e](https://github.com/msgbyte/tailchat/commit/fdf527eaa7c74523bdd23dc671c3fb40e66121a8))

## [1.6.7](https://github.com/msgbyte/tailchat/compare/v1.6.6...v1.6.7) (2023-03-14)


### Bug Fixes

* fix size problem in <GroupExtraDataPanel /> ([53e476d](https://github.com/msgbyte/tailchat/commit/53e476d8a8e504c35bb8b2cdd53d2f6f9dcee62b))
* modify right position of ScrollToBottom ([e66591d](https://github.com/msgbyte/tailchat/commit/e66591d022a6f009438980ab6d66a4dace6685d8))


### Features

* add config model and add action for get client config ([b45d782](https://github.com/msgbyte/tailchat/commit/b45d782f8e0069656d033d2981cbe5b031f21ed0))
* add custom serverName render in login view ([d9adf84](https://github.com/msgbyte/tailchat/commit/d9adf840148c8f7daf11823b4d9ec46a734ec35f))
* add image parser ([8ee1215](https://github.com/msgbyte/tailchat/commit/8ee1215a9a04c6c47eec04c35ab9dcee2aa61f64))
* add toast for message item action ([a5133b2](https://github.com/msgbyte/tailchat/commit/a5133b2d800448864d59f9c27e62d96e595fbd94))
* add unlimited upload api in admin ([5ab4829](https://github.com/msgbyte/tailchat/commit/5ab4829565f1965946ac322c348d69db34f67ec3))
* **admin:** add basic system config ([7688c84](https://github.com/msgbyte/tailchat/commit/7688c844f3790c5461956b1f8620462f0b3a77d8))
* **admin:** add converseID filter and message detail ([9484e4c](https://github.com/msgbyte/tailchat/commit/9484e4ccedd3f512e2d665e10929b286ab5aee77))
* **admin:** add delete button in server entry image ([4d6fd45](https://github.com/msgbyte/tailchat/commit/4d6fd451a177ae632db03fa8dab41f1556525b8a))
* **admin:** allow edit client config serverName edit in admin ([9c7448b](https://github.com/msgbyte/tailchat/commit/9c7448b7cbf2a8019f54e350b8da190eb9085f4c))
* allow admin upload and edit serverEntryImage ([fb13a3c](https://github.com/msgbyte/tailchat/commit/fb13a3c92802e73976f7e70549d242d4fca0aadb))


### Performance Improvements

* **admin:** replace ts-node with node to run admin ([f26a423](https://github.com/msgbyte/tailchat/commit/f26a42356fd6a45826aa18ed79719fc43c1567e4))

## [1.6.6](https://github.com/msgbyte/tailchat/compare/v1.6.5...v1.6.6) (2023-02-27)


### Bug Fixes

* fix antd popover dark theme color fit ([aaab464](https://github.com/msgbyte/tailchat/commit/aaab464b6b5a306cce5ad6939960275f13b20084))
* fix bug if cannt get file then will throw error ([056709c](https://github.com/msgbyte/tailchat/commit/056709c8a53101c67a87fdfd698826458ccad813))
* fix incorrect bbcode url ([693edf2](https://github.com/msgbyte/tailchat/commit/693edf2739fd2150d23764aa11cfa2b6e797951a))
* fix style problem in avatar in invite info ([751fb55](https://github.com/msgbyte/tailchat/commit/751fb5534e6f0e4bdad9d6e10bdc5f847c18ab6b))


### Features

* add action group.extra for storage group extra data ([8aa5d93](https://github.com/msgbyte/tailchat/commit/8aa5d93eea6b86f24136f273a73daf4c2f084469))
* add GroupExtraDataPanel for support panel which allow edit ([a64f742](https://github.com/msgbyte/tailchat/commit/a64f7423652870498120500e84c5af65c154815f))
* add i18n support in plugin store ([69e8bd2](https://github.com/msgbyte/tailchat/commit/69e8bd2902dce979a75f09095a756d9ea6da2540))
* add mdpanel plugin. then we can create markdown panel in group ([1f21e40](https://github.com/msgbyte/tailchat/commit/1f21e406a54432fd0289c1ae37aa8342cb758856))
* add message list popover for DM and group ([704c05e](https://github.com/msgbyte/tailchat/commit/704c05e0ec594f88b7a6fbd962a905d6d3df55d7))
* add navigator language detector ([ce1d7ee](https://github.com/msgbyte/tailchat/commit/ce1d7eec99a14e9473157dec3d8715f7e72f7428))
* add permission for deleteMessage ([cbb436c](https://github.com/msgbyte/tailchat/commit/cbb436cfbe056cffbe9bee3f752dc1bc519a9e20))
* **admin:** add group filter in chat list ([b9b1931](https://github.com/msgbyte/tailchat/commit/b9b193186892a194f2d69b88c5242a585d976bb6))
* **admin:** add user edit page ([0f902d4](https://github.com/msgbyte/tailchat/commit/0f902d4766ad28fcc089d54111fc7cbc23f26a44))
* **admin:** update delete message logic with call ([0cd4268](https://github.com/msgbyte/tailchat/commit/0cd4268a6553bb8464c6e7ad745a81b65f8aae4a))
* **cli:** i18n support for create template ([3105406](https://github.com/msgbyte/tailchat/commit/310540631d76cccb448aa57b45bad0333e226760))
* **desktop:** 增加截图功能 ([d82854a](https://github.com/msgbyte/tailchat/commit/d82854a3ec590541d22baf457fd25857976db0ea))
* 增加开放平台oauth demo app ([51c2fb2](https://github.com/msgbyte/tailchat/commit/51c2fb20325d0f0f5c6c7cdc3b2c9eb9a9d186e2))


### Performance Improvements

* compress bundle js ([5ffac2b](https://github.com/msgbyte/tailchat/commit/5ffac2bf12c492de2c569fb3af0de963d136e920))
* update backend language fallback to en ([a78221e](https://github.com/msgbyte/tailchat/commit/a78221e111a5c5ae6fc1753d4bccf726ae8325bc))
* **website:** perf homepage without styled-component ([5faaa74](https://github.com/msgbyte/tailchat/commit/5faaa74ddf8186ad5cf3705d46ebb34c3c949d73))

## [1.6.5](https://github.com/msgbyte/tailchat/compare/v1.6.4...v1.6.5) (2023-02-17)


### Bug Fixes

* 修复放大字体插件默认状态不生效的bug ([f33a978](https://github.com/msgbyte/tailchat/commit/f33a9781795723cf972c6539eda9cb0b2d311111))
* 修改Avatar宽度策略变更后CombinedAvatar样式异常的bug ([d3a6e1b](https://github.com/msgbyte/tailchat/commit/d3a6e1b196489ea276be2136a7d1e6f86589aabf))


### Features

* 增加字体放大插件 ([caf5a45](https://github.com/msgbyte/tailchat/commit/caf5a45fe1933911cdb0b0165232f372987e4cee))

## [1.6.4](https://github.com/msgbyte/tailchat/compare/v1.6.3...v1.6.4) (2023-02-14)


### Bug Fixes

* 修复topic列表过长会导致新增按钮位置错误的问题 ([43969e2](https://github.com/msgbyte/tailchat/commit/43969e23dd410fa24c7516957ff10a68d95ddfd8))


### Features

* add tailchat-client-sdk package ([94b56f0](https://github.com/msgbyte/tailchat/commit/94b56f0af5cd3cf6f3d0beb956cbf0b382ead42a))
* **rn:** 增加notifee用于本地通知 ([02095aa](https://github.com/msgbyte/tailchat/commit/02095aa6280fe7b87af04adac217eec35eef33b8))
* **rn:** 增加删除服务器功能 ([66b0f36](https://github.com/msgbyte/tailchat/commit/66b0f36bbb001913334dfc7fa4855f7d87423970))
* **rn:** 增加插件逻辑注入 ([92d5e39](https://github.com/msgbyte/tailchat/commit/92d5e39cfc0b38b3fe980fe148dcf1b3f5dbce57))
* **rn:** 增加服务列表持久化 ([93985b0](https://github.com/msgbyte/tailchat/commit/93985b02fba04885ee860b3fdc049925b2c6f6f0))
* **rn:** 增加服务器选择入口 ([f8a4055](https://github.com/msgbyte/tailchat/commit/f8a4055628e768e9705331c710b30396111dbd5e))
* **rn:** 添加服务器时增加基本信息的获取 ([c972eb8](https://github.com/msgbyte/tailchat/commit/c972eb8937623e0708f5e576f6a0b17ba6eade3c))
* **rn:** 移动端增加消息通知显示 ([25084e0](https://github.com/msgbyte/tailchat/commit/25084e0422e52cca5a14f48c76f82b9265177be0))
* 增加 react-native-webview 以显示主要内容 ([a15e127](https://github.com/msgbyte/tailchat/commit/a15e1270a03d5942cf6f402ae32aed2769d4fb93))
* 增加react-native-ui-lib，增加添加服务器功能 ([59f559d](https://github.com/msgbyte/tailchat/commit/59f559d98cd19753e6190268f47f53ef921c2281))
* 增加topic插件的收件箱通知项 ([6dcc18a](https://github.com/msgbyte/tailchat/commit/6dcc18a7e00269d37e755a21b7be11390571bcd9))
* 增加插件安装方法到window对象 ([65d1e91](https://github.com/msgbyte/tailchat/commit/65d1e916f84bdb7b0968e212d7d058485ade759a))


### Performance Improvements

* 优化topic在多回复时的预览体验 ([206b90d](https://github.com/msgbyte/tailchat/commit/206b90d02607efb4f6f5bd7ac4675aa8b927062a))
* 优化自定义网页面板url生成机制, 使用blob url来生成临时地址 ([c3d5856](https://github.com/msgbyte/tailchat/commit/c3d585650c3974c19a3e55db828accdf48d63855))
* 表情面板增加中英国际化，并优化useStorage的缓存策略 ([ef41833](https://github.com/msgbyte/tailchat/commit/ef41833519f64b8a2e37c6a80f132f741f20551b))

## [1.6.3](https://github.com/msgbyte/tailchat/compare/v1.6.2...v1.6.3) (2023-02-11)


### Bug Fixes

* 修复在处理当前页面的完整路径时url的跳转行为 ([ca486ed](https://github.com/msgbyte/tailchat/commit/ca486ed6b09105193b52a6996f9c7308d0f14c3e))


### Features

* github 开放平台机器人增加监听消息回调到github issue comment ([2590242](https://github.com/msgbyte/tailchat/commit/2590242bd89e385ee45954721937d77bfe072c4c))

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