import { FullModal } from '@/components/FullModal';
import { SidebarView, SidebarViewMenuType } from '@/components/SidebarView';
import React, { useCallback, useMemo } from 'react';
import { t } from 'tailchat-shared';
import { GroupPanel } from './Panel';
import { GroupSummary } from './Summary';

interface SettingsViewProps {
  groupId: string;
  onClose: () => void;
}
export const GroupDetail: React.FC<SettingsViewProps> = React.memo((props) => {
  const handleChangeVisible = useCallback(
    (visible) => {
      if (visible === false && typeof props.onClose === 'function') {
        props.onClose();
      }
    },
    [props.onClose]
  );

  const menu: SidebarViewMenuType[] = useMemo(
    () => [
      {
        type: 'group',
        title: t('通用'),
        children: [
          {
            type: 'item',
            title: t('概述'),
            content: <GroupSummary groupId={props.groupId} />,
          },
          {
            type: 'item',
            title: t('面板'),
            content: <GroupPanel groupId={props.groupId} />,
          },
        ],
      },
    ],
    []
  );

  return (
    <FullModal onChangeVisible={handleChangeVisible}>
      <SidebarView menu={menu} defaultContentPath="0.children.0.content" />
    </FullModal>
  );
});
GroupDetail.displayName = 'GroupDetail';
