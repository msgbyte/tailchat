import { message, Modal } from 'antd';
import {
  buildStorage,
  setAlert,
  setServiceUrl,
  setStorage,
  setToasts,
  setTokenGetter,
} from 'tailchat-shared';
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

setToasts((msg, type = 'info') => {
  message.open({
    type,
    duration: 3,
    content: String(msg),
  });
});

setAlert((options) => {
  Modal.confirm({
    content: options.message,
    onOk: async () => {
      if (typeof options.onConfirm === 'function') {
        await options.onConfirm();
      }
    },
  });
});
