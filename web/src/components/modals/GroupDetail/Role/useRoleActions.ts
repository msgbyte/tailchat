import { model, t, useAsyncRequest } from 'tailchat-shared';
import { permissionList } from './const';

export function useRoleActions(groupId: string, roleId: string) {
  const [{ loading: loading1 }, handleCreateRole] =
    useAsyncRequest(async () => {
      await model.group.createGroupRole(
        groupId,
        t('新身份组'),
        permissionList.filter((p) => p.default).map((p) => p.key)
      );
    }, [groupId]);

  const [{ loading: loading2 }, handleSavePermission] = useAsyncRequest(
    async (permissions: string[]) => {
      await model.group.updateGroupRolePermission(groupId, roleId, permissions);
    },
    [groupId, roleId]
  );

  const [{ loading: loading3 }, handleChangeRoleName] = useAsyncRequest(
    async (newRoleName: string) => {
      await model.group.updateGroupRoleName(groupId, roleId, newRoleName);
    },
    [groupId, roleId]
  );

  return {
    loading: loading1 || loading2 || loading3,
    handleCreateRole,
    handleSavePermission,
    handleChangeRoleName,
  };
}
