import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, ScrollView } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { ServerCard } from './components/ServerCard';
import { useServerStore } from './store/server';
import Dialog from 'react-native-ui-lib/dialog';
import {
  Button,
  PanningProvider,
  Text,
  View,
  ActionSheet,
  TextField,
  TouchableOpacity,
} from 'react-native-ui-lib';
import { isValidUrl } from './lib/utils';
import { translate } from './lib/i18n';
import { getClientId } from './lib/notifications/getui';
import { useToast } from './hooks/useToast';

export const Entry: React.FC = React.memo(() => {
  const { serverList, selectServer, addServer, removeServer } =
    useServerStore();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [serverUrl, setServerUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedServer, setSelectedServer] = useState('');
  const [cid, setCid] = useState('');
  const { toastEl, showToast } = useToast();

  useEffect(() => {
    getClientId().then((cid) => {
      setCid(cid);
    });
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView style={styles.main}>
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

        <ServerCard
          name={translate('core.addServer')}
          onPress={() => setDialogVisible(true)}
        />

        <ActionSheet
          visible={!!selectedServer}
          message={`${translate('core.selectedServer')}: ${selectedServer}`}
          onDismiss={() => setSelectedServer('')}
          destructiveButtonIndex={0}
          options={[
            {
              label: translate('core.deleteServer'),
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
            <Text>{translate('core.inputServerUrl')}:</Text>

            <TextField
              style={styles.textInput}
              migrate={true}
              inputMode="url"
              value={serverUrl}
              onChangeText={setServerUrl}
            />

            <Button
              label={translate('core.confirm')}
              disabled={loading}
              onPress={async () => {
                if (!isValidUrl(serverUrl)) {
                  Alert.alert(translate('core.invalidUrl'));
                  return;
                }

                setLoading(true);
                try {
                  await addServer(serverUrl);
                  setDialogVisible(false);
                } catch (e) {
                  Alert.alert(translate('core.addServerError'));
                }

                setLoading(false);
              }}
            />
          </View>
        </Dialog>
      </ScrollView>

      <View>
        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(cid);
            showToast(translate('core.copySuccess'));
          }}
        >
          <Text grey40 center={true}>
            cid: {cid}
          </Text>
        </TouchableOpacity>
      </View>

      {toastEl}
    </View>
  );
});
Entry.displayName = 'Entry';

const styles = StyleSheet.create({
  root: {
    height: '100%',
    padding: 20,
  },
  main: {
    flex: 1,
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
