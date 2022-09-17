import { useQuery, useQueryClient } from '../../cache/useCache';
import {
  getUserSettings,
  setUserSettings,
  UserSettings,
} from '../../model/user';
import { useAsyncRequest } from '../useAsyncRequest';

/**
 * 用户设置hooks
 */
export function useUserSettings() {
  const client = useQueryClient();
  const { data: settings, isLoading } = useQuery(
    ['useUserSettings'],
    () => getUserSettings(),
    {
      staleTime: 1 * 60 * 1000, // 缓存1分钟
    }
  );

  const [{ loading: saveLoading }, setSettings] = useAsyncRequest(
    async (settings: UserSettings) => {
      const newSettings = await setUserSettings(settings);

      client.setQueryData(['useUserSettings'], () => newSettings);
    },
    [client]
  );

  return {
    settings: settings ?? {},
    setSettings,
    loading: isLoading || saveLoading,
  };
}

/**
 * 单个用户设置
 */
export function useSingleUserSetting<K extends keyof UserSettings>(
  name: K,
  defaultValue?: UserSettings[K]
) {
  const { settings, setSettings, loading } = useUserSettings();

  return {
    value: settings[name] ?? defaultValue,
    setValue: async (newVal: UserSettings[K]) =>
      setSettings({
        [name]: newVal,
      }),
    loading,
  };
}
