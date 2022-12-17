import React, { useCallback } from 'react';
import {
  createDMConverse,
  removeFriend,
  showAlert,
  showErrorToasts,
  showToasts,
  t,
  useAppDispatch,
  useAppSelector,
  useAsyncRequest,
  userActions,
} from 'tailchat-shared';
import { UserListItem } from '@/components/UserListItem';
import { IconBtn } from '@/components/IconBtn';
import { Button, Dropdown, Menu, Tooltip } from 'antd';
import { useNavigate } from 'react-router';
import { Problem } from '@/components/Problem';

/**
 * 好友列表
 */
export const FriendList: React.FC<{
  onSwitchToAddFriend: () => void;
}> = React.memo((props) => {
  const friends = useAppSelector((state) => state.user.friends);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [, handleCreateConverse] = useAsyncRequest(
    async (targetId: string) => {
      const converse = await createDMConverse([targetId]);
      navigate(`/main/personal/converse/${converse._id}`);
    },
    [history]
  );

  const handleRemoveFriend = useCallback(async (targetId: string) => {
    showAlert({
      message: t(
        '是否要从自己的好友列表中删除对方? 注意:你不会从对方的好友列表消失'
      ),
      onConfirm: async () => {
        try {
          await removeFriend(targetId);
          showToasts(t('好友删除成功'), 'success');
          dispatch(userActions.removeFriend(targetId));
        } catch (err) {
          showErrorToasts(err);
        }
      },
    });
  }, []);

  if (friends.length === 0) {
    return (
      <Problem
        text={
          <div>
            <p className="mb-2">{t('暂无好友')}</p>
            <Button type="primary" onClick={props.onSwitchToAddFriend}>
              {t('立即添加')}
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <div className="py-2.5 px-5">
      <div>{t('好友列表')}</div>
      <div>
        {friends.map((friendId) => (
          <UserListItem
            key={friendId}
            userId={friendId}
            actions={[
              <Tooltip key="message" title={t('发送消息')}>
                <div>
                  <IconBtn
                    icon="mdi:message-text-outline"
                    onClick={() => handleCreateConverse(friendId)}
                  />
                </div>
              </Tooltip>,
              <div key="more">
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'delete',
                        danger: true,
                        onClick: () => handleRemoveFriend(friendId),
                        label: t('删除'),
                      },
                    ],
                  }}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <div>
                    <IconBtn icon="mdi:dots-vertical" />
                  </div>
                </Dropdown>
              </div>,
            ]}
          />
        ))}
      </div>
    </div>
  );
});
FriendList.displayName = 'FriendList';
