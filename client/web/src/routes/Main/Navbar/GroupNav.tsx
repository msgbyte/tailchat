import { Avatar, Icon } from 'tailchat-design';
import { openModal } from '@/components/Modal';
import { ModalCreateGroup } from '@/components/modals/CreateGroup';
import React, { useCallback, useMemo } from 'react';
import {
  GroupInfo,
  showSuccessToasts,
  t,
  useAppSelector,
  useGroupAck,
  useGroupUnread,
} from 'tailchat-shared';
import { NavbarNavItem } from './NavItem';
import { Dropdown, Menu } from 'antd';

/**
 * 群组导航栏栏项
 */
const GroupNavItem: React.FC<{ group: GroupInfo }> = React.memo(({ group }) => {
  const groupId = group._id;
  const hasUnread = useGroupUnread(groupId);
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
          badge={hasUnread}
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

  return (
    <div className="space-y-2" data-tc-role="navbar-groups">
      {Array.isArray(groups) &&
        groups.map((group) => (
          <div key={group._id}>
            <GroupNavItem group={group} />
          </div>
        ))}

      {/* 创建群组 */}
      <NavbarNavItem
        className="bg-green-500"
        name={t('创建群组')}
        onClick={handleCreateGroup}
        data-testid="create-group"
      >
        <Icon className="text-3xl text-white" icon="mdi:plus" />
      </NavbarNavItem>
    </div>
  );
});
GroupNav.displayName = 'GroupNav';
