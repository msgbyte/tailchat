/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FetchQueryOptions } from 'react-query';
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
export function buildCachedRequest<
  R extends any,
  F extends (...args: any) => Promise<R>
>(name: string, fn: F, options?: FetchQueryOptions): F {
  return ((...args: any) => {
    return queryClient.fetchQuery(
      [name, JSON.stringify(args)],
      () => fn(...args),
      options
    );
  }) as any;
}
