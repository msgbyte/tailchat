import type WebView from 'react-native-webview';
import { generateInstallPluginScript } from '.';
import { useUIStore } from '../../store/ui';

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
}
