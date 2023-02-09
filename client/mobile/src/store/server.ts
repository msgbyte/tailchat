import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { urlResolve } from '../lib/utils';

interface ServerInfo {
  name?: string;
  version?: string;
  url: string;
}

interface ServerStoreState {
  selectedServerInfo: ServerInfo | null;
  serverList: ServerInfo[];
  addServer: (url: string) => Promise<void>;
  selectServer: (serverInfo: ServerInfo) => void;
}

const defaultServerList: ServerInfo[] = [
  {
    name: 'Tailchat Nightly',
    url: 'https://nightly.paw.msgbyte.com/',
  },
];

export const useServerStore = create<ServerStoreState>()(
  immer((set) => ({
    serverList: defaultServerList,
    selectedServerInfo: null,
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
            name: serviceConfig.appName ?? 'Tailchat',
            url,
            version,
          });
        });
      } catch (err) {
        console.error('获取服务器配置失败:', err);
        throw err;
      }
    },
    selectServer: (serverInfo: ServerInfo) => {
      set({
        selectedServerInfo: serverInfo,
      });
    },
  }))
);
