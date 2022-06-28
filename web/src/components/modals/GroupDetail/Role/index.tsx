import {
  DefaultFullModalInputEditorRender,
  FullModalField,
} from '@/components/FullModal/Field';
import { IconBtn } from '@/components/IconBtn';
import { Loading } from '@/components/Loading';
import { PillTabPane, PillTabs } from '@/components/PillTabs';
import { UserListItem } from '@/components/UserListItem';
import { AllPermission, permissionList } from '@/utils/role-helper';
import { Button, Input } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { Icon } from 'tailchat-design';
import { t, useGroupInfo, useSearch, useUserInfoList } from 'tailchat-shared';
import { PermissionItem } from './PermissionItem';
import { RoleItem } from './RoleItem';
import { useModifyPermission } from './useModifyPermission';
import { useRoleActions } from './useRoleActions';

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
  const members = (groupInfo?.members ?? []).filter((m) => m.role === roleId);
  const userInfoList = useUserInfoList(members.map((m) => m.userId));
  const {
    searchText,
    setSearchText,
    isSearching,
    searchResult: filterMembers,
  } = useSearch({
    dataSource: userInfoList,
    filterFn: (item, searchText) => item.nickname.includes(searchText),
  });
  const currentRoleInfo = useMemo(
    () => roles.find((r) => r._id === roleId),
    [roles, roleId]
  );
  const currentRolePermissions: string[] = useMemo(() => {
    if (roleId === AllPermission) {
      return groupInfo?.fallbackPermissions ?? [];
    }

    return currentRoleInfo?.permissions ?? [];
  }, [roleId, currentRoleInfo, groupInfo]);

  const {
    loading,
    handleCreateRole,
    handleSavePermission,
    handleChangeRoleName,
  } = useRoleActions(groupId, roleId);

  const {
    isEditing,
    editingPermission,
    setEditingPermission,
    handleSwitchPermission,
  } = useModifyPermission(currentRolePermissions);

  const handleAddMember = useCallback(() => {}, []);

  const handleResetPermission = useCallback(() => {
    setEditingPermission(
      permissionList.filter((p) => p.default === true).map((p) => p.key)
    );
  }, []);

  return (
    <Loading spinning={loading}>
      <div className="flex h-full">
        <div className="pr-2 mr-2 w-40 border-r border-white border-opacity-20">
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
          <PillTabs defaultActiveKey="permission">
            <PillTabPane
              key="summary"
              tab={t('概述')}
              disabled={roleId === AllPermission}
            >
              {/* 权限概述 */}
              {currentRoleInfo && (
                <div className="px-2">
                  <FullModalField
                    title={t('角色名称')}
                    value={currentRoleInfo.name}
                    editable={true}
                    renderEditor={DefaultFullModalInputEditorRender}
                    onSave={handleChangeRoleName}
                  />
                </div>
              )}
            </PillTabPane>
            <PillTabPane key="permission" tab={t('权限')}>
              <div className="mb-2 space-x-2 text-right">
                <Button onClick={handleResetPermission}>
                  {t('重置为默认值')}
                </Button>
                <Button
                  type="primary"
                  disabled={!isEditing}
                  onClick={() => handleSavePermission(editingPermission)}
                >
                  {t('保存')}
                </Button>
              </div>

              {/* 权限详情 */}
              {permissionList.map((p) => (
                <PermissionItem
                  key={p.key}
                  title={p.title}
                  desc={p.desc}
                  checked={editingPermission.includes(p.key)}
                  onChange={(checked) => handleSwitchPermission(p.key, checked)}
                />
              ))}
            </PillTabPane>
            <PillTabPane
              key="member"
              tab={t('管理成员')}
              disabled={roleId === AllPermission}
            >
              {/* 管理成员 */}
              <div className="text-right mb-2 flex space-x-1">
                <Input
                  placeholder={t('搜索成员')}
                  size="middle"
                  suffix={
                    <Icon fontSize={20} color="grey" icon="mdi:magnify" />
                  }
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />

                <Button type="primary" onClick={handleAddMember}>
                  {t('添加成员')}
                </Button>
              </div>

              {(isSearching ? filterMembers : userInfoList).map((m) => (
                <UserListItem
                  key={m._id}
                  userId={m._id}
                  actions={[<IconBtn key="remove" icon="mdi:close" />]}
                />
              ))}
            </PillTabPane>
          </PillTabs>
        </div>
      </div>
    </Loading>
  );
});
GroupRole.displayName = 'GroupRole';
