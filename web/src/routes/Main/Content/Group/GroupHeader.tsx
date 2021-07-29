import React from 'react';
import { Menu } from 'antd';
import _isNil from 'lodash/isNil';
// import { useGroupHeaderAction } from './useGroupHeaderAction';
import { useGroupInfo, useTranslation } from 'tailchat-shared';
import { SectionHeader } from '@/components/SectionHeader';

interface GroupHeaderProps {
  groupId: string;
}
export const GroupHeader: React.FC<GroupHeaderProps> = React.memo((props) => {
  const { groupId } = props;
  const groupInfo = useGroupInfo(groupId);
  const { t } = useTranslation();

  // const {
  //   handleShowGroupInfo,
  //   handleShowInvite,
  //   handleCreateGroupPanel,
  //   handleQuitGroup,
  // } = useGroupHeaderAction(groupInfo!);

  if (_isNil(groupInfo)) {
    return null;
  }

  const menu = (
    <Menu>
      {/* TODO */}
      <Menu.Item key="0" onClick={() => console.log('查看详情')}>
        {t('查看详情')}
      </Menu.Item>
      <Menu.Item key="1" onClick={() => console.log('邀请用户')}>
        {t('邀请用户')}
      </Menu.Item>
    </Menu>
  );

  return <SectionHeader menu={menu}>{groupInfo?.name}</SectionHeader>;
});
GroupHeader.displayName = 'GroupHeader';
