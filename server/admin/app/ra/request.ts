import axios from 'axios';
import { authStorageKey } from './authProvider';
import _set from 'lodash/set';

/**
 * 创建请求实例
 */
function createRequest() {
  const ins = axios.create({
    baseURL: '/admin/api',
  });

  ins.interceptors.request.use(async (val) => {
    try {
      const { token } = JSON.parse(
        window.localStorage.getItem(authStorageKey) ?? '{}'
      );
      _set(val, ['headers', 'Authorization'], `Bearer ${token}`);

      return val;
    } catch (err) {
      throw err;
    }
  });

  return ins;
}

export const request = createRequest();
