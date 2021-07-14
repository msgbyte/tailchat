import React, { useCallback } from 'react';
import { createDMConverse, t, useAppSelector } from 'pawchat-shared';
import { UserListItem } from '@/components/UserListItem';
import { IconBtn } from '@/components/IconBtn';
import { Tooltip } from 'antd';
import { useHistory } from 'react-router';

/**
 * 好友列表
 */
export const FriendList: React.FC = React.memo(() => {
  const friends = useAppSelector((state) => state.user.friends);
  const history = useHistory();

  const handleCreateConverse = useCallback(
    (targetId: string) => {
      createDMConverse(targetId).then((converse) => {
        history.push(`/main/personal/converse/${converse._id}`);
      });
    },
    [history]
  );

  return (
    <div className="py-2.5 px-5">
      <div>好友列表</div>
      <div>
        {friends.map((friendId) => (
          <UserListItem
            key={friendId}
            userId={friendId}
            actions={[
              <Tooltip key="message" title={t('发送消息')}>
                <div>
                  <IconBtn
                    icon="mdi-message-text-outline"
                    onClick={() => handleCreateConverse(friendId)}
                  />
                </div>
              </Tooltip>,
            ]}
          />
        ))}
      </div>
    </div>
  );
});
FriendList.displayName = 'FriendList';
