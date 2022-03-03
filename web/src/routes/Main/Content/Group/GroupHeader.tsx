import React from 'react';
import { Menu } from 'antd';
import _isNil from 'lodash/isNil';
// import { useGroupHeaderAction } from './useGroupHeaderAction';
import { useGroupInfo, useTranslation } from 'tailchat-shared';
import { SectionHeader } from '@/components/SectionHeader';
import { useGroupHeaderAction } from './useGroupHeaderAction';

interface GroupHeaderProps {
  groupId: string;
}
export const GroupHeader: React.FC<GroupHeaderProps> = React.memo((props) => {
  const { groupId } = props;
  const groupInfo = useGroupInfo(groupId);
  const { t } = useTranslation();

  const { isOwner, handleShowGroupDetail, handleInviteUser, handleQuitGroup } =
    useGroupHeaderAction(groupId);

  if (_isNil(groupInfo)) {
    return null;
  }

  const menu = (
    <Menu>
      {isOwner && (
        <Menu.Item key="0" onClick={handleShowGroupDetail}>
          {t('查看详情')}
        </Menu.Item>
      )}

      {isOwner && (
        <Menu.Item key="1" onClick={handleInviteUser}>
          {t('邀请用户')}
        </Menu.Item>
      )}

      <Menu.Item key="2" danger={true} onClick={handleQuitGroup}>
        {t('退出群组')}
      </Menu.Item>
    </Menu>
  );

  return (
    <SectionHeader menu={menu} data-testid="group-header">
      {groupInfo?.name}
    </SectionHeader>
  );
});
GroupHeader.displayName = 'GroupHeader';
