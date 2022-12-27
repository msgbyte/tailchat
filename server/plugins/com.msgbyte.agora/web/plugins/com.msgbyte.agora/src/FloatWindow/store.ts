import type { IAgoraRTCRemoteUser } from 'agora-rtc-react';
import create from 'zustand';

interface MeetingState {
  /**
   * 本次会议用户列表
   */
  users: IAgoraRTCRemoteUser[];
  appendUser: (user: IAgoraRTCRemoteUser) => void;
  removeUser: (user: IAgoraRTCRemoteUser) => void;
  clearUser: () => void;
  /**
   * 更新用户信息
   */
  updateUserInfo: (user: IAgoraRTCRemoteUser) => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  users: [],
  appendUser: (user: IAgoraRTCRemoteUser) => {
    set((state) => ({
      users: [...state.users, user],
    }));
  },
  removeUser: (user: IAgoraRTCRemoteUser) => {
    set((state) => {
      return {
        users: state.users.filter((_u) => _u.uid !== user.uid),
      };
    });
  },
  clearUser: () => {
    set({ users: [] });
  },
  updateUserInfo: (user: IAgoraRTCRemoteUser) => {
    set((state) => {
      const users = [...state.users];
      const targetUserIndex = state.users.findIndex((u) => u.uid === user.uid);
      if (targetUserIndex === -1) {
        return {};
      }

      users[targetUserIndex] = user;

      return {
        users,
      };
    });
  },
}));
