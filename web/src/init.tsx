import {
  buildStorage,
  setServerUrl,
  setStorage,
  setTokenGetter,
} from 'pawchat-shared';
import { getUserJWT } from './utils/jwt-helper';

const webStorage = buildStorage(window.localStorage);
setStorage(() => webStorage);

setTokenGetter(async () => {
  return await getUserJWT();
});

if (window.localStorage.getItem('serverUrl')) {
  setServerUrl(() => String(window.localStorage.getItem('serverUrl')));
} else if (process.env.SERVER_URL) {
  setServerUrl(() => String(process.env.SERVER_URL));
}
