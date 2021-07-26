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
      {/* <Menu.Item onClick={handleShowGroupInfo}>{t('查看详情')}</Menu.Item> */}
      {/* {isGroupManager && (
        <Menu.Item onClick={handleShowInvite}>{t('邀请成员')}</Menu.Item>
      )}
      {isGroupManager && (
        <Menu.Item onClick={handleCreateGroupPanel}>{t('创建面板')}</Menu.Item>
      )}
      <Menu.Item danger={true} onClick={handleQuitGroup}>
        {currentUserUUID === groupInfo.owner_uuid ? t('解散团') : t('退出团')}
      </Menu.Item> */}
    </Menu>
  );

  return <SectionHeader menu={menu}>{groupInfo?.name}</SectionHeader>;
});
GroupHeader.displayName = 'GroupHeader';
