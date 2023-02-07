import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface ServerCardProps {
  style?: StyleProp<ViewStyle>;
  name: string;
  url?: string;
  onPress?: () => void;
}
export const ServerCard: React.FC<ServerCardProps> = React.memo((props) => {
  return (
    <TouchableOpacity
      style={[styles.root, props.style]}
      onPress={props.onPress}
    >
      <Text style={styles.name}>{props.name}</Text>

      {props.url && <Text style={styles.url}>{props.url}</Text>}
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
  url: {
    color: '#999',
    textAlign: 'center',
  },
});
