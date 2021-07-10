import { Avatar } from '@/components/Avatar';
import { Highlight } from '@/components/Highlight';
import { Button, Divider, Empty } from 'antd';
import {
  searchUserWithUniqueName,
  useAsyncFn,
  UserBaseInfo,
} from 'pawchat-shared';
import React, { useState } from 'react';

const SearchFriendResult: React.FC<{
  result: UserBaseInfo | undefined | null;
}> = React.memo(({ result }) => {
  if (result === undefined) {
    return null;
  }

  if (result === null) {
    return <Empty />;
  }

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

        <Button type="primary" className="bg-green-700 border-0">
          申请好友
        </Button>
      </div>
    </div>
  );
});
SearchFriendResult.displayName = 'SearchFriendResult';

export const AddFriend: React.FC = React.memo(() => {
  const [uniqueName, setUniqueName] = useState('');
  const [{ loading, value }, searchUser] = useAsyncFn(async () => {
    // 搜索用户
    try {
      const data = await searchUserWithUniqueName(uniqueName);

      return data;
    } catch (err) {
      console.error(err);
    }
  }, [uniqueName]);

  return (
    <div className="px-8 py-2">
      <div className="text-lg my-2">添加好友</div>
      <div className="my-1">
        您可以使用完整的 <Highlight>用户昵称#标识</Highlight> 来添加好友
      </div>

      <div className="px-4 my-3 flex border border-black border-opacity-30 rounded items-center">
        <input
          className="bg-transparent flex-1 text-base leading-13 outline-none"
          placeholder="用户昵称#0000"
          onChange={(e) => setUniqueName(e.target.value)}
        />

        <Button
          type="primary"
          className="bg-indigo-600 border-none"
          loading={loading}
          onClick={searchUser}
        >
          查找好友
        </Button>
      </div>

      <SearchFriendResult result={value} />
    </div>
  );
});
AddFriend.displayName = 'AddFriend';
