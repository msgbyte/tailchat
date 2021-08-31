import { Icon } from '@iconify/react';
import { Button, Typography } from 'antd';
import React, { useState } from 'react';
import {
  createGroupInviteCode,
  useAsyncRequest,
  useGroupInfo,
  isValidStr,
} from 'tailchat-shared';
import { ModalWrapper } from '../Modal';

/**
 * 群组邀请
 */

interface GroupInviteProps {
  groupId: string;
}
export const GroupInvite: React.FC<GroupInviteProps> = React.memo((props) => {
  const groupId = props.groupId;
  const groupInfo = useGroupInfo(groupId);
  // const [searchName, setSearchName] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  // const handleSearch = useCallback(() => {
  //   console.log('searchName', searchName);
  // }, []);

  const [{ loading }, handleCreateInviteLink] = useAsyncRequest(async () => {
    const invite = await createGroupInviteCode(groupId);
    setInviteLink(`${location.origin}/invite/${invite.code}`);
  }, [groupId]);

  if (!groupInfo) {
    return <div>异常</div>;
  }

  return (
    <ModalWrapper>
      {/* <div>邀请好友加入群组 {groupInfo.name}</div>

      <div>
        <Input.Search
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onSearch={handleSearch}
        />
      </div>

      <Divider>或者创建链接并发送给外部好友</Divider> */}

      <Icon
        className="text-6xl block m-auto opacity-30 mb-4 mt-2"
        icon="mdi:email-edit-outline"
      />

      <div className="text-gray-400 font-bold text-lg mb-2">
        创建链接并发送给外部好友
      </div>

      <div>
        {isValidStr(inviteLink) ? (
          <div>
            <Typography.Title
              className="bg-black bg-opacity-30 px-2 py-1 select-text text-lg rounded border border-black border-opacity-20"
              level={4}
              copyable={true}
            >
              {inviteLink}
            </Typography.Title>
            <p className="text-gray-500 text-sm">该邀请链接将会于7天后过期</p>
          </div>
        ) : (
          <Button
            block={true}
            size="large"
            type="primary"
            loading={loading}
            onClick={handleCreateInviteLink}
          >
            创建链接
          </Button>
        )}
      </div>
    </ModalWrapper>
  );
});
GroupInvite.displayName = 'GroupInvite';
