import React, { useCallback, useState } from 'react';
import { PillTabPane, PillTabs } from '@/components/PillTabs';
import { AddFriend } from './AddFriend';
import { t, useAppSelector } from 'tailchat-shared';
import { RequestSend } from './RequestSend';
import { RequestReceived } from './RequestReceived';
import { FriendList } from './FriendList';
import { Badge } from 'antd';

/**
 * 主要内容组件
 */
export const FriendPanel: React.FC = React.memo(() => {
  const friendRequests = useAppSelector((state) => state.user.friendRequests);
  const userId = useAppSelector((state) => state.user.info?._id);
  const [activeKey, setActiveKey] = useState('1');

  const send = friendRequests.filter((item) => item.from === userId);
  const received = friendRequests.filter((item) => item.to === userId);

  const handleSwitchToAddFriend = useCallback(() => {
    setActiveKey('add');
  }, []);

  return (
    <div className="w-full">
      <PillTabs activeKey={activeKey} onChange={setActiveKey}>
        <PillTabPane tab={t('全部')} key="1">
          <FriendList onSwitchToAddFriend={handleSwitchToAddFriend} />
        </PillTabPane>
        <PillTabPane
          tab={
            <Badge
              className="text-black dark:text-white"
              size="small"
              count={send.length}
            >
              {t('已发送')}
            </Badge>
          }
          key="2"
        >
          <RequestSend requests={send} />
        </PillTabPane>
        <PillTabPane
          tab={
            <Badge
              className="text-black dark:text-white"
              size="small"
              count={received.length}
            >
              {t('待处理')}
            </Badge>
          }
          key="3"
        >
          <RequestReceived requests={received} />
        </PillTabPane>
        <PillTabPane
          tab={<span className="text-green-400">{t('添加好友')}</span>}
          key="add"
        >
          <AddFriend />
        </PillTabPane>
      </PillTabs>
    </div>
  );
});
FriendPanel.displayName = 'FriendPanel';
