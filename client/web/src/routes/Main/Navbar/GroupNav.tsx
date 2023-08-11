import { Avatar, Icon } from 'tailchat-design';
import { openModal } from '@/components/Modal';
import { ModalCreateGroup } from '@/components/modals/CreateGroup';
import React, { useMemo, useRef } from 'react';
import {
  GroupInfo,
  showSuccessToasts,
  t,
  useAppSelector,
  useEvent,
  useGlobalConfigStore,
  useGroupAck,
  useSingleUserSetting,
} from 'tailchat-shared';
import { NavbarNavItem } from './NavItem';
import { Dropdown } from 'antd';
import { useGroupUnreadState } from '@/hooks/useGroupUnreadState';
import { pluginCustomPanel } from '@/plugin/common';
import { NavbarCustomNavItem } from './CustomNavItem';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';

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

function useGroupList() {
  const groups = useAppSelector((state) => state.group.groups);
  const { value: groupOrderList = [], setValue: setGroupOrderList } =
    useSingleUserSetting('groupOrderList', []);

  const handleSortEnd = useEvent((oldIndex: number, newIndex: number) => {
    setGroupOrderList(
      arrayMove(
        groupList.map((item) => item._id),
        oldIndex,
        newIndex
      )
    );
  });

  const groupList = useMemo(
    () =>
      Object.values(groups).sort((a, b) => {
        const aIndex = groupOrderList.findIndex((item) => item === a._id);
        const bIndex = groupOrderList.findIndex((item) => item === b._id);

        // 两种情况，在排序列表中则按照排序列表排序
        // 不在排序列表中则放在最前面
        return aIndex - bIndex;
      }),
    [groups, groupOrderList]
  );
  return {
    handleSortEnd,
    groupList,
  };
}

export const GroupNav: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { groupList, handleSortEnd } = useGroupList();

  const handleCreateGroup = useEvent(() => {
    openModal(<ModalCreateGroup />);
  });

  const { disableCreateGroup } = useGlobalConfigStore((state) => ({
    disableCreateGroup: state.disableCreateGroup,
  }));

  return (
    <div className="space-y-2" data-tc-role="navbar-groups" ref={containerRef}>
      {Array.isArray(groupList) && (
        <SortableList
          className="space-y-2"
          onSortEnd={handleSortEnd}
          customHolderRef={containerRef}
        >
          {groupList.map((group) => (
            <SortableItem key={group._id}>
              <div className="overflow-hidden">
                <GroupNavItem group={group} />
              </div>
            </SortableItem>
          ))}
        </SortableList>
      )}

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
