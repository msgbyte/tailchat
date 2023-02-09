/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { AppMain } from './AppMain';
import { Entry } from './Entry';
import { useServerStore } from './store/server';
import { useUIStore } from './store/ui';
import { theme } from './theme';

function App(): JSX.Element {
  const { colorScheme } = useUIStore();
  const systemColorScheme = useColorScheme();
  const finalColorScheme =
    colorScheme === 'auto' ? systemColorScheme : colorScheme;
  const isDarkMode = finalColorScheme === 'dark';
  const selectedServerInfo = useServerStore(
    (state) => state.selectedServerInfo
  );

  const backgroundStyle = {
    backgroundColor: isDarkMode ? theme.contentBg.dark : theme.contentBg.light,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      {selectedServerInfo ? (
        <AppMain host={selectedServerInfo.url} />
      ) : (
        <Entry />
      )}
    </SafeAreaView>
  );
}

export default App;
