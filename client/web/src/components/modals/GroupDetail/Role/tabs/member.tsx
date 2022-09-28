import { IconBtn } from '@/components/IconBtn';
import { closeModal, openModal } from '@/components/Modal';
import { SelectGroupMember } from '@/components/modals/SelectGroupMember';
import { UserListItem } from '@/components/UserListItem';
import { Button, Input } from 'antd';
import React, { useCallback } from 'react';
import { Icon } from 'tailchat-design';
import {
  model,
  showErrorToasts,
  showSuccessToasts,
  t,
  useAsyncRequest,
  useGroupInfo,
  useMemoizedFn,
  useSearch,
  useUserId,
  useUserInfoList,
} from 'tailchat-shared';
import _compact from 'lodash/compact';

interface RoleMemberProps {
  groupId: string;
  currentRoleInfo: model.group.GroupRole;
}
export const RoleMember: React.FC<RoleMemberProps> = React.memo((props) => {
  const roleId = props.currentRoleInfo._id;
  const groupInfo = useGroupInfo(props.groupId);
  const members = (groupInfo?.members ?? []).filter((m) =>
    m.roles.includes(roleId)
  );
  const memberIds = members.map((m) => m.userId);
  const userInfoList = useUserInfoList(memberIds);
  const {
    searchText,
    setSearchText,
    isSearching,
    searchResult: filterMembers,
  } = useSearch({
    dataSource: userInfoList,
    filterFn: (item, searchText) => item.nickname.includes(searchText),
  });

  const handleAddMember = useMemoizedFn(() => {
    const key = openModal(
      <SelectGroupMember
        groupId={props.groupId}
        withoutMemberIds={_compact([...memberIds])}
        onConfirm={async (selectedIds) => {
          try {
            await model.group.appendGroupMemberRoles(
              props.groupId,
              selectedIds,
              [props.currentRoleInfo._id]
            );
            showSuccessToasts();
            closeModal(key);
          } catch (err) {
            showErrorToasts(err);
          }
        }}
      />
    );
  });

  const [, handleRemoveMember] = useAsyncRequest(
    async (memberId: string) => {
      if (!props.currentRoleInfo?._id) {
        showErrorToasts(t('当前没有选择任何角色组'));
        return;
      }

      await model.group.removeGroupMemberRoles(
        props.groupId,
        [memberId],
        [props.currentRoleInfo._id]
      );
      showSuccessToasts();
    },
    [props.groupId, props.currentRoleInfo?._id]
  );

  return (
    <div>
      {/* 管理成员 */}
      <div className="text-right mb-2 flex space-x-1">
        <Button type="primary" onClick={handleAddMember}>
          {t('添加成员')}
        </Button>

        {userInfoList.length > 0 && (
          <Input
            placeholder={t('搜索成员')}
            size="middle"
            suffix={<Icon fontSize={20} color="grey" icon="mdi:magnify" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        )}
      </div>

      {(isSearching ? filterMembers : userInfoList).map((m) => (
        <UserListItem
          key={m._id}
          userId={m._id}
          actions={[
            <IconBtn
              key="remove"
              icon="mdi:close"
              onClick={() => handleRemoveMember(m._id)}
            />,
          ]}
        />
      ))}
    </div>
  );
});
RoleMember.displayName = 'RoleMember';
