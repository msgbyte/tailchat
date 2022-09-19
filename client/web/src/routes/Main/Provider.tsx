import {
  createSocket,
  createStore,
  setupRedux,
  useAsync,
  userActions,
  t,
  ReduxProvider,
  UserLoginInfo,
} from 'tailchat-shared';
import React, { PropsWithChildren } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { tryAutoLogin } from '@/utils/user-helper';
import _isNil from 'lodash/isNil';
import { useNavigate } from 'react-router';
import { SidebarContextProvider } from './SidebarContext';
import { PortalHost } from '@/components/Portal';
import { setGlobalSocket, setGlobalStore } from '@/utils/global-state-helper';
import { SocketContextProvider } from '@/context/SocketContext';
import { Problem } from '@/components/Problem';

/**
 * 应用状态管理hooks
 */
function useAppState() {
  const navigate = useNavigate();

  const { value, loading, error } = useAsync(async () => {
    let userLoginInfo: UserLoginInfo;
    try {
      userLoginInfo = await tryAutoLogin();
    } catch (e) {
      // 当前 Token 不存在或已过期
      navigate(
        `/entry/login?redirect=${encodeURIComponent(location.pathname)}`,
        { replace: true }
      );
      return;
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

  return { loading, store, socket, error };
}

/**
 * 主页面核心数据Provider
 * 在主页存在
 */
export const MainProvider: React.FC<PropsWithChildren> = React.memo((props) => {
  const { loading, store, error, socket } = useAppState();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-content-light dark:bg-content-dark text-gray-700 dark:text-white text-xl">
        <LoadingSpinner tip={t('正在连接到聊天服务器...')} />
      </div>
    );
  }

  if (error) {
    console.error('[MainProvider]', error);
    return <div>{error.message}</div>;
  }

  if (_isNil(store)) {
    return <Problem text={t('出现异常, Store 创建失败')} />;
  }

  if (_isNil(socket)) {
    return <Problem text={t('出现异常, Socket 创建失败')} />;
  }

  return (
    <ReduxProvider store={store}>
      <SocketContextProvider socket={socket}>
        <SidebarContextProvider>
          <PortalHost>{props.children}</PortalHost>
        </SidebarContextProvider>
      </SocketContextProvider>
    </ReduxProvider>
  );
});
MainProvider.displayName = 'MainProvider';
