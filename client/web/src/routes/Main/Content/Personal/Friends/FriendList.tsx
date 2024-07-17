import React, { useCallback, useMemo, useState } from 'react';
import {
  createDMConverse,
  isValidStr,
  removeFriend,
  showAlert,
  showErrorToasts,
  showToasts,
  t,
  useAppDispatch,
  useAppSelector,
  useAsyncRequest,
  useEvent,
  useGlobalConfigStore,
  useUserInfoList,
  useUserSearch,
  userActions,
} from 'tailchat-shared';
import { UserListItem } from '@/components/UserListItem';
import { IconBtn } from '@/components/IconBtn';
import { Button, Dropdown, Input, Tooltip } from 'antd';
import { useNavigate } from 'react-router';
import { Problem } from '@/components/Problem';
import { closeModal, openModal } from '@/components/Modal';
import { SetFriendNickname } from '@/components/modals/SetFriendNickname';
import { Icon } from 'tailchat-design';
import { Virtuoso } from 'react-virtuoso';

/**
 * 好友列表
 */
export const FriendList: React.FC<{
  onSwitchToAddFriend: () => void;
}> = React.memo((props) => {
  const friends = useAppSelector((state) => state.user.friends);
  const friendIds = useMemo(() => friends.map((f) => f.id), [friends]);
  const userInfos = useUserInfoList(friendIds);
  const { searchText, setSearchText, searchResult } = useUserSearch(userInfos);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const disableAddFriend = useGlobalConfigStore(
    (state) => state.disableAddFriend
  );

  const [, handleCreateConverse] = useAsyncRequest(
    async (targetId: string) => {
      const converse = await createDMConverse([targetId]);
      navigate(`/main/personal/converse/${converse._id}`);
    },
    [navigate]
  );

  const handleSetFriendNickname = useEvent(async (userId: string) => {
    const key = openModal(
      <SetFriendNickname
        userId={userId}
        onSuccess={() => {
          closeModal(key);
        }}
      />
    );
  });

  const handleRemoveFriend = useEvent(async (targetId: string) => {
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
  });

  if (friends.length === 0) {
    return (
      <Problem
        text={
          <div>
            <p className="mb-2">{t('暂无好友')}</p>
            {!disableAddFriend && (
              <Button type="primary" onClick={props.onSwitchToAddFriend}>
                {t('立即添加')}
              </Button>
            )}
          </div>
        }
      />
    );
  }

  return (
    <div className="py-2.5 px-5 h-full flex flex-col">
      <div>{t('好友列表')}</div>

      <Input
        className="my-2"
        placeholder={t('搜索好友')}
        size="large"
        prefix={<Icon fontSize={20} color="grey" icon="mdi:magnify" />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <div className="flex-1">
        <Virtuoso
          className="h-full"
          data={searchResult}
          itemContent={(index, item) => (
            <UserListItem
              key={item._id}
              userId={item._id}
              actions={[
                <Tooltip key="message" title={t('发送消息')}>
                  <div>
                    <IconBtn
                      icon="mdi:message-text-outline"
                      onClick={() => handleCreateConverse(item._id)}
                    />
                  </div>
                </Tooltip>,
                <div key="more">
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'setNickname',
                          onClick: () => handleSetFriendNickname(item._id),
                          label: isValidStr(item.nickname)
                            ? t('更改好友昵称')
                            : t('添加好友昵称'),
                        },
                        {
                          key: 'delete',
                          danger: true,
                          onClick: () => handleRemoveFriend(item._id),
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
          )}
        />
      </div>
    </div>
  );
});
FriendList.displayName = 'FriendList';
