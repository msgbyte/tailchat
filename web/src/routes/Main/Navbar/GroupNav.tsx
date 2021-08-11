import { Avatar } from '@/components/Avatar';
import { openModal } from '@/components/Modal';
import { ModalCreateGroup } from '@/components/modals/CreateGroup';
import { Icon } from '@iconify/react';
import React, { useCallback, useMemo } from 'react';
import { GroupInfo, t, useAppSelector } from 'tailchat-shared';
import { NavbarNavItem } from './NavItem';

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
    <div className="space-y-2">
      {Array.isArray(groups) &&
        groups.map((group) => (
          <div key={group._id}>
            <NavbarNavItem name={group.name} to={`/main/group/${group._id}`}>
              <Avatar
                shape="square"
                size={48}
                name={group.name}
                src={group.avatar}
              />
            </NavbarNavItem>
          </div>
        ))}

      {/* 创建群组 */}
      <NavbarNavItem
        className="bg-green-500"
        name={t('创建群组')}
        onClick={handleCreateGroup}
      >
        <Icon className="text-3xl text-white" icon="mdi-plus" />
      </NavbarNavItem>
    </div>
  );
});
GroupNav.displayName = 'GroupNav';
