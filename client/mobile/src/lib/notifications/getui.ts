import Getui from 'react-native-getui';

/**
 * bind alias with userId
 * user for server push
 */
export function bindAlias(userId: string) {
  Getui.bindAlias(userId);
}
