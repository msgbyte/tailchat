package com.msgbyte.tailchat;

import android.content.Context;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.igexin.sdk.PushManager;
import com.igexin.sdk.Tag;

public class GetuiModule extends ReactContextBaseJavaModule {
  private static final String TAG = "GetuiModule";

  public static final String EVENT_RECEIVE_REMOTE_NOTIFICATION = "receiveRemoteNotification";

  public static final String EVENT_TYPE_RECEIVE_CID = "cid";
  public static final String EVENT_TYPE_PAYLOAD = "payload";
  public static final String EVENT_TYPE_CMD = "cmd";
  public static final String EVENT_TYPE_NOTIFICATION_ARRIVED = "notificationArrived";
  public static final String EVENT_TYPE_NOTIFICATION_CLICKED = "notificationClicked";

  private static ReactApplicationContext mRAC;

  private static GetuiModule mModule;

  private static Context mContext;

  public GetuiModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mRAC = reactContext;
  }

  @Override
  public boolean canOverrideExistingModule() {
    return true;
  }

  @Override
  public String getName() {
    return "GetuiModule";
  }

  @Override
  public void initialize() {
    super.initialize();
    mModule = this;
  }

  @Override
  public void onCatalystInstanceDestroy() {
    super.onCatalystInstanceDestroy();
    mModule = null;
  }

  /**
   * 初始化推送服务
   */
  public static void initPush(Context context) {
    mContext = context;
    GetuiLogger.log("initPush, mContext = " + mContext);
    PushManager.getInstance().initialize(mContext, TailchatPushService.class);
    PushManager.getInstance().registerPushIntentService(mContext, PushIntentService.class);
  }

  /**
   * Android 不存在 destroy方法，仅停止推送服务
   */
  @ReactMethod
  public void destroy() {
    // PushManager.getInstance().stopService(mContext);
  }

  /**
   * 停止SDK服务
   */
  @ReactMethod
  public void stop() {
    // PushManager.getInstance().stopService(mContext);
  }

  /**
   * 恢复SDK运行，重新接收推送
   */
  @ReactMethod
  public void resume() {
    PushManager.getInstance().turnOnPush(mContext);
  }

  /**
   * 打开SDK的推送.
   */
  @ReactMethod
  public void turnOnPush() {
    PushManager.getInstance().turnOnPush(mContext);
  }

  /**
   * 关闭SDK的推送.
   */
  @ReactMethod
  public void turnOffPush() {
    PushManager.getInstance().turnOffPush(mContext);
  }

  /**
   * 获取SDK的Cid
   *
   * @return Cid值
   */
  @ReactMethod
  public void clientId(Callback callback) {
    String clientId = PushManager.getInstance().getClientid(mContext);
    GetuiLogger.log("clientId = " + clientId);
    callback.invoke(clientId);
  }

  /**
   * 获取SDK运行状态,
   *
   * @return 运行状态 1为已开启推送，2为已停止推送
   */
  @ReactMethod
  public void status(Callback callback) {
    boolean isPushTurnOn = PushManager.getInstance().isPushTurnedOn(mContext);
    GetuiLogger.log("isPushTurnOn = " + isPushTurnOn);
    callback.invoke(isPushTurnOn ? "1" : "2");
  }

  /**
   * 获取SDK版本号
   *
   * @return 版本号
   */
  @ReactMethod
  public void version(Callback callback) {
    String version = PushManager.getInstance().getVersion(mContext);
    GetuiLogger.log("version = " + version);
    callback.invoke(version);
  }


  /**
   * 是否允许SDK 后台运行(默认为true)
   * 该方法在Android中无效，仅在iOS有效
   *
   * @param isEnable
   */
  @ReactMethod
  public void runBackgroundEnable(boolean isEnable) {
    // Empty
  }


  /**
   * 地理围栏功能，设置地理围栏是否运行
   * 该方法在Android中无效，仅在iOS有效，在AndroidManifest.xml开启相应地权限
   * <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
   * <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
   *
   * @param isEnable 设置地理围栏功能是否运行（默认值：NO）
   * @param isVerify 设置是否SDK主动弹出用户定位请求（默认值：NO）
   */
  @ReactMethod
  public void lbsLocationEnable(boolean isEnable, boolean isVerify) {
    // Empty
  }


  /**
   * 设置渠道
   * 该方法在Android中无效，仅在iOS有效Ø
   *
   * @param channelId 渠道值，可以为空值
   */
  @ReactMethod
  public void setChannelId(String channelId) {
    // Empty
  }


  /**
   * 向个推服务器注册DeviceToken
   * 该方法在Android中无效，仅在iOS有效
   *
   * @param deviceToken
   */
  @ReactMethod
  public void registerDeviceToken(String deviceToken) {
    // Empty

  }

  /**
   * 绑定别名功能:后台可以根据别名进行推送
   *
   * @param alias 别名字符串
   * @param aSn   绑定序列码, Android中无效，仅在iOS有效
   */
  @ReactMethod
  public void bindAlias(String alias, String aSn) {
    PushManager.getInstance().bindAlias(mContext, alias);
  }

  /**
   * 取消绑定别名功能
   *
   * @param alias 别名字符串
   * @param aSn   绑定序列码, Android中无效，仅在iOS有效
   */
  @ReactMethod
  public void unbindAlias(String alias, String aSn) {
    PushManager.getInstance().unBindAlias(mContext, alias, false);
  }

  /**
   * 给用户打标签 , 后台可以根据标签进行推送
   *
   * @param tags 别名数组
   */
  @ReactMethod
  public void setTag(ReadableArray tags) {
    if (tags == null || tags.size() == 0) {
      return;
    }

    Tag[] tagArray = new Tag[tags.size()];
    for (int i = 0; i < tags.size(); i++) {
      Tag tag = new Tag();
      tag.setName(tags.getString(i));
      tagArray[i] = tag;
    }

    PushManager.getInstance().setTag(mContext, tagArray, "setTag");
  }

  /**
   * 设置关闭推送模式
   * Android中无效，仅在iOS有效
   *
   * @param isValue
   */
  @ReactMethod
  public void setPushModeForOff(boolean isValue) {
    // Empty
  }

  /**
   * 同步角标值到个推服务器
   * Android中无效，仅在iOS有效
   *
   * @param value
   */
  @ReactMethod
  public void setBadge(int value) {
    // Empty
  }

  /**
   * 重置角标值到个推服务器
   * Android中无效，仅在iOS有效
   *
   * @param badge
   */
  @ReactMethod
  public void resetBadge(int badge) {
    //Empty
  }


  /**
   * SDK发送上行消息结果
   * Android中无效，仅在iOS有效
   *
   * @param body  需要发送的消息数据
   * @param error 如果发送成功返回messageid
   */
  @ReactMethod
  public void sendMessage(String body, String error) {
    // Empty

  }

  /**
   * 上行第三方自定义回执actionid
   *
   * @param actionId 用户自定义的actionid，int类型，取值90001-90999。
   * @param taskId   下发任务的任务ID
   * @param msgId    下发任务的消息ID
   * @return 上行成功或失败，若上行失败，可能上行失败；taskid为空或者 messageid 为空 或者 actionid 不在取值范围以内
   */
  @ReactMethod
  public void sendFeedbackMessage(int actionId, String taskId, String msgId, Callback callback) {
    callback.invoke(PushManager.getInstance().sendFeedbackMessage(mContext, taskId, msgId, actionId));
  }

  /**
   * 设置静默时间
   *
   * @param beginHour 开始时间，设置范围在0-23小时之间，单位 h
   * @param duration  持续时间，设置范围在0-23小时之间。持续时间为0则不静默，单位 h
   */
  @ReactMethod
  public void sendSilentTime(int beginHour, int duration, Callback callback) {
    callback.invoke(PushManager.getInstance().setSilentTime(mContext, beginHour, duration));
  }


  /**
   * 设置Socket超时时间
   *
   * @param times 超时时间
   */
  @ReactMethod
  public void setSocketTimeout(int times) {
    PushManager.getInstance().setSocketTimeout(mContext, times);
  }

  /**
   * 往JavaScript发送事件通知
   *
   * @param eventName
   * @param type
   * @param value
   */
  public static void sendEvent(String eventName, String type, String key, String value) {
    WritableMap param = Arguments.createMap();
    param.putString("type", type);
    param.putString(key, value);
    sendEvent(eventName, param);
  }

  /**
   * 往JavaScript发送事件通知
   *
   * @param eventName
   * @param params
   */
  public static void sendEvent(String eventName, @Nullable WritableMap params) {
    mRAC.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
  }
}

