import { regPluginPanelAction } from '@capital/common';
import { openConfirmModal } from '@capital/component';
import { startFastMeeting } from './FloatWindow';
import { Translate } from './translate';

console.log('Plugin 声网音视频 is loaded');

// 发起群组会议
regPluginPanelAction({
  name: 'plugin:com.msgbyte.meeting/groupAction',
  label: Translate.startCall,
  position: 'group',
  icon: 'mdi:video-box',
  onClick: ({ groupId, panelId }) => {
    openConfirmModal({
      title: Translate.startCall,
      content: Translate.startCallContent,
      onConfirm: async () => {
        startFastMeeting(`${groupId}|${panelId}`);
      },
    });
  },
});
