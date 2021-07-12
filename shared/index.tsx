// api
export { buildStorage } from './api/buildStorage';
export { createSocket } from './api/socket';
export type { AppSocket } from './api/socket';

// components
export { FastForm } from './components/FastForm/index';
export { CustomField } from './components/FastForm/CustomField';
export type {
  FastFormFieldComponent,
  FastFormFieldProps,
  FastFormFieldMeta,
} from './components/FastForm/field';
export { regField } from './components/FastForm/field';
export { regFormContainer } from './components/FastForm/container';
export type { FastFormContainerComponent } from './components/FastForm/container';

// i18n
export { t, setLanguage, useTranslation } from './i18n';

// hooks
export { useAsync } from './hooks/useAsync';
export { useAsyncFn } from './hooks/useAsyncFn';
export { useMountedState } from './hooks/useMountedState';
export { useRafState } from './hooks/useRafState';

// manager
export { getStorage, setStorage, useStorage } from './manager/storage';
export { setTokenGetter } from './manager/request';
export { setServiceUrl } from './manager/service';
export {
  showToasts,
  setToasts,
  showAlert,
  setAlert,
  showErrorToasts,
} from './manager/ui';

// model
export { addFriendRequest } from './model/friend';
export type { FriendRequest } from './model/friend';
export type { UserBaseInfo, UserLoginInfo } from './model/user';
export {
  loginWithEmail,
  registerWithEmail,
  searchUserWithUniqueName,
} from './model/user';

// redux
export { useAppSelector, useAppDispatch } from './redux/hooks/useAppSelector';
export {
  useCachedUserInfo,
  useCachedUserInfoList,
} from './redux/hooks/useReduxCache';
export { userActions } from './redux/slices';
export { setupRedux } from './redux/setup';
export { createStore } from './redux/store';
export type { AppStore, AppDispatch } from './redux/store';

// utils
export { getTextColorHex } from './utils/string-helper';
export { isBrowser, isNavigator } from './utils/environment';
