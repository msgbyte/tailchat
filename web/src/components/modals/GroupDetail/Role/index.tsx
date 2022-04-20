import { IconBtn } from '@/components/IconBtn';
import { PillTabPane, PillTabs } from '@/components/PillTabs';
import { UserListItem } from '@/components/UserListItem';
import { Button } from 'antd';
import React, { useCallback } from 'react';
import { t, useGroupInfo } from 'tailchat-shared';
import { PermissionItem } from './PermissionItem';
import { RoleItem } from './RoleItem';

interface GroupPermissionProps {
  groupId: string;
}
export const GroupRole: React.FC<GroupPermissionProps> = React.memo((props) => {
  const { groupId } = props;
  const groupInfo = useGroupInfo(groupId);
  const members = groupInfo?.members ?? [];

  const handleAddMember = useCallback(() => {}, []);

  return (
    <div className="flex h-full">
      <div className="pr-2 mr-2 w-40 border-r border-white border-opacity-20">
        {/* 角色列表 */}
        <RoleItem active={true}>{t('所有人')}</RoleItem>

        <RoleItem active={false}>{t('添加角色')}</RoleItem>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PillTabs>
          <PillTabPane key="permission" tab="权限">
            {/* 权限详情 */}
            <PermissionItem
              title={t('发送消息')}
              desc={t('允许成员在文字频道发送消息')}
            />
          </PillTabPane>
          <PillTabPane key="member" tab="管理成员">
            {/* 管理成员 */}
            <div className="text-right mb-2">
              <Button type="primary" onClick={handleAddMember}>
                添加成员
              </Button>
            </div>

            {members.map((m) => (
              <UserListItem
                key={m.userId}
                userId={m.userId}
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
