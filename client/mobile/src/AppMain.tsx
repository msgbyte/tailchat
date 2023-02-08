import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { generateInjectScript } from './lib/inject';
import { initNotificationEnv } from './lib/notifications';

/**
 * Tailchat的主要内容
 *
 * 由webview提供
 */

interface Props {
  host: string;
}
export const AppMain: React.FC<Props> = React.memo((props) => {
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    initNotificationEnv();

    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(generateInjectScript());
    }
  }, []);

  return (
    <View style={styles.root}>
      <WebView ref={webviewRef} source={{ uri: props.host }} />
    </View>
  );
});
AppMain.displayName = 'AppMain';

const styles = StyleSheet.create({
  root: {
    height: '100%',
  },
});
