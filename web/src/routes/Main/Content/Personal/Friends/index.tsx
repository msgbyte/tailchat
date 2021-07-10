import React from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { PillTabPane, PillTabs } from '@/components/PillTabs';

/**
 * 主要内容组件
 */
export const FriendPanel: React.FC = React.memo(() => {
  const friends = useAppSelector((state) => state.user.friends);
  const friendRequests = useAppSelector((state) => state.user.friendRequests);
  const userId = useAppSelector((state) => state.user.info?._id);

  return (
    <PillTabs>
      <PillTabPane tab={'全部'} key="1">
        <div className="py-2.5 px-5">
          <div>好友列表</div>
          <div>{JSON.stringify(friends)}</div>
        </div>
      </PillTabPane>
      <PillTabPane tab={'已发送'} key="2">
        <div className="py-2.5 px-5">
          <div>发送的好友请求</div>
          <div>
            {JSON.stringify(
              friendRequests.filter((item) => item.from === userId)
            )}
          </div>
        </div>
      </PillTabPane>
      <PillTabPane tab={'待处理'} key="3">
        <div className="py-2.5 px-5">
          <div>接受的好友请求</div>
          <div>
            {JSON.stringify(
              friendRequests.filter((item) => item.to === userId)
            )}
          </div>
        </div>
      </PillTabPane>
      <PillTabPane
        tab={<span className="text-green-400">添加好友</span>}
        key="4"
      >
        添加好友
      </PillTabPane>
    </PillTabs>
  );
});
FriendPanel.displayName = 'FriendPanel';
