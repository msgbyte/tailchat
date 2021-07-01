import { buildRegFn } from './buildRegFn';
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
 * 管理持久化存储数据
 * @param key 存储键
 * @param defaultValue 默认值
 */
export function useStorage<T>(
  key: string,
  defaultValue?: T
): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useLayoutEffect(() => {
    getStorage()
      .get(key)
      .then((data: T) => {
        setValue(data ?? defaultValue);
      });
  }, [key]);

  const set = useCallback(
    (newVal: T) => {
      setValue(newVal);
      getStorage().set(key, newVal);
    },
    [key]
  );

  const save = useCallback(
    (newVal: T) => {
      setValue(newVal);
      getStorage().save(key, newVal);
    },
    [key]
  );

  return [value, { set, save }];
}
