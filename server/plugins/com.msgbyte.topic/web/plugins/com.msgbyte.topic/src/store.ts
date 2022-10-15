import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { GroupTopic } from './types';

interface TopicPanelMap {
  [panelId: string]: GroupTopic[];
}

interface TopicStoreState {
  topicMap: TopicPanelMap;
  addTopicPanel: (panelId: string, topicList: GroupTopic[]) => void;
  addTopicItem: (panelId: string, topic: GroupTopic) => void;
  updateTopicItem: (panelId: string, topic: GroupTopic) => void;
  resetTopicPanel: (panelId: string) => void;
}

export const useTopicStore = create<
  TopicStoreState,
  [['zustand/immer', never]]
>(
  immer((set) => ({
    topicMap: {},
    addTopicPanel: (panelId, topicList) => {
      set((state) => {
        if (state.topicMap[panelId]) {
          state.topicMap[panelId].push(...topicList);
        } else {
          state.topicMap[panelId] = topicList;
        }
      });
    },
    addTopicItem: (panelId, topic) => {
      set((state) => {
        if (state.topicMap[panelId]) {
          state.topicMap[panelId].unshift(topic);
        }
      });
    },
    updateTopicItem: (panelId, topic) => {
      set((state) => {
        if (state.topicMap[panelId]) {
          const findedTopicIndex = state.topicMap[panelId].findIndex(
            (t) => t._id === topic._id
          );
          if (findedTopicIndex >= 0) {
            state.topicMap[panelId][findedTopicIndex] = topic;
          }
        }
      });
    },
    resetTopicPanel: (panelId) => {
      set((state) => {
        delete state.topicMap[panelId];
      });
    },
  }))
);
