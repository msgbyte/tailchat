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
  request,
  isValidStr,
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
  if (_get(err, 'response.data.code') === 403) {
    backToLoginPage();

    return false;
  }

  return true;
});

/**
 * 获取前端配置
 */
request
  .get('/config.json?v2', {
    baseURL: '',
  })
  .then(({ data: config }) => {
    if (!localStorageServiceUrl && isValidStr(_get(config, 'serviceUrl'))) {
      // 配置的优先级低于localStorage的优先级
      setServiceUrl(() => _get(config, 'serviceUrl'));
    }
  })
  .catch(() => {})
  .finally(() => {
    /**
     * 初始化时加载全局配置
     * 确保在请求前端配置之后(即尝试通过配置文件修改地址之后)再发起请求
     */
    fetchGlobalConfig().catch((e) => {
      showErrorToasts(t('全局配置加载失败'));
      console.error('全局配置加载失败', e);
    });
  });
