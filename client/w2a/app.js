App({
  options: {
    debug: true,
  },
  /**
   * 当wap2app初始化完成时，会触发 onLaunch
   */
  onLaunch: function () {
    console.log('launch');

    uni.onPushMessage((res) => {
      console.log('收到推送消息：', res); //监听推送消息
    });

    uni.getPushClientId({
      success: (res) => {
        let push_clientid = res.cid;
        console.log('客户端推送标识:', push_clientid);
      },
      fail(err) {
        console.log(err);
      },
    });
  },
  /**
   * 当wap2app启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function () {
    console.log('show');
  },
  /**
   * 当wap2app从前台进入后台，会触发 onHide
   */
  onHide: function () {
    console.log('hide');
  },
});

Page('__W2A__nightly.paw.msgbyte.com', {
  //首页扩展配置
  onShow: function () {},
  onClose: function () {},
});
