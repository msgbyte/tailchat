import { createSocket, useAsync } from 'pawchat-shared';
import { getUserJWT } from '../utils/jwt-helper';

/**
 * 创建全局Socket
 */
export function useEnsureSocket() {
  const {
    value: socket,
    loading,
    error,
  } = useAsync(async () => {
    const token = await getUserJWT();
    if (typeof token !== 'string') {
      throw new Error('Token不合法');
    }

    const socket = await createSocket(token);
    console.log('当前socket连接成功');

    return socket;
  }, []);

  return { loading, error, socket };
}
