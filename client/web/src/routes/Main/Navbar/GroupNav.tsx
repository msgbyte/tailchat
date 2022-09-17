import { Avatar, Icon } from 'tailchat-design';
import { openModal } from '@/components/Modal';
import { ModalCreateGroup } from '@/components/modals/CreateGroup';
import React, { useCallback, useMemo } from 'react';
import { GroupInfo, t, useAppSelector, useGroupUnread } from 'tailchat-shared';
import { NavbarNavItem } from './NavItem';

const GroupNavItem: React.FC<{ group: GroupInfo }> = React.memo(({ group }) => {
  const hasUnread = useGroupUnread(group._id);

  return (
    <NavbarNavItem
      name={group.name}
      to={`/main/group/${group._id}`}
      showPill={true}
      badge={hasUnread}
    >
      <Avatar shape="square" size={48} name={group.name} src={group.avatar} />
    </NavbarNavItem>
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
