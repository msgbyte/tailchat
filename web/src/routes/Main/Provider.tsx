import {
  createSocket,
  createStore,
  setupRedux,
  useAsync,
  userActions,
  loginWithToken,
  t,
} from 'tailchat-shared';
import React from 'react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Provider as ReduxProvider } from 'react-redux';
import { getGlobalUserLoginInfo } from '../../utils/user-helper';
import _isNil from 'lodash/isNil';
import { getUserJWT } from '../../utils/jwt-helper';
import { useHistory } from 'react-router';
import { SidebarContextProvider } from './SidebarContext';
import { PortalHost } from '@/components/Portal';
import { setGlobalSocket, setGlobalStore } from '@/utils/global-state-helper';

/**
 * 应用状态管理hooks
 */
function useAppState() {
  const history = useHistory();

  const { value, loading } = useAsync(async () => {
    let userLoginInfo = getGlobalUserLoginInfo();
    if (_isNil(userLoginInfo)) {
      // 如果没有全局缓存的数据, 则尝试自动登录
      try {
        const token = await getUserJWT();
        if (typeof token !== 'string') {
          throw new Error('Token 不合法');
        }
        userLoginInfo = await loginWithToken(token);
      } catch (e) {
        // 当前 Token 不存在或已过期
        history.replace('/entry/login');
        return;
      }
    }

    // 到这里 userLoginInfo 必定存在
    // 创建Redux store
    const store = createStore();
    store.dispatch(userActions.setUserInfo(userLoginInfo));
    setGlobalStore(store);

    // 创建 websocket 连接
    const socket = await createSocket(userLoginInfo.token);
    setGlobalSocket(socket);

    // 初始化Redux
    setupRedux(socket, store);

    return { store, socket };
  }, [history]);

  const store = value?.store;
  const socket = value?.socket;

  return { loading, store, socket };
}

/**
 * 主页面核心数据Provider
 * 在主页存在
 */
export const MainProvider: React.FC = React.memo((props) => {
  const { loading, store } = useAppState();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-content-light dark:bg-content-dark text-gray-700 dark:text-white text-xl">
        <LoadingSpinner tip={t('正在连接到聊天服务器...')} />
      </div>
    );
  }

  if (_isNil(store)) {
    return <div>出现异常, Store 创建失败</div>;
  }

  return (
    <ReduxProvider store={store}>
      <SidebarContextProvider>
        <PortalHost>{props.children}</PortalHost>
      </SidebarContextProvider>
    </ReduxProvider>
  );
});
MainProvider.displayName = 'MainProvider';
