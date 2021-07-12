import React from 'react';
import { PillTabPane, PillTabs } from '@/components/PillTabs';
import { AddFriend } from './AddFriend';
import { t, useAppSelector } from 'pawchat-shared';
import { RequestSend } from './RequestSend';
import { RequestReceived } from './RequestReceived';

/**
 * 主要内容组件
 */
export const FriendPanel: React.FC = React.memo(() => {
  const friends = useAppSelector((state) => state.user.friends);
  const friendRequests = useAppSelector((state) => state.user.friendRequests);
  const userId = useAppSelector((state) => state.user.info?._id);

  return (
    <div className="w-full">
      <PillTabs>
        <PillTabPane tab={'全部'} key="1">
          <div className="py-2.5 px-5">
            <div>好友列表</div>
            <div>{JSON.stringify(friends)}</div>
          </div>
        </PillTabPane>
        <PillTabPane tab={t('已发送')} key="2">
          <RequestSend
            requests={friendRequests.filter((item) => item.from === userId)}
          />
        </PillTabPane>
        <PillTabPane tab={t('待处理')} key="3">
          <RequestReceived
            requests={friendRequests.filter((item) => item.to === userId)}
          />
        </PillTabPane>
        <PillTabPane
          tab={<span className="text-green-400">添加好友</span>}
          key="4"
        >
          <AddFriend />
        </PillTabPane>
      </PillTabs>
    </div>
  );
});
FriendPanel.displayName = 'FriendPanel';
