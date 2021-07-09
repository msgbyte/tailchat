import axios from 'axios';
import _get from 'lodash/get';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import _isFunction from 'lodash/isFunction';
import { config } from '../config';
import { getErrorHook, tokenGetter } from '../manager/request';
import { getServerUrl } from '../manager/server';

export type CommonRequestResult<T> =
  | ({
      result: false;
      msg: string;
    } & Partial<T>) // 并上一个T是为了方便取值, 但需要判定
  | ({
      result: true;
    } & T);

class RequestError extends Error {}

/**
 * 创建请求实例
 */
export function createRequest() {
  const ins = axios.create({
    baseURL: getServerUrl(),
  });

  ins.interceptors.request.use(async (val) => {
    if (
      ['post', 'get'].includes(String(val.method).toLowerCase()) &&
      !val.headers['X-Token']
    ) {
      // 任何请求都尝试增加token
      val.headers['X-Token'] = await tokenGetter();
    }

    return val;
  });

  ins.interceptors.response.use(
    (val) => {
      return val;
    },
    (err) => {
      // 尝试获取错误信息
      const errorMsg: string = _get(err, 'response.data.message');
      const code: number = _get(err, 'response.data.code');
      if (_isFunction(getErrorHook)) {
        const isContinue = getErrorHook(err);
        if (isContinue === false) {
          return { data: { result: false, msg: errorMsg, code } };
        }
      }

      throw new RequestError(errorMsg ?? err.message);
    }
  );

  return ins;
}

export const request = createRequest();
