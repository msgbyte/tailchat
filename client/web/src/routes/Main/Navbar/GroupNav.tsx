import { Avatar, Icon } from 'tailchat-design';
import { openModal } from '@/components/Modal';
import { ModalCreateGroup } from '@/components/modals/CreateGroup';
import React, { useCallback, useMemo } from 'react';
import {
  GroupInfo,
  showSuccessToasts,
  t,
  useAppSelector,
  useGlobalConfigStore,
  useGroupAck,
} from 'tailchat-shared';
import { NavbarNavItem } from './NavItem';
import { Dropdown } from 'antd';
import { useGroupUnreadState } from '@/hooks/useGroupUnreadState';
import { pluginCustomPanel } from '@/plugin/common';
import { NavbarCustomNavItem } from './CustomNavItem';

/**
 * 群组导航栏栏项
 */
const GroupNavItem: React.FC<{ group: GroupInfo }> = React.memo(({ group }) => {
  const groupId = group._id;
  const unreadState = useGroupUnreadState(groupId);
  const { markGroupAllAck } = useGroupAck(groupId);

  const menu = {
    items: [
      {
        key: 'ack',
        label: t('标记为已读'),
        icon: <Icon icon="mdi:message-badge-outline" />,
        onClick: () => {
          markGroupAllAck();
          showSuccessToasts(t('已标记该群组所有消息已读'));
        },
      },
    ],
  };

  return (
    <Dropdown menu={menu} trigger={['contextMenu']}>
      <div>
        <NavbarNavItem
          name={group.name}
          to={`/main/group/${group._id}`}
          showPill={true}
          badge={['muted', 'unread'].includes(unreadState)}
          badgeProps={{
            status: unreadState === 'unread' ? 'error' : 'default',
          }}
        >
          <Avatar
            shape="square"
            size={48}
            name={group.name}
            src={group.avatar}
          />
        </NavbarNavItem>
      </div>
    </Dropdown>
  );
});
GroupNavItem.displayName = 'GroupNavItem';

function useGroups(): GroupInfo[] {
  const groups = useAppSelector((state) => state.group.groups);
  return useMemo(
    () => Object.entries(groups).map(([_, group]) => group),
    [groups]
  );
}

export const GroupNav: React.FC = React.memo(() => {
  const groups = useGroups();

  const handleCreateGroup = useCallback(() => {
    openModal(<ModalCreateGroup />);
  }, []);

  const { disableCreateGroup } = useGlobalConfigStore((state) => ({
    disableCreateGroup: state.disableCreateGroup,
  }));

  return (
    <div className="space-y-2" data-tc-role="navbar-groups">
      {Array.isArray(groups) &&
        groups.map((group) => (
          <div key={group._id}>
            <GroupNavItem group={group} />
          </div>
        ))}

      {!disableCreateGroup && (
        <NavbarNavItem
          className="bg-green-500"
          name={t('创建群组')}
          onClick={handleCreateGroup}
          data-testid="create-group"
        >
          <Icon className="text-3xl text-white" icon="mdi:plus" />
        </NavbarNavItem>
      )}

      {pluginCustomPanel
        .filter((p) => p.position === 'navbar-group')
        .map((p) => (
          <NavbarCustomNavItem key={p.name} panelInfo={p} withBg={true} />
        ))}
    </div>
  );
});
GroupNav.displayName = 'GroupNav';
