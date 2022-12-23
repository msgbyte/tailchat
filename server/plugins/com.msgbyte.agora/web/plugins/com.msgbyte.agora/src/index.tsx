import { regPluginPanelAction } from '@capital/common';
import { openConfirmModal } from '@capital/component';

console.log('Plugin 声网音视频 is loaded');

async function startFastMeeting(meetingId: string) {
  const module = await import('./FloatWindow');
  module.startFastMeeting(meetingId); // 仅用于测试
}

// 发起群组会议
regPluginPanelAction({
  name: 'plugin:com.msgbyte.meeting/groupAction',
  label: '发起通话',
  position: 'group',
  icon: 'mdi:video-box',
  onClick: ({ groupId, panelId }) => {
    openConfirmModal({
      title: '发起通话',
      content: '是否通过声网插件在当前会话开启音视频通讯？',
      onConfirm: async () => {
        // startFastMeeting(`${groupId}|${panelId}`);
        startFastMeeting('123456'); // for test
      },
    });
  },
});
