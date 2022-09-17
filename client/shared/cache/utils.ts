/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FetchQueryOptions } from '@tanstack/react-query';
import { queryClient } from './';

/**
 * 构建缓存请求
 * TODO: 这里的类型真的不好写, 先用any来过滤内部的, 只保证外部使用ok
 *
 * @example
 * const queryData = buildCachedRequest('key', (arg1, arg2) => {
 *    return request.post(...)
 * })
 */
export function buildCachedRequest<R, F extends (...args: any) => Promise<R>>(
  name: string,
  fn: F,
  options?: FetchQueryOptions
): F & {
  /**
   * 根据name重新获取数据
   */
  refetch: () => Promise<void>;
  /**
   * 清空name相关缓存
   */
  clearCache: () => void;
} {
  const req = ((...args: any) => {
    return queryClient.fetchQuery(
      [name, JSON.stringify(args)],
      () => fn(...args),
      options
    );
  }) as any;

  const refetch = () => {
    return queryClient.refetchQueries([name]);
  };

  const clearCache = () => {
    queryClient.removeQueries([name]);
  };

  req.refetch = refetch;
  req.clearCache = clearCache;

  return req;
}
