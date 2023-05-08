import axios from 'axios';
import { authStorageKey } from './auth';
import _set from 'lodash/set';
import { fetchJSON } from 'tushan';

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

export const httpClient: typeof fetchJSON = (url, options = {}) => {
  try {
    if (!options.headers) {
      options.headers = new Headers({ Accept: 'application/json' });
    }
    const { token } = JSON.parse(
      window.localStorage.getItem(authStorageKey) ?? '{}'
    );
    (options.headers as Headers).set('Authorization', `Bearer ${token}`);

    return fetchJSON(url, options);
  } catch (err) {
    return Promise.reject();
  }
};
