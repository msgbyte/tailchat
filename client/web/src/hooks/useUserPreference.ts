import { useSessionStorageState } from './useSessionStorageState';
import { useMemoizedFn } from 'tailchat-shared';

interface UserSessionPerference {
  /**
   * 用户最后访问个人的面板地址
   * 用于切换回个人菜单时回到最近一个
   */
  personLastVisitPanelUrl?: string;
  /**
   * 用户最后访问群组的面板id
   * 用于切换群组时回到最后一个
   */
  groupLastVisitPanel?: Record<string, string>;
}

/**
 * 用户偏好
 * 用于在本地缓存一些不是那么重要的数据
 */
export function useUserSessionPreference<T extends keyof UserSessionPerference>(
  scope: T
): [UserSessionPerference[T], (value: UserSessionPerference[T]) => void] {
  const [preference = {}, setPreference] =
    useSessionStorageState<UserSessionPerference>('sessionPreference');
  const value = preference[scope];
  const setValue = useMemoizedFn((value: UserSessionPerference[T]) => {
    setPreference({
      ...preference,
      [scope]: value,
    });
  });

  return [value, setValue];
}
