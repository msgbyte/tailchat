import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { urlResolve } from '../utils';

/**
 * Same with mobile
 */

interface ServerInfo {
  name?: string;
  version?: string;
  url: string;
  icon?: string;
}

interface ServerStoreState {
  serverList: ServerInfo[];
  addServer: (url: string) => Promise<void>;
  removeServer: (url: string) => void;
}

export const defaultServerList: ServerInfo[] = [
  {
    name: 'Tailchat',
    url: 'https://nightly.paw.msgbyte.com/',
    version: 'nightly',
  },
];

export const useServerStore = create<ServerStoreState>()(
  persist(
    immer((set) => ({
      serverList: defaultServerList,
      addServer: async (url: string) => {
        try {
          // 获取 Tailchat 客户端配置
          const res = await fetch(urlResolve(url, './tailchat.manifest'));
          const clientConfig = await res.json();
          const { version, serviceUrl } = clientConfig;
          console.log('获取Tailchat客户端配置成功', clientConfig);

          // 获取 Tailchat 服务端配置
          const res2 = await fetch(
            urlResolve(serviceUrl ?? url, './api/config/client')
          );
          const serviceConfig = (await res2.json()).data;
          console.log('获取Tailchat服务端配置成功', serviceConfig);

          set((state) => {
            state.serverList.push({
              name: serviceConfig.serverName ?? 'Tailchat',
              url,
              version,
            });
          });
        } catch (err) {
          console.error('获取服务器配置失败:', err);
          throw err;
        }
      },
      removeServer: (url: string) => {
        set((state) => {
          state.serverList = state.serverList.filter((s) => s.url !== url);
        });
      },
    })),
    {
      name: 'server',
      partialize: (state) => ({ serverList: state.serverList }),
    }
  )
);
