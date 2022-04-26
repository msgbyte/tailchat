import { message, Modal } from 'antd';
import React from 'react';
import {
  buildStorage,
  setAlert,
  setGlobalLoading,
  setServiceUrl,
  setStorage,
  setToasts,
  setTokenGetter,
  showErrorToasts,
  t,
  fetchGlobalConfig,
} from 'tailchat-shared';
import { getPopupContainer } from './utils/dom-helper';
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
    content: <span data-testid="toast">{String(msg)}</span>,
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
    getContainer: getPopupContainer,
  });
});

setGlobalLoading((text) => {
  const hide = message.loading(text, 0);

  return hide;
});

/**
 * 初始化时加载全局配置
 */
fetchGlobalConfig().catch((e) => {
  showErrorToasts(t('全局配置加载失败'));
  console.error('全局配置加载失败', e);
});
