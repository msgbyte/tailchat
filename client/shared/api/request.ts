import axios, { AxiosRequestConfig } from 'axios';
import _get from 'lodash/get';
import _isFunction from 'lodash/isFunction';
import { t } from '../i18n';
import { getErrorHook, tokenGetter } from '../manager/request';
import { getServiceUrl, onServiceUrlChange } from '../manager/service';

export type CommonRequestResult<T> =
  | ({
      result: false;
      msg: string;
    } & Partial<T>) // 并上一个T是为了方便取值, 但需要判定
  | ({
      result: true;
    } & T);

class RequestError extends Error {}

export type RequestConfig = AxiosRequestConfig;

/**
 * 创建请求实例
 */
function createRequest() {
  const ins = axios.create({
    baseURL: getServiceUrl(),
  });
  onServiceUrlChange((getUrl) => {
    // 重置请求地址
    ins.defaults.baseURL = getUrl();
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
      /**
       * 预处理返回的数据
       */
      val.data = _get(val.data, 'data', val.data);

      return val;
    },
    (err) => {
      // 尝试获取错误信息
      const responseData = _get(err, 'response.data') ?? {};
      let errorMsg: string = responseData.message;
      const code: number = responseData.code;

      if (responseData.type === 'VALIDATION_ERROR') {
        // 校验失败
        errorMsg = t('请求参数校验失败');

        if (Array.isArray(responseData.data)) {
          console.error(JSON.stringify(responseData.data));

          try {
            errorMsg += `: ${responseData.data
              .map((item: any) => item.field)
              .join(', ')}`;
          } catch (e) {}
        }
      }

      // comment it logic because if not throw error, react query will cache `{ data: { result: false, msg: errorMsg, code } }` and has some problem
      if (_isFunction(getErrorHook)) {
        const isContinue = getErrorHook(err);
        // if (isContinue === false) {
        //   return { data: { result: false, msg: errorMsg, code } };
        // }
      }

      throw new RequestError(errorMsg ?? err.message);
    }
  );

  return ins;
}

export const request = createRequest();
