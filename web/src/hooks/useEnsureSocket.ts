import { createSocket, useAsync } from 'pawchat-shared';
import { getUserJWT } from '../utils/jwt-helper';

/**
 * 创建全局Socket
 */
export function useEnsureSocket() {
  const { loading, error } = useAsync(async () => {
    const token = await getUserJWT();
    if (typeof token === 'string') {
      await createSocket(token);
      console.log('当前socket连接成功'); // TODO
    }
  }, []);

  return { loading, error };
}
