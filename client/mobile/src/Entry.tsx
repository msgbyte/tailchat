import React from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { ServerCard } from './components/ServerCard';
import { useServerStore } from './store/server';

export const Entry: React.FC = React.memo(() => {
  const { serverList, selectServer } = useServerStore();

  return (
    <ScrollView style={styles.root}>
      {serverList.map((serverInfo, i) => {
        return (
          <ServerCard
            key={`${i}#${serverInfo.url}`}
            style={styles.item}
            name={serverInfo.name ?? serverInfo.url}
            url={serverInfo.url}
            onPress={() => selectServer(serverInfo)}
          />
        );
      })}

      <ServerCard name={'添加服务器'} onPress={() => Alert.alert('暂不支持')} />
    </ScrollView>
  );
});
Entry.displayName = 'Entry';

const styles = StyleSheet.create({
  root: {
    height: '100%',
    padding: 20,
  },
  item: {
    marginBottom: 8,
  },
});
