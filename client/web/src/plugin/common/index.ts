/**
 * 同步加载的代码
 * 用于导出常见的模块依赖
 */

import _pick from 'lodash/pick';
export * from './reg';
export * from './context';
export { useGroupPanelParams } from '@/routes/Main/Content/Group/utils';

/**
 * @deprecated 从component引用
 */
export {
  openModal,
  closeModal,
  ModalWrapper,
  useModalContext,
  openConfirmModal,
  openReconfirmModal,
} from '@/components/Modal';
export { Loadable } from '@/components/Loadable';
export {
  getGlobalState,
  useGlobalSocketEvent,
} from '@/utils/global-state-helper';
export { getJWTUserInfo } from '@/utils/jwt-helper';
export { dataUrlToFile } from '@/utils/file-helper';
export {
  urlSearchStringify,
  urlSearchParse,
  appendUrlSearch,
} from '@/utils/url-helper';
export { getServiceWorkerRegistration } from '@/utils/sw-helper';
import { request, RequestConfig, useUserInfo } from 'tailchat-shared';
export {
  getServiceUrl,
  getCachedUserInfo,
  getCachedConverseInfo,
  localTrans,
  getLanguage,
  sharedEvent,
  useAsync,
  useAsyncFn,
  useAsyncRefresh,
  useAsyncRequest,
  uploadFile,
  showToasts,
  showSuccessToasts,
  showErrorToasts,
  fetchAvailableServices,
  isValidStr,
  useGroupPanelInfo,
  sendMessage,
  showMessageTime,
} from 'tailchat-shared';

export { useLocation, useNavigate } from 'react-router';

export {
  /**
   * @deprecated please use createMetaFormSchema from @capital/component
   */
  createMetaFormSchema as createFastFormSchema,
  /**
   * @deprecated please use metaFormFieldSchema from @capital/component
   */
  metaFormFieldSchema as fieldSchema,
} from 'tailchat-design';

/**
 * 插件版本的useUserInfo
 */
export function useCurrentUserInfo() {
  const userInfo = useUserInfo();

  return _pick(userInfo, ['email', 'nickname', 'discriminator', 'avatar']);
}

/**
 * 处理axios的request config
 *
 * 为了防止用户的jwt因为请求被传递到其他地方
 */
function purgeRequestConfig(config?: RequestConfig) {
  if (!config) {
    return undefined;
  }

  return _pick(config, [
    'transformRequest',
    'transformResponse',
    'headers',
    'params',
    'data',
    'timeout',
    'withCredentials',
    'xsrfCookieName',
    'xsrfHeaderName',
  ]);
}

/**
 * 插件仅可以通过这种方式进行网络请求发送
 */
export function createPluginRequest(pluginName: string) {
  return {
    get(actionName: string, config?: RequestConfig) {
      return request.get(
        `/api/plugin:${pluginName}/${actionName.replace(/\./g, '/')}`,
        purgeRequestConfig(config)
      );
    },
    post(actionName: string, data?: any, config?: RequestConfig) {
      return request.post(
        `/api/plugin:${pluginName}/${actionName.replace(/\./g, '/')}`,
        data,
        purgeRequestConfig(config)
      );
    },
  };
}

/**
 * 发起一个网络请求
 *
 * 与上面的相比，是不限定在plugin中的
 */
export function postRequest(url: string, data?: any, config?: RequestConfig) {
  return request.post(`/api${url}`, data, purgeRequestConfig(config));
}
