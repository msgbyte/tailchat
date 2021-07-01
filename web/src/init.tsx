import { buildStorage, setStorage } from 'pawchat-shared';

const webStorage = buildStorage(window.localStorage);
setStorage(() => webStorage);
