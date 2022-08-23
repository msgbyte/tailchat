import _isFunction from 'lodash/isFunction';
import _isEqual from 'lodash/isEqual';

/**
 * 构建一对get set 方法
 * 用于在不同平台拥有统一方式调用体验
 */
export function buildRegFn<F extends (...args: any[]) => any>(
  name: string,
  defaultFunc?: F
) {
  let func: F;

  const get = (...args: Parameters<F>): ReturnType<F> => {
    if (!func) {
      if (_isFunction(defaultFunc)) {
        return defaultFunc(...args);
      }

      throw new Error(`${name} not regist`);
    }
    return func(...args);
  };

  const set = (fn: F): void => {
    func = fn;
  };

  return [get, set] as const;
}

/**
 * 构建带事件监听的get set 方法
 */
export function buildRegFnWithEvent<F extends (...args: any[]) => any>(
  name: string,
  defaultFunc?: F
) {
  const [get, _set] = buildRegFn(name, defaultFunc);
  const listenerList: ((v: F) => void)[] = [];
  const onSet = (cb: (v: F) => void): void => {
    listenerList.push(cb);
  };

  const set = (fn: F): void => {
    _set(fn);
    listenerList.forEach((listener) => listener(fn));
  };

  return [get, set, onSet] as const;
}

/**
 * 缓存版本的buildRegFn
 */
export function buildCachedRegFn<F extends (...args: any) => any>(
  name: string,
  defaultFunc?: F
) {
  const [get, set] = buildRegFn(name, defaultFunc);

  let _result: any = null; // 缓存的返回值
  let _lastArgs: any;

  function isSame(args: any[]) {
    // 当有缓存的返回值且两次参数一致
    return _result !== null && _isEqual(args, _lastArgs);
  }

  // 根据是否为 promise 做区分
  const cachedGet: any = (...args: any) => {
    if (isSame(args)) {
      return _result;
    } else {
      const result = get(...args);
      _result = result ?? null;
      _lastArgs = args;
      return result;
    }
  };

  const refreshCache = () => {
    _result = null;
  };

  const cachedSet = (fn: F) => {
    set(fn);
    refreshCache();
  };

  return [cachedGet, cachedSet, refreshCache];
}

/**
 * 缓存版本的buildRegFn
 * Promise 版本
 */
export function buildCachedRegFnAsync<F extends (...args: any) => any>(
  name: string,
  defaultFunc?: F
) {
  const [get, set] = buildRegFn(name, defaultFunc);

  let _result: any = null; // 缓存的返回值
  let _lastArgs: any;

  function isSame(args: any[]) {
    // 当有缓存的返回值且两次参数一致
    return _result !== null && _isEqual(args, _lastArgs);
  }

  // 根据是否为 promise 做区分
  const cachedGet: any = async (...args: any) => {
    if (isSame(args)) {
      return _result;
    } else {
      const result = await get(...args);
      _result = result ?? null;
      _lastArgs = args;
      return result;
    }
  };

  const refreshCache = () => {
    _result = null;
  };

  const cachedSet = (fn: F) => {
    set(fn);
    refreshCache();
  };

  return [cachedGet, cachedSet, refreshCache];
}
