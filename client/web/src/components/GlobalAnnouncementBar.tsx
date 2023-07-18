import { useLocalStorageState } from '@/hooks/useLocalStorage';
import { Button } from 'antd';
import React from 'react';
import { Icon } from 'tailchat-design';
import { t, useGlobalConfigStore } from 'tailchat-shared';

export const GlobalAnnouncementBar: React.FC = React.memo(() => {
  const announcementInfo = useGlobalConfigStore((state) => state.announcement);
  const [ackId, setAckId] = useLocalStorageState('ackGlobalAnnouncement');

  if (!announcementInfo) {
    return null;
  }

  if (ackId === announcementInfo.id) {
    // 如果该公告已读，也不展示
    return null;
  }

  return (
    <div className="text-center bg-indigo-400 text-white relative px-6">
      <span className="select-text">{announcementInfo.text}</span>

      {announcementInfo.link && (
        <Button
          type="link"
          className="text-indigo-700 font-bold ml-2"
          size="small"
          onClick={() => window.open(announcementInfo.link)}
        >
          {t('了解更多')}
        </Button>
      )}

      <Icon
        className="absolute top-0.5 right-1 opacity-80 hover:opacity-100 cursor-pointer text-xl"
        icon="mdi:close-circle-outline"
        onClick={() => setAckId(announcementInfo.id)}
      />
    </div>
  );
});
GlobalAnnouncementBar.displayName = 'GlobalAnnouncementBar';
