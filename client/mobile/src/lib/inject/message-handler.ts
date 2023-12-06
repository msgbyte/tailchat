import type WebView from 'react-native-webview';
import { generateDebugScript, generateInstallPluginScript } from '.';
import { useUIStore } from '../../store/ui';
import type { UserBaseInfo } from '../../types';
import { initNotificationEnv, showNotification } from '../notifications';
// import { bindSocketEvent, createSocket } from '../socket';
import { AppState } from 'react-native';
import { ensureWebRTCPermission } from '../permissions';
import { isDev } from '../utils';

export function handleTailchatMessage(
  type: string,
  payload: any,
  webview: WebView
) {
  console.log('onMessage receive:', type, payload);

  if (type === 'init') {
    webview.injectJavaScript(generateInstallPluginScript());

    if (isDev()) {
      webview.injectJavaScript(generateDebugScript());
    }

    return;
  }

  if (type === 'loadColorScheme') {
    // 设置颜色
    useUIStore.getState().setColorScheme(payload);
    return;
  }

  if (type === 'showNotification') {
    if (AppState.currentState !== 'active') {
      showNotification({
        title: payload.title,
        body: payload.body,
        icon: payload.icon,
      });
    }

    return;
  }

  if (type === 'ensureWebRTCPermission') {
    ensureWebRTCPermission();
  }

  if (type === 'bindWebsocket') {
    const userInfo = payload.userInfo as UserBaseInfo;

    initNotificationEnv({
      userId: userInfo._id,
      nickname: userInfo.nickname ?? userInfo.email,
      runService: () => {
        // const serviceUrl: string = payload.url;
        // const token: string = payload.token;
        // createSocket(serviceUrl, token).then((socket) => {
        //   console.log('[createSocket]', 'socket', socket, 'userInfo', userInfo);
        //   bindSocketEvent(socket);
        // });
      },
    });
  }
}
