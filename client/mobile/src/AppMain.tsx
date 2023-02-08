import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
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
  useEffect(() => {
    initNotificationEnv();
  }, []);

  return (
    <View style={styles.root}>
      <WebView source={{ uri: props.host }} />
    </View>
  );
});
AppMain.displayName = 'AppMain';

const styles = StyleSheet.create({
  root: {
    height: '100%',
  },
});
