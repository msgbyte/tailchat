import { Highlight } from '@/components/Highlight';
import React from 'react';

export const AddFriend: React.FC = React.memo(() => {
  return (
    <div className="px-8 py-2">
      <div className="text-lg my-2">添加好友</div>
      <div className="my-1">
        您可以使用完整的 <Highlight>用户昵称#标识</Highlight> 来添加好友
      </div>

      <div className="px-4 my-3 flex border border-black border-opacity-30 rounded items-center">
        <input
          className="bg-transparent flex-1 text-base leading-13 outline-none"
          placeholder="用户名#0000"
        />

        <div className="h-8 bg-indigo-600 text-white px-4 py-0.5 cursor-pointer rounded flex items-center">
          <div>查找好友</div>
        </div>
      </div>
    </div>
  );
});
AddFriend.displayName = 'AddFriend';
