import _get from 'lodash/get';
import _set from 'lodash/set';
import _isNil from 'lodash/isNil';
import { useEffect, useMemo, useRef } from 'react';
import { fetchUserInfo, UserBaseInfo } from '../../model/user';
import { cacheActions } from '../slices';
import type { CacheKey } from '../slices/cache';
import { useAppDispatch, useAppSelector } from './useAppSelector';

// 检查是否需要跳过处理
const isSkipId = (id: string) =>
  _isNil(id) ||
  id === '' ||
  typeof id !== 'string' ||
  id.toString().startsWith('_');

interface CacheHookOptions {
  forceFetch?: boolean;
}

type GetCacheDataFn = (id: string) => Promise<unknown>;

function reduxHookCacheFactory<T>(
  cacheScope: CacheKey,
  getCacheData: GetCacheDataFn
) {
  const isFetchingDataIdQueue: string[] = []; // 正在请求的id列表

  return function hook(id: string, options?: CacheHookOptions): Partial<T> {
    const data = useAppSelector<T>(
      (state) => _get(state, ['cache', cacheScope, id]) as any
    );
    const dispatch = useAppDispatch();
    const forceFetchRef = useRef(options?.forceFetch ?? false);

    useEffect(() => {
      if ((_isNil(data) || forceFetchRef.current === true) && !isSkipId(id)) {
        // 如果没有数据或设置了强制重新获取 且 不是内置的UUID
        // 从服务端获取缓存信息
        if (isFetchingDataIdQueue.indexOf(id) === -1) {
          // 没有正在获取缓存信息
          console.log(`缓存[${cacheScope}: ${id}]不存在， 自动获取`);

          getCacheData(id).then((data) => {
            // 从列表中移除
            const index = isFetchingDataIdQueue.indexOf(id);
            if (index !== -1) {
              isFetchingDataIdQueue.splice(index, 1);
            }
            forceFetchRef.current = false; // 不论怎么样都置为false 表示已经获取过了

            dispatch(
              cacheActions.setCache({
                scope: cacheScope,
                id,
                data,
              })
            );
          });

          isFetchingDataIdQueue.push(id);
        }
      }
    }, [data]);

    return data ?? {};
  };
}

export const useCachedUserInfo = reduxHookCacheFactory<UserBaseInfo>(
  'user',
  (userId) => fetchUserInfo(userId)
);

/**
 * redux 的批量获取hooks的构造器
 * 用于列表
 * @param cacheScope 缓存的域
 * @param getCacheDispatch 请求缓存的dispatch
 */
function reduxHookCacheListFactory<T>(
  cacheScope: CacheKey,
  getCacheData: GetCacheDataFn
) {
  const isFetchingDataIdQueue: string[] = []; // 正在请求的UUID列表

  return function hook<R extends Record<string, T> = Record<string, T>>(
    idList: string[]
  ): R {
    const cacheList = useAppSelector<R>(
      (state) => _get(state, ['cache', cacheScope]) as any
    );
    const dispatch = useAppDispatch();

    const resMap = useMemo<R>(() => {
      const map = {} as R;
      for (const id of idList) {
        if (_isNil(cacheList[id]) && !isSkipId(id)) {
          // 如果没有数据则请求数据
          // 从服务端获取缓存信息
          if (isFetchingDataIdQueue.indexOf(id) === -1) {
            // 没有正在获取缓存信息
            console.log(`缓存[${cacheScope}: ${id}]不存在， 自动获取`);
            getCacheData(id).then((data) => {
              // 从列表中移除
              const index = isFetchingDataIdQueue.indexOf(id);
              if (index !== -1) {
                isFetchingDataIdQueue.splice(index, 1);
              }

              dispatch(
                cacheActions.setCache({
                  scope: cacheScope,
                  id,
                  data,
                })
              );
            });

            isFetchingDataIdQueue.push(id);
          }
          continue;
        }

        // 加入返回的map中
        _set(map, id, cacheList[id]);
      }

      return map;
    }, [cacheList, idList.join(',')]);

    return resMap;
  };
}
export const useCachedUserInfoList = reduxHookCacheListFactory<UserBaseInfo>(
  'user',
  (userId) => fetchUserInfo(userId)
);
