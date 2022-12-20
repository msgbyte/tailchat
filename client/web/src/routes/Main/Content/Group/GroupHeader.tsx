import React from 'react';
import type { MenuProps } from 'antd';
import _isNil from 'lodash/isNil';
import _compact from 'lodash/compact';
import {
  PERMISSION,
  useGroupInfo,
  useHasGroupPermission,
  useTranslation,
} from 'tailchat-shared';
import { SectionHeader } from '@/components/SectionHeader';
import { useGroupHeaderAction } from './useGroupHeaderAction';

interface GroupHeaderProps {
  groupId: string;
}
export const GroupHeader: React.FC<GroupHeaderProps> = React.memo((props) => {
  const { groupId } = props;
  const groupInfo = useGroupInfo(groupId);
  const { t } = useTranslation();
  const [showGroupDetail, showInvite] = useHasGroupPermission(groupId, [
    PERMISSION.core.groupDetail,
    PERMISSION.core.invite,
  ]);

  const { handleShowGroupDetail, handleInviteUser, handleQuitGroup } =
    useGroupHeaderAction(groupId);

  if (_isNil(groupInfo)) {
    return null;
  }

  const menu: MenuProps = {
    items: _compact([
      showGroupDetail && {
        key: '0',
        label: t('查看详情'),
        onClick: handleShowGroupDetail,
      },
      showInvite && {
        key: '1',
        label: t('邀请用户'),
        onClick: handleInviteUser,
      },
      {
        key: '2',
        label: t('退出群组'),
        danger: true,
        onClick: handleQuitGroup,
      },
    ] as MenuProps['items']),
  };

  return (
    <SectionHeader menu={menu} data-testid="group-header">
      {groupInfo?.name}
    </SectionHeader>
  );
});
GroupHeader.displayName = 'GroupHeader';
