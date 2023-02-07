import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * Tailchat的主要内容
 *
 * 由webview提供
 */

export const AppMain: React.FC = React.memo(() => {
  return (
    <View style={styles.root}>
      <WebView source={{ uri: 'https://nightly.paw.msgbyte.com/' }} />
    </View>
  );
});
AppMain.displayName = 'AppMain';

const styles = StyleSheet.create({
  root: {
    height: '100%',
  },
});
