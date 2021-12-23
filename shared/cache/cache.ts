import { ChatConverseInfo, fetchConverseInfo } from '../model/converse';
import { findGroupInviteByCode, GroupInvite } from '../model/group';
import {
  fetchGithubStaticRegistryPlugins,
  fetchRegistryPlugins,
  fetchServiceRegistryPlugins,
  PluginManifest,
} from '../model/plugin';
import { fetchUserInfo, UserBaseInfo } from '../model/user';
import { queryClient } from './index';

/**
 * 获取缓存的用户信息
 */
export async function getCachedUserInfo(
  userId: string,
  refetch = false
): Promise<UserBaseInfo> {
  const data = await queryClient.fetchQuery(
    ['user', userId],
    () => fetchUserInfo(userId),
    {
      staleTime: refetch ? 0 : 2 * 60 * 60 * 1000, // 缓存2小时
    }
  );

  return data;
}

/**
 * 获取缓存的会话信息
 */
export async function getCachedConverseInfo(
  converseId: string
): Promise<ChatConverseInfo> {
  const data = await queryClient.fetchQuery(['converse', converseId], () =>
    fetchConverseInfo(converseId)
  );

  return data;
}

/**
 * 获取缓存的邀请码信息
 */
export async function getCachedGroupInviteInfo(
  inviteCode: string
): Promise<GroupInvite | null> {
  const data = await queryClient.fetchQuery(['groupInvite', inviteCode], () =>
    findGroupInviteByCode(inviteCode)
  );

  return data;
}

/**
 * 获取缓存的插件列表
 */
export async function getCachedRegistryPlugins(): Promise<PluginManifest[]> {
  const data = await queryClient.fetchQuery(
    ['pluginRegistry'],
    () =>
      Promise.all([
        fetchRegistryPlugins().catch(() => []),
        fetchServiceRegistryPlugins().catch(() => []),
        fetchGithubStaticRegistryPlugins().catch(() => []),
      ]).then(([a, b, c]) => [...a, ...b, ...c]),
    {
      staleTime: 2 * 60 * 60 * 1000, // 缓存2小时
    }
  );

  return data;
}
