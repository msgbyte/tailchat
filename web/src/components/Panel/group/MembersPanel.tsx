import { Icon } from '@/components/Icon';
import { UserListItem } from '@/components/UserListItem';
import { Input, Skeleton } from 'antd';
import React, { useMemo, useState } from 'react';
import { t, useGroupInfo } from 'tailchat-shared';
import { useUserInfoList } from 'tailchat-shared/hooks/model/useUserInfoList';

interface MembersPanelProps {
  groupId: string;
}

/**
 * 用户面板
 */
export const MembersPanel: React.FC<MembersPanelProps> = React.memo((props) => {
  const groupInfo = useGroupInfo(props.groupId);
  const members = groupInfo?.members ?? [];
  const userInfoList = useUserInfoList(members.map((m) => m.userId));
  const [searchStr, setSearchStr] = useState('');

  const filteredGroupMembers = useMemo(() => {
    return userInfoList.filter((u) => u.nickname.includes(searchStr));
  }, [userInfoList, searchStr]);

  if (userInfoList.length === 0) {
    return <Skeleton />;
  }

  return (
    <div>
      <div className="p-2">
        <Input
          placeholder={t('搜索成员')}
          size="large"
          suffix={<Icon fontSize={20} color="grey" icon="mdi:magnify" />}
          onChange={(e) => setSearchStr(e.target.value)}
        />
      </div>

      {filteredGroupMembers.map((member) => (
        <UserListItem key={member._id} userId={member._id} />
      ))}
    </div>
  );
});
MembersPanel.displayName = 'MembersPanel';
