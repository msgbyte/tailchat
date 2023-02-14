import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput } from 'react-native';
import { ServerCard } from './components/ServerCard';
import { useServerStore } from './store/server';
import Dialog from 'react-native-ui-lib/dialog';
import {
  Button,
  PanningProvider,
  Text,
  View,
  ActionSheet,
} from 'react-native-ui-lib';
import { isValidUrl } from './lib/utils';

export const Entry: React.FC = React.memo(() => {
  const { serverList, selectServer, addServer, removeServer } =
    useServerStore();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [serverUrl, setServerUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedServer, setSelectedServer] = useState('');

  return (
    <ScrollView style={styles.root}>
      {serverList.map((serverInfo, i) => {
        return (
          <ServerCard
            key={`${i}#${serverInfo.url}`}
            style={styles.item}
            name={serverInfo.name ?? serverInfo.url}
            url={serverInfo.url}
            version={serverInfo.version}
            onPress={() => selectServer(serverInfo)}
            onLongPress={() => {
              if (i !== 0) {
                setSelectedServer(serverInfo.url);
              }
            }}
          />
        );
      })}

      <ServerCard name={'添加服务器'} onPress={() => setDialogVisible(true)} />

      <ActionSheet
        visible={!!selectedServer}
        message={`选中服务器: ${selectedServer}`}
        onDismiss={() => setSelectedServer('')}
        destructiveButtonIndex={0}
        options={[
          {
            label: '删除服务器',
            onPress: () => {
              removeServer(selectedServer);
            },
          },
        ]}
        showCancelButton={true}
      />

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
            disabled={loading}
            onPress={async () => {
              if (!isValidUrl(serverUrl)) {
                Alert.alert('输入不是一个有效的url');
                return;
              }

              setLoading(true);
              try {
                await addServer(serverUrl);
                setDialogVisible(false);
              } catch (e) {
                Alert.alert(
                  '添加服务器失败, 可能输入的地址不是一个Tailchat服务地址'
                );
              }

              setLoading(false);
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
