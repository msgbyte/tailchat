/**
 * 同步加载的代码
 * 用于导出常见的模块依赖
 */

export * from './reg';
export {
  useGroupPanelParams,
  useCurrentGroupPanelInfo,
} from '@/routes/Main/Content/Group/utils';
export {
  openModal,
  closeModal,
  ModalWrapper,
  useModalContext,
} from '@/components/Modal';
export { Loadable } from '@/components/Loadable';
export { getGlobalState } from '@/utils/global-state-helper';
export { dataUrlToFile } from '@/utils/file-helper';
import { request, RequestConfig } from 'tailchat-shared';
export {
  getCachedUserInfo,
  getCachedConverseInfo,
  localTrans,
  sharedEvent,
  useAsync,
  useAsyncFn,
  uploadFile,
} from 'tailchat-shared';

/**
 * 插件仅可以通过这种方式进行网络请求发送
 */
export function createPluginRequest(pluginName: string) {
  return {
    get(actionName: string, config?: RequestConfig) {
      return request.get(`/api/plugin:${pluginName}/${actionName}`, config);
    },
    post(actionName: string, data?: any, config?: RequestConfig) {
      return request.post(
        `/api/plugin:${pluginName}/${actionName}`,
        data,
        config
      );
    },
  };
}
