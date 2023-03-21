import type WebView from 'react-native-webview';
import { generateInstallPluginScript } from '.';
import { useUIStore } from '../../store/ui';
import { showNotification } from '../notifications';
import type { UserBaseInfo } from '../../types';
import { bindSocketEvent, createSocket } from '../socket';

export function handleTailchatMessage(
  type: string,
  payload: any,
  webview: WebView
) {
  console.log('onMessage receive:', type, payload);

  if (type === 'init') {
    webview.injectJavaScript(generateInstallPluginScript());
    return;
  }

  if (type === 'loadColorScheme') {
    // 设置颜色
    useUIStore.getState().setColorScheme(payload);
    return;
  }

  if (type === 'showNotification') {
    showNotification({
      title: payload.title,
      body: payload.body,
      icon: payload.icon,
    });

    return;
  }

  if (type === 'bindWebsocket') {
    const serviceUrl: string = payload.url;
    const token: string = payload.token;
    const userInfo = payload.userInfo as UserBaseInfo;

    createSocket(serviceUrl, token).then((socket) => {
      console.log('[createSocket]', 'socket', socket, 'userInfo', userInfo);
      bindSocketEvent(socket);
    });
  }
}
