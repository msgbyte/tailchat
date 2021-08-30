// api
export { buildStorage } from './api/buildStorage';
export { request } from './api/request';
export { createSocket } from './api/socket';
export type { AppSocket } from './api/socket';

// cache
export {
  getCachedUserInfo,
  getCachedGroupInviteInfo,
  getCachedRegistryPlugins,
} from './cache/cache';
export { useCachedUserInfo } from './cache/useCache';

// components
export {
  FastForm,
  CustomField,
  regField,
  regFormContainer,
} from './components/FastForm/index';
export type {
  FastFormFieldComponent,
  FastFormFieldProps,
  FastFormFieldMeta,
  FastFormContainerComponent,
} from './components/FastForm/index';
export {
  createFastFormSchema,
  fieldSchema,
} from './components/FastForm/schema';
export { buildPortal, DefaultEventEmitter } from './components/Portal';
export { TcProvider } from './components/Provider';

// i18n
export { t, setLanguage, useTranslation } from './i18n';

// hooks
export { useAsync } from './hooks/useAsync';
export { useAsyncFn } from './hooks/useAsyncFn';
export { useAsyncRequest } from './hooks/useAsyncRequest';
export { useMountedState } from './hooks/useMountedState';
export { useRafState } from './hooks/useRafState';
export { useUpdateRef } from './hooks/useUpdateRef';

// manager
export { buildRegFn } from './manager/buildRegFn';
export { buildRegList } from './manager/buildRegList';
export { buildRegMap } from './manager/buildRegMap';
export { getStorage, setStorage, useStorage } from './manager/storage';
export { setTokenGetter, refreshTokenGetter } from './manager/request';
export { setServiceUrl } from './manager/service';
export {
  showToasts,
  setToasts,
  showAlert,
  setAlert,
  showErrorToasts,
} from './manager/ui';

// model
export { fetchAvailableServices } from './model/common';
export { createDMConverse } from './model/converse';
export {
  addFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  denyFriendRequest,
} from './model/friend';
export type { FriendRequest } from './model/friend';
export {
  GroupPanelType,
  createGroup,
  createGroupInviteCode,
  getGroupBasicInfo,
  quitGroup,
  applyGroupInvite,
  modifyGroupField,
  createGroupPanel,
} from './model/group';
export type { GroupPanel, GroupInfo, GroupBasicInfo } from './model/group';
export type { ChatMessage } from './model/message';
export type { PluginManifest } from './model/plugin';
export type { UserBaseInfo, UserLoginInfo } from './model/user';
export {
  loginWithEmail,
  loginWithToken,
  registerWithEmail,
  searchUserWithUniqueName,
  checkTokenValid,
  modifyUserField,
} from './model/user';

// redux
export { useAppSelector, useAppDispatch } from './redux/hooks/useAppSelector';
export { useDMConverseList } from './redux/hooks/useConverse';
export { useConverseMessage } from './redux/hooks/useConverseMessage';
export {
  useGroupInfo,
  useGroupPanel,
  useIsGroupOwner,
} from './redux/hooks/useGroup';
export { useUserInfo, useUserId } from './redux/hooks/useUserInfo';
export { userActions } from './redux/slices';
export type { ChatConverseState } from './redux/slices/chat';
export { setupRedux } from './redux/setup';
export { createStore } from './redux/store';
export type { AppStore, AppDispatch } from './redux/store';

// utils
export {
  shouldShowMessageTime,
  getMessageTimeDiff,
  formatShortTime,
  datetimeToNow,
  datetimeFromNow,
} from './utils/date-helper';
export {
  isBrowser,
  isNavigator,
  isDevelopment,
  version,
} from './utils/environment';
export { getTextColorHex, isValidStr } from './utils/string-helper';
export { uploadFile } from './utils/upload-helper';
export type { UploadFileResult } from './utils/upload-helper';
export { sleep } from './utils/utils';
