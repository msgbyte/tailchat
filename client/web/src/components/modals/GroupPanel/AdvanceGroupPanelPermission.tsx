import { PermissionList } from '@/components/PermissionList';
import { Button } from 'antd';
import clsx from 'clsx';
import React, { PropsWithChildren, useState } from 'react';
import {
  ALL_PERMISSION,
  getDefaultPermissionList,
  t,
  useAppSelector,
  useEvent,
  useLazyValue,
} from 'tailchat-shared';
import _isEqual from 'lodash/isEqual';

interface AdvanceGroupPanelPermissionProps {
  height?: number;
  groupId: string;
  panelId: string;
  onChange: (
    permissionMap: Record<string | typeof ALL_PERMISSION, string[]> | undefined
  ) => void;
}

export const AdvanceGroupPanelPermission: React.FC<AdvanceGroupPanelPermissionProps> =
  React.memo((props) => {
    const [selectedRoleId, setSelectedRoleId] = useState<
      typeof ALL_PERMISSION | string
    >(ALL_PERMISSION);

    const roles = useAppSelector((state) => {
      const groupInfo = state.group.groups[props.groupId];
      return groupInfo.roles;
    });

    const permissionMap: Record<string | typeof ALL_PERMISSION, string[]> =
      useAppSelector((state) => {
        const groupInfo = state.group.groups[props.groupId];
        const panelInfo = groupInfo.panels.find((p) => p.id === props.panelId);
        if (!panelInfo) {
          return { [ALL_PERMISSION]: getDefaultPermissionList() };
        } else {
          return {
            [ALL_PERMISSION]:
              panelInfo.fallbackPermissions ?? getDefaultPermissionList(),
            ...panelInfo.permissionMap,
          };
        }
      }, _isEqual);

    const [editPermissionMap, setEditPermissionMap] = useLazyValue(
      permissionMap,
      props.onChange
    );

    const handleUpdatePermissionMap = useEvent((permissions: string[]) => {
      const newMap = { ...editPermissionMap, [selectedRoleId]: permissions };
      setEditPermissionMap(newMap);
    });

    const handleSyncWithGroup = useEvent(() => {
      setEditPermissionMap({
        [ALL_PERMISSION]: getDefaultPermissionList(),
      });
      props.onChange(undefined);
    });

    return (
      <div className="flex" style={{ width: 540 }}>
        <div>
          <RoleItem
            active={selectedRoleId === ALL_PERMISSION}
            onClick={() => setSelectedRoleId(ALL_PERMISSION)}
          >
            {t('所有人')}
          </RoleItem>
          {roles.map((r) => (
            <RoleItem
              key={r._id}
              active={selectedRoleId === r._id}
              onClick={() => setSelectedRoleId(r._id)}
            >
              {r.name}
            </RoleItem>
          ))}
        </div>
        <div className="flex-1 overflow-auto" style={{ height: props.height }}>
          <div className="text-right">
            <Button onClick={handleSyncWithGroup}>{t('与群组配置同步')}</Button>
          </div>
          <PermissionList
            value={editPermissionMap[selectedRoleId] ?? []}
            onChange={handleUpdatePermissionMap}
          />
        </div>
      </div>
    );
  });
AdvanceGroupPanelPermission.displayName = 'AdvanceGroupPanelPermission';

const RoleItem: React.FC<
  PropsWithChildren<{
    active: boolean;
    onClick?: () => void;
  }>
> = React.memo((props) => {
  return (
    <div
      className={clsx(
        'px-2 py-1 rounded cursor-pointer mb-1 hover:bg-black hover:bg-opacity-20',
        {
          'bg-black bg-opacity-20': props.active,
        }
      )}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
});
RoleItem.displayName = 'RoleItem';
