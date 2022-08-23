import {
  regCustomPanel,
  Loadable,
  regInspectService,
  regPluginPanelAction,
  regPluginRootRoute,
  regSocketEventListener,
  getCachedUserInfo,
  getJWTUserInfo,
} from '@capital/common';
import { openConfirmModal, notification, Button } from '@capital/component';
import React from 'react';
import { createMeetingAndShare } from './helper';
import { request } from './request';
import { Translate } from './translate';

console.log('Plugin 音视频服务 is loaded');

async function startFastMeeting(meetingId: string) {
  const module = await import('./FloatWindow');
  module.startFastMeeting(meetingId); // 仅用于测试
}

// regCustomPanel({
//   position: 'personal',
//   icon: 'mdi:video-box',
//   name: 'com.msgbyte.meeting/meetingPanel',
//   label: Translate.meeting,
//   render: Loadable(() => import('./MeetingPanel')),
// });

// 发起个人通话
regPluginPanelAction({
  name: 'plugin:com.msgbyte.meeting/dmAction',
  label: '发起通话',
  position: 'dm',
  icon: 'mdi:video-box',
  onClick: ({ converseId }) => {
    startFastMeeting(converseId).then(() => {
      request.post('inviteUserConverseJoinMeeting', {
        meetingId: converseId,
        converseId,
      });

      // TODO: 启动后发送消息卡片
    });
  },
});

// 发起群组会议
regPluginPanelAction({
  name: 'plugin:com.msgbyte.meeting/groupAction',
  label: '发起通话',
  position: 'group',
  icon: 'mdi:video-box',
  onClick: ({ groupId, panelId }) => {
    openConfirmModal({
      title: '发起通话',
      content: '打开 tailchat-meeting 开始通话并向当前会话发送会议链接',
      onConfirm: async () => {
        await createMeetingAndShare(groupId, panelId);
      },
    });
  },
});

regPluginRootRoute({
  name: 'plugin:com.msgbyte.meeting/route',
  path: '/meeting/:meetingId',
  component: Loadable(() => import('./MeetingUrlWrapper')),
});

regInspectService({
  name: 'plugin:com.msgbyte.meeting',
  label: Translate.meetingService,
});

regSocketEventListener({
  eventName: 'plugin:com.msgbyte.meeting.inviteJoinMeeting',
  eventFn: async ({
    meetingId,
    fromId,
  }: {
    meetingId: string;
    fromId: string;
  }) => {
    console.log(meetingId);
    const selfInfo = await getJWTUserInfo();
    if (selfInfo._id === fromId) {
      // 跳过自己发起的
      return;
    }

    const userInfo = await getCachedUserInfo(fromId);

    const key = `open${Date.now()}`;
    notification.open({
      message: '视频会议邀请',
      description: `${userInfo.nickname} 邀请您加入视频会议`,
      duration: 0,
      key,
      btn: (
        <Button
          type="primary"
          onClick={() => {
            startFastMeeting(meetingId);
            notification.close(key);
          }}
        >
          立即加入
        </Button>
      ),
      onClose: () => {
        // TODO: 发送拒绝
      },
    });
  },
});
