import { createStore } from 'pawchat-shared';
import React, { useMemo } from 'react';
import { useEnsureSocket } from '../hooks/useEnsureSocket';
import { LoadingSpinner } from './LoadingSpinner';
import { Provider as ReduxProvider } from 'react-redux';
import { useSetupRedux } from '../hooks/useSetupRedux';

/**
 * 主页面核心数据Provider
 * 在主页存在
 */
export const MainProvider: React.FC = React.memo((props) => {
  const store = useMemo(() => createStore(), []);
  const { socket, loading } = useEnsureSocket();

  useSetupRedux(socket, store);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-700 text-white text-xl">
        <LoadingSpinner tip="正在连接到聊天服务器..." />
      </div>
    );
  }

  return <ReduxProvider store={store}>{props.children}</ReduxProvider>;
});
MainProvider.displayName = 'MainProvider';
