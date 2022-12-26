import { ChatConverseInfo, fetchConverseInfo } from '../model/converse';
import { findGroupInviteByCode, GroupInvite } from '../model/group';
import {
  fetchLocalStaticRegistryPlugins,
  fetchRegistryPlugins,
  fetchServiceRegistryPlugins,
  PluginManifest,
} from '../model/plugin';
import { fetchUserInfo, UserBaseInfo } from '../model/user';
import { parseUrlStr } from '../utils/url-helper';
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
        fetchServiceRegistryPlugins()
          .then((list) =>
            list.map((manifest) => {
              const serviceManifest = {
                ...manifest,
                // 后端url策略。根据前端的url在获取时自动变更为当前链接的后端地址
                url: parseUrlStr(manifest.url),
              };

              if (manifest.icon) {
                serviceManifest.icon = parseUrlStr(manifest.icon);
              }

              if (manifest.documentUrl) {
                serviceManifest.documentUrl = parseUrlStr(manifest.documentUrl);
              }

              return serviceManifest;
            })
          )
          .catch(() => []),
        fetchLocalStaticRegistryPlugins().catch(() => []),
      ]).then(([a, b, c]) => [...a, ...b, ...c]),
    {
      staleTime: 2 * 60 * 60 * 1000, // 缓存2小时
    }
  );

  return data;
}
