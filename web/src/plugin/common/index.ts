/**
 * 同步加载的代码
 * 用于导出常见的模块依赖
 */

export * from './reg';
export {
  useGroupPanelParams,
  useCurrentGroupPanelInfo,
} from '@/routes/Main/Content/Group/utils';
export { openModal, ModalWrapper, useModalContext } from '@/components/Modal';
export { getGlobalState } from '@/utils/global-state-helper';
export {
  getCachedUserInfo,
  getCachedConverseInfo,
  localTrans,
} from 'tailchat-shared';
