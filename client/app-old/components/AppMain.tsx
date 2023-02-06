import React from 'react';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';

/**
 * Tailchat的主要内容
 *
 * 由webview提供
 */

export const AppMain: React.FC = React.memo(() => {
  return (
    <WebView
      style={styles.webview}
      source={{ uri: 'https://nightly.paw.msgbyte.com/' }}
    />
  );
});
AppMain.displayName = 'AppMain';

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
