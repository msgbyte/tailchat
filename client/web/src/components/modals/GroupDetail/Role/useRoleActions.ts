import {
  ALL_PERMISSION,
  getDefaultPermissionList,
  showSuccessToasts,
} from 'tailchat-shared';
import { model, t, useAsyncRequest } from 'tailchat-shared';

export function useRoleActions(
  groupId: string,
  roleId: typeof ALL_PERMISSION | string
) {
  const [{ loading: loading1 }, handleCreateRole] =
    useAsyncRequest(async () => {
      await model.group.createGroupRole(
        groupId,
        t('新身份组'),
        getDefaultPermissionList()
      );
      showSuccessToasts();
    }, [groupId]);

  const [{ loading: loading2 }, handleSavePermission] = useAsyncRequest(
    async (permissions: string[]) => {
      if (roleId === ALL_PERMISSION) {
        // 所有人权限
        await model.group.modifyGroupField(
          groupId,
          'fallbackPermissions',
          permissions
        );
      } else {
        // 身份组权限
        await model.group.updateGroupRolePermission(
          groupId,
          roleId,
          permissions
        );
      }

      showSuccessToasts();
    },
    [groupId, roleId]
  );

  const [{ loading: loading3 }, handleChangeRoleName] = useAsyncRequest(
    async (newRoleName: string) => {
      if (roleId === ALL_PERMISSION) {
        throw new Error(t('无法修改所有人权限组的显示名称'));
      }
      await model.group.updateGroupRoleName(groupId, roleId, newRoleName);
      showSuccessToasts();
    },
    [groupId, roleId]
  );

  const [{ loading: loading4 }, handleDeleteRole] =
    useAsyncRequest(async () => {
      if (roleId === ALL_PERMISSION) {
        throw new Error(t('无法删除所有人权限'));
      }

      await model.group.deleteGroupRole(groupId, roleId);
      showSuccessToasts();
    }, [groupId, roleId]);

  return {
    loading: loading1 || loading2 || loading3 || loading4,
    handleCreateRole,
    handleSavePermission,
    handleChangeRoleName,
    handleDeleteRole,
  };
}
