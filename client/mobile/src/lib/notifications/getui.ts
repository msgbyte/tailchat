import { NativeModules, Platform } from 'react-native';
const GetuiModule = NativeModules.GetuiModule;

/**
 * bind alias with userId
 * user for server push
 */
export function bindAlias(userId: string) {
  getClientId().then((cid) => {
    console.log('getui cid:', cid);
  });
  if (Platform.OS === 'android') {
    GetuiModule.bindAlias(userId, '0');
  }
}

export function getClientId() {
  return new Promise<string>((resolve) => {
    GetuiModule.clientId((param: string) => {
      resolve(param);
    });
  });
}
