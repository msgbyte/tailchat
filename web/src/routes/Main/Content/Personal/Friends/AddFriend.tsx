import { Avatar } from '@/components/Avatar';
import { Highlight } from '@/components/Highlight';
import { Button, Divider, Empty, Typography } from 'antd';
import {
  addFriendRequest,
  searchUserWithUniqueName,
  showErrorToasts,
  showToasts,
  t,
  useAppSelector,
  useAsyncFn,
  UserBaseInfo,
} from 'tailchat-shared';
import React, { useCallback, useState } from 'react';
import _isNil from 'lodash/isNil';

const SearchFriendResult: React.FC<{
  result: UserBaseInfo | undefined | null;
}> = React.memo(({ result }) => {
  const [hasSentUserId, setHasSentUserId] = useState(''); // 记录已发送的
  const handleAddFriend = useCallback(async (userId: string) => {
    try {
      await addFriendRequest(userId);
      setHasSentUserId(userId);
      showToasts(t('已发送申请'), 'success');
    } catch (err) {
      showErrorToasts(err);
    }
  }, []);

  if (result === undefined) {
    return null;
  }

  if (result === null) {
    return <Empty />;
  }

  const hasSent = hasSentUserId === result._id;

  return (
    <div>
      <Divider />

      <div className="rounded-md border border-black border-opacity-30 px-4 py-3 bg-black bg-opacity-10 flex justify-between items-center">
        <div>
          <Avatar
            className="mb-3"
            size={60}
            name={result.nickname}
            src={result.avatar}
          />
          <div className="text-lg">
            {result.nickname}
            <span className="text-opacity-60 text-sm text-white">
              #{result.discriminator}
            </span>
          </div>
        </div>

        <Button
          type="primary"
          className="bg-green-600 border-0"
          disabled={hasSent}
          onClick={() => handleAddFriend(result._id)}
        >
          {hasSent ? t('已申请') : t('申请好友')}
        </Button>
      </div>
    </div>
  );
});
SearchFriendResult.displayName = 'SearchFriendResult';

const SelfIdentify: React.FC = React.memo(() => {
  const userInfo = useAppSelector((state) => state.user.info);
  const uniqueName = `${userInfo?.nickname}#${userInfo?.discriminator}`;

  return (
    <div>
      <Divider />

      <div className="rounded-md border border-black border-opacity-30 px-4 py-3 bg-black bg-opacity-10 text-center">
        <div>您的个人唯一标识</div>
        <Typography.Title level={4} copyable={true}>
          {uniqueName}
        </Typography.Title>
      </div>
    </div>
  );
});
SelfIdentify.displayName = 'SelfIdentify';

export const AddFriend: React.FC = React.memo(() => {
  const [uniqueName, setUniqueName] = useState('');
  const [{ loading, value }, searchUser] = useAsyncFn(async () => {
    // 搜索用户
    try {
      const data = await searchUserWithUniqueName(uniqueName);

      return data;
    } catch (err) {
      showErrorToasts(err);
    }
  }, [uniqueName]);

  return (
    <div className="px-8 py-2">
      <div className="text-lg my-2">添加好友</div>
      <div className="my-1">
        您可以使用完整的 <Highlight>用户昵称#标识</Highlight> 来添加好友
      </div>

      <div className="px-4 my-3 flex border border-black border-opacity-30 rounded items-center bg-black bg-opacity-10">
        <input
          className="bg-transparent flex-1 text-base leading-13 outline-none"
          placeholder="用户昵称#0000"
          onChange={(e) => setUniqueName(e.target.value)}
        />

        <Button
          type="primary"
          className="bg-indigo-600 disabled:opacity-80 border-none"
          disabled={uniqueName === ''}
          loading={loading}
          onClick={searchUser}
        >
          查找好友
        </Button>
      </div>

      {_isNil(value) ? <SelfIdentify /> : <SearchFriendResult result={value} />}
    </div>
  );
});
AddFriend.displayName = 'AddFriend';
