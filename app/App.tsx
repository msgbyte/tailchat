import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppMain } from './components/AppMain';

/**
 * 入口文件, 由 expo 管理
 */
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <AppMain />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
