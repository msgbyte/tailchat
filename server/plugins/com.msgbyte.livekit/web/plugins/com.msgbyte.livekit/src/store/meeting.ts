import { createStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { request } from '../request';
import { getCachedUserInfo, showErrorToasts } from '@capital/common';
import { Translate } from '../translate';

export interface MeetingState {
  meetingId: string;
  rightPanel: 'chat' | 'member' | null;
  invitingUserIds: string[]; // 正在邀请的用户id
  setRightPanel: (panel: 'chat' | 'member' | null) => void;
  inviteUsers: (userIds: string[]) => Promise<void>;
  inviteUserCompleted: (userId: string) => void;
}

export function createMeetingStateStore(meetingId: string) {
  return createStore<MeetingState>()(
    immer((set, get) => ({
      meetingId,
      rightPanel: null,
      invitingUserIds: [],
      setRightPanel: (rightPanel) => {
        if (get().rightPanel === rightPanel) {
          // toggle
          set({ rightPanel: null });
        } else {
          set({ rightPanel });
        }
      },
      async inviteUsers(userIds: string[]) {
        const { meetingId, inviteUserCompleted } = get();
        const res = await request.post('inviteCall', {
          roomName: meetingId,
          targetUserIds: userIds,
        });

        const { online, offline } = res.data;

        if (Array.isArray(offline) && offline.length > 0) {
          // 部分通知失败，对方不在线
          Promise.all(offline.map((userId) => getCachedUserInfo(userId))).then(
            (users) => {
              const names = users.map((u) => u.nickname);

              showErrorToasts(Translate.callFailed + ' : ' + names.join(', '));

              users.forEach((user) => inviteUserCompleted(user._id));
            }
          );
        }

        set((state) => ({
          invitingUserIds: Array.from(
            new Set([...state.invitingUserIds, ...online])
          ),
        }));
      },
      inviteUserCompleted(userId: string) {
        set((state) => ({
          invitingUserIds: state.invitingUserIds.filter((id) => id !== userId),
        }));
      },
    }))
  );
}

export type MeetingStateStoreType = ReturnType<typeof createMeetingStateStore>;
