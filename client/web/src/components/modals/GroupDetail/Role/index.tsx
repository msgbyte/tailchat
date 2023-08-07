import { Loading } from '@/components/Loading';
import { PillTabs } from '@/components/PillTabs';
import { AllPermission } from 'tailchat-shared';
import React, { useMemo, useState } from 'react';
import { t, useGroupInfo } from 'tailchat-shared';
import { RoleItem } from './RoleItem';
import { useRoleActions } from './useRoleActions';
import { RoleSummary } from './tabs/summary';
import { RolePermission } from './tabs/permission';
import { RoleMember } from './tabs/member';

interface GroupPermissionProps {
  groupId: string;
}
export const GroupRole: React.FC<GroupPermissionProps> = React.memo((props) => {
  const { groupId } = props;
  const [roleId, setRoleId] = useState<typeof AllPermission | string>(
    AllPermission
  );
  const groupInfo = useGroupInfo(groupId);
  const roles = groupInfo?.roles ?? [];

  const currentRoleInfo = useMemo(
    () => roles.find((r) => r._id === roleId),
    [roles, roleId]
  );

  const {
    loading,
    handleCreateRole,
    handleSavePermission,
    handleChangeRoleName,
    handleDeleteRole,
  } = useRoleActions(groupId, roleId);

  return (
    <Loading spinning={loading} className="h-full">
      <div className="flex h-full">
        <div className="pr-2 mr-2 w-40 mobile:w-28 border-r border-white border-opacity-20">
          {/* 角色列表 */}
          <RoleItem
            active={roleId === AllPermission}
            onClick={() => setRoleId(AllPermission)}
          >
            {t('所有人')}
          </RoleItem>

          {roles.map((r) => (
            <RoleItem
              key={r._id}
              active={roleId === r._id}
              onClick={() => setRoleId(r._id)}
            >
              {r.name}
            </RoleItem>
          ))}

          <RoleItem active={false} onClick={handleCreateRole}>
            {t('添加角色')}
          </RoleItem>
        </div>

        <div className="flex-1 overflow-y-auto">
          <PillTabs
            defaultActiveKey="permission"
            items={[
              {
                key: 'summary',
                label: t('概述'),
                disabled: roleId === AllPermission,
                children: (
                  <>
                    {currentRoleInfo && (
                      <RoleSummary
                        currentRoleInfo={currentRoleInfo}
                        onChangeRoleName={handleChangeRoleName}
                        onDeleteRole={async () => {
                          await handleDeleteRole();
                          setRoleId(AllPermission); // 删除身份组后切换到所有人
                        }}
                      />
                    )}
                  </>
                ),
              },
              {
                key: 'permission',
                label: t('权限'),
                children: (
                  <RolePermission
                    roleId={roleId}
                    fallbackPermissions={groupInfo?.fallbackPermissions ?? []}
                    currentRoleInfo={currentRoleInfo}
                    onSavePermission={handleSavePermission}
                  />
                ),
              },
              {
                key: 'member',
                label: t('管理成员'),
                disabled: roleId === AllPermission,
                children: (
                  <>
                    {currentRoleInfo && (
                      <RoleMember
                        groupId={groupId}
                        currentRoleInfo={currentRoleInfo}
                      />
                    )}
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>
    </Loading>
  );
});
GroupRole.displayName = 'GroupRole';
