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
  fetchGlobalClientConfig,
  isDevelopment,
  setErrorHook,
  showToasts,
} from 'tailchat-shared';
import { getPopupContainer } from './utils/dom-helper';
import { getUserJWT } from './utils/jwt-helper';
import _get from 'lodash/get';

if (isDevelopment) {
  import('source-ref-runtime').then(({ start }) => start());
}

const webStorage = buildStorage(window.localStorage);
setStorage(() => webStorage);

setTokenGetter(async () => {
  return await getUserJWT();
});

const localStorageServiceUrl = window.localStorage.getItem('serviceUrl');
if (localStorageServiceUrl) {
  setServiceUrl(() => localStorageServiceUrl);
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

const backToLoginPage = (() => {
  let timer: number;

  return () => {
    if (timer) {
      // 如果已经存在则跳过
      return;
    }

    if (
      window.location.pathname.startsWith('/entry') ||
      window.location.pathname.startsWith('/invite')
    ) {
      // 如果已经在入口页面或者邀请页面则跳过
      return;
    }

    console.warn('账号授权已过期, 2秒后自动跳转到登录页');
    showToasts(t('账号授权已过期, 2秒后自动跳转到登录页'), 'warning');

    timer = window.setTimeout(() => {
      window.clearTimeout(timer);
      window.location.href = '/entry/login';
    }, 2000);
  };
})();
setErrorHook((err) => {
  const statusCode = _get(err, 'response.data.code');
  if (
    statusCode === 401 // Unauthorized (jwt过期)
  ) {
    backToLoginPage();

    return false;
  }

  return true;
});

/**
 * 获取前端配置
 */
fetchGlobalClientConfig().catch((e) => {
  showErrorToasts(t('全局配置加载失败'));
  console.error('全局配置加载失败', e);
});
