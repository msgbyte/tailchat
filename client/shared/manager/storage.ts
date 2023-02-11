import { buildRegFn } from './buildReg';
import { useCallback, useLayoutEffect, useState } from 'react';

export interface StorageObject {
  /**
   * NOTICE: 与save不同， set存储 1 天
   */
  set: (key: string, data: any) => Promise<void>;
  get: (key: string, defaultVal?: any) => Promise<any>;
  remove: (key: string) => Promise<void>;
  save: (key: string, data: any) => Promise<void>;
}

/**
 * 持久化存储相关逻辑
 */
export const [getStorage, setStorage] =
  buildRegFn<() => StorageObject>('storage');

/**
 * 持久化hook的缓存, 减少因一步获取数据导致的gap
 */
const useStorageCache = new Map<string, any>();

/**
 * 管理持久化存储数据
 * @param key 存储键
 * @param defaultValue 默认值
 */
export function useStorage<T = any>(
  key: string,
  defaultValue?: T
): [T | undefined, { set: (v: T) => void; save: (v: T) => void }] {
  const [value, setValue] = useState<T | undefined>(
    useStorageCache.get(key) ?? defaultValue
  );

  useLayoutEffect(() => {
    getStorage()
      .get(key)
      .then((data: T) => {
        setValue(data ?? defaultValue);
        useStorageCache.set(key, data ?? defaultValue);
      });
  }, [key]);

  const set = useCallback(
    (newVal: T) => {
      setValue(newVal);
      getStorage().set(key, newVal);
      useStorageCache.set(key, newVal);
    },
    [key]
  );

  const save = useCallback(
    (newVal: T) => {
      setValue(newVal);
      getStorage().save(key, newVal);
      useStorageCache.set(key, newVal);
    },
    [key]
  );

  return [value, { set, save }];
}
