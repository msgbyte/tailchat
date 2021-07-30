import { Button, Divider, Input, Typography } from 'antd';
import React, { useCallback, useState } from 'react';
import {
  createGroupInviteCode,
  useAsyncFn,
  useGroupInfo,
} from 'tailchat-shared';
import { isValidStr } from '../../../../shared/utils/string-helper';
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

  const [{ loading }, handleCreateInviteLink] = useAsyncFn(async () => {
    console.log('handleCreateInviteLink');
    const invite = await createGroupInviteCode(groupId);
    setInviteLink(`${location.origin}/invite/${invite.code}`);
  }, [groupId]);

  if (!groupInfo) {
    return <div>异常</div>;
  }

  return (
    <ModalWrapper style={{ width: '440px' }}>
      {/* <div>邀请好友加入群组 {groupInfo.name}</div>

      <div>
        <Input.Search
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onSearch={handleSearch}
        />
      </div>

      <Divider>或者创建链接并发送给外部好友</Divider> */}

      <div>创建链接并发送给外部好友</div>

      <div>
        {isValidStr(inviteLink) ? (
          <Typography.Text copyable={true} className="select-text">
            {inviteLink}
          </Typography.Text>
        ) : (
          <Button loading={loading} onClick={handleCreateInviteLink}>
            创建链接
          </Button>
        )}
      </div>
    </ModalWrapper>
  );
});
GroupInvite.displayName = 'GroupInvite';
