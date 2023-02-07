import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { ServerCard } from './components/ServerCard';
import { useServerStore } from './store/server';
import Dialog from 'react-native-ui-lib/dialog';
import { Button, PanningProvider, Text, View } from 'react-native-ui-lib';

export const Entry: React.FC = React.memo(() => {
  const { serverList, selectServer, addServer } = useServerStore();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [serverUrl, setServerUrl] = useState('');

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

      <ServerCard name={'添加服务器'} onPress={() => setDialogVisible(true)} />

      <Dialog
        visible={dialogVisible}
        panDirection={PanningProvider.Directions.DOWN}
        onDismiss={() => setDialogVisible(false)}
      >
        <View backgroundColor="white" style={styles.dialog}>
          <Text>输入服务器地址:</Text>

          <TextInput
            style={styles.textInput}
            inputMode="url"
            value={serverUrl}
            onChangeText={setServerUrl}
          />

          <Button
            label={'确认'}
            onPress={() => {
              addServer(serverUrl);
              setDialogVisible(false);
            }}
          />
        </View>
      </Dialog>
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
  dialog: {
    borderRadius: 8,
    padding: 10,
  },
  textInput: {
    fontSize: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
