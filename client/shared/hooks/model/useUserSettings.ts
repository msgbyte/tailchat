import { CacheKey } from '../../cache/cache';
import { useQuery, useQueryClient } from '../../cache/useCache';
import { sharedEvent } from '../../event';
import {
  getUserSettings,
  setUserSettings,
  UserSettings,
} from '../../model/user';
import { useAsyncRequest } from '../useAsyncRequest';
import { useMemoizedFn } from '../useMemoizedFn';
import _without from 'lodash/without';
import { useState } from 'react';

/**
 * 用户设置hooks
 */
export function useUserSettings() {
  const client = useQueryClient();
  const { data: settings, isLoading } = useQuery(
    [CacheKey],
    () => getUserSettings(),
    {
      staleTime: 10 * 60 * 1000, // 缓存10分钟
    }
  );

  const [{ loading: saveLoading }, setSettings] = useAsyncRequest(
    async (settings: UserSettings) => {
      client.setQueryData([CacheKey], () => settings); // 让配置能够立即生效, 防止依赖配置的行为出现跳变(如GroupNav)

      const newSettings = await setUserSettings(settings);

      client.setQueryData([CacheKey], () => newSettings);
      sharedEvent.emit('userSettingsUpdate', newSettings);
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

/**
 * 用户消息通知免打扰设置
 */
export function useUserNotifyMute() {
  const { value: list = [], setValue: setList } = useSingleUserSetting(
    'messageNotificationMuteList',
    []
  );

  const mute = useMemoizedFn((converseOrGroupId: string) => {
    setList([...list, converseOrGroupId]);
  });

  const unmute = useMemoizedFn((converseOrGroupId: string) => {
    setList(_without(list, converseOrGroupId));
  });

  const toggleMute = useMemoizedFn((converseOrGroupId) => {
    if (list.includes(converseOrGroupId)) {
      unmute(converseOrGroupId);
    } else {
      mute(converseOrGroupId);
    }
  });

  /**
   * 检查是否被静音
   */
  const checkIsMuted = useMemoizedFn((panelId: string, groupId?: string) => {
    if (groupId) {
      return list.includes(panelId) || list.includes(groupId);
    }

    return list.includes(panelId);
  });

  return {
    mutedList: list,
    mute,
    unmute,
    toggleMute,
    checkIsMuted,
  };
}
