import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { TouchableOpacity, Text } from 'react-native-ui-lib';

interface ServerCardProps {
  style?: StyleProp<ViewStyle>;
  name: string;
  url?: string;
  version?: string;
  onPress?: () => void;
  onLongPress?: () => void;
}
export const ServerCard: React.FC<ServerCardProps> = React.memo((props) => {
  return (
    <TouchableOpacity
      style={[styles.root, props.style]}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
    >
      <Text style={styles.name}>{props.name}</Text>

      {props.url && (
        <Text style={styles.url} grey30>
          {props.url}
        </Text>
      )}

      {props.version && (
        <Text style={styles.version} grey30>
          version: {props.version}
        </Text>
      )}
    </TouchableOpacity>
  );
});
ServerCard.displayName = 'ServerCard';

const styles = StyleSheet.create({
  root: {
    height: 56,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    textAlign: 'center',
  },
  version: {
    // color: '#999',
    textAlign: 'center',
    fontSize: 10,
  },
  url: {
    // color: '#999',
    textAlign: 'center',
  },
});
