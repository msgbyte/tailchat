import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ServerInfo {
  name?: string;
  version?: string;
  url: string;
}

interface ServerStoreState {
  selectedServerInfo: ServerInfo | null;
  serverList: ServerInfo[];
  addServer: (url: string) => void;
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
    addServer: (url: string) => {
      set((state) => {
        state.serverList.push({
          url,
        });
      });
    },
    selectServer: (serverInfo: ServerInfo) => {
      set({
        selectedServerInfo: serverInfo,
      });
    },
  }))
);
