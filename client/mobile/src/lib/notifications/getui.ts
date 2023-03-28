import { NativeModules, Platform } from 'react-native';

const GetuiModule = NativeModules.GetuiModule;

/**
 * bind alias with userId
 * user for server push
 */
export function bindAlias(userId: string) {
  if (Platform.OS === 'android') {
    GetuiModule.bindAlias(userId);
  }
}
