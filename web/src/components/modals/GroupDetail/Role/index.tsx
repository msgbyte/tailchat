import {
  DefaultFullModalInputEditorRender,
  FullModalField,
} from '@/components/FullModal/Field';
import { IconBtn } from '@/components/IconBtn';
import { PillTabPane, PillTabs } from '@/components/PillTabs';
import { UserListItem } from '@/components/UserListItem';
import { Button, Input } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { Icon } from 'tailchat-design';
import { t, useGroupInfo, useSearch, useUserInfoList } from 'tailchat-shared';
import { PermissionItem } from './PermissionItem';
import { RoleItem } from './RoleItem';
import { useModifyPermission } from './useModifyPermission';

const permissionList = [
  {
    key: 'core.message',
    title: t('发送消息'),
    desc: t('允许成员在文字频道发送消息'),
    default: true,
  },
];

interface GroupPermissionProps {
  groupId: string;
}
export const GroupRole: React.FC<GroupPermissionProps> = React.memo((props) => {
  const { groupId } = props;
  const [roleId, setRoleId] = useState('');
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
    [roleId]
  );
  const currentRolePermissions = useMemo(
    () => currentRoleInfo?.permissions ?? [],
    [roleId]
  );

  const { isEditing, editingPermission, handleSwitchPermission } =
    useModifyPermission(currentRolePermissions);

  const handleAddMember = useCallback(() => {}, []);

  const handleResetPermission = useCallback(() => {}, []);

  const handleSavePermission = useCallback(() => {}, []);

  const handleChangeRoleName = useCallback((text) => {
    console.log('text', text);
  }, []);

  return (
    <div className="flex h-full">
      <div className="pr-2 mr-2 w-40 border-r border-white border-opacity-20">
        {/* 角色列表 */}
        <RoleItem active={roleId === ''} onClick={() => setRoleId('')}>
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

        <RoleItem active={false}>{t('添加角色')}</RoleItem>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PillTabs>
          <PillTabPane key="summary" tab="概述">
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
          <PillTabPane key="permission" tab="权限">
            <div className="mb-2">
              <Button onClick={handleResetPermission}>
                {t('重置为默认值')}
              </Button>
              <Button
                type="primary"
                disabled={!isEditing}
                onClick={handleSavePermission}
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
          <PillTabPane key="member" tab="管理成员" disabled={!roleId}>
            {/* 管理成员 */}
            <div className="text-right mb-2 flex space-x-1">
              <Input
                placeholder={t('搜索成员')}
                size="middle"
                suffix={<Icon fontSize={20} color="grey" icon="mdi:magnify" />}
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
  );
});
GroupRole.displayName = 'GroupRole';
