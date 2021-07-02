import { buildStorage, setStorage, setTokenGetter } from 'pawchat-shared';
import { getUserJWT } from './utils/jwt-helper';

const webStorage = buildStorage(window.localStorage);
setStorage(() => webStorage);

setTokenGetter(async () => {
  return await getUserJWT();
});
