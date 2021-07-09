import {
  buildStorage,
  setServiceUrl,
  setStorage,
  setTokenGetter,
} from 'pawchat-shared';
import { getUserJWT } from './utils/jwt-helper';

const webStorage = buildStorage(window.localStorage);
setStorage(() => webStorage);

setTokenGetter(async () => {
  return await getUserJWT();
});

if (window.localStorage.getItem('serviceUrl')) {
  setServiceUrl(() => String(window.localStorage.getItem('serviceUrl')));
} else if (process.env.SERVICE_URL) {
  setServiceUrl(() => String(process.env.SERVICE_URL));
}
