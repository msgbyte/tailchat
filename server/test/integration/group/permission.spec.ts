import { createTestServiceBroker } from '../../utils';
import GroupService from '../../../services/core/group/group.service';
import { Types } from 'mongoose';
import type { Group } from '../../../models/group/group';
import { NoPermissionError, PERMISSION } from 'tailchat-server-sdk';

describe('Test "group" service permission boundary', () => {
  /**
   * 操作者通过 group.getUserAllPermissions 拿到的权限
   */
  let operatorPermissions: string[] = [];

  const { broker, service, insertTestData } =
    createTestServiceBroker<GroupService>(GroupService, {
      contextCallMockFn(actionName, params) {
        if (actionName === 'group.getUserAllPermissions') {
          return operatorPermissions;
        }
        if (actionName === 'group.getGroupInfo') {
          return service.adapter.model.findById(params.groupId).lean().exec();
        }
        if (actionName === 'user.getUserInfo') {
          return { nickname: 'test-nickname' };
        }
      },
    });

  beforeEach(() => {
    operatorPermissions = [];
    service.cleanActionCache.mockClear();
  });

  /**
   * 创建一个带有群主、一个普通成员和一个身份组的群组
   * 群组id固定带有字母，用于测试大小写
   */
  async function createTestGroup(
    rolePermissions: string[] = [],
    fallbackPermissions: string[] = []
  ) {
    const ownerId = new Types.ObjectId();
    const memberId = new Types.ObjectId();
    const roleId = new Types.ObjectId();
    const group = await insertTestData({
      _id: new Types.ObjectId('abcdef' + String(new Types.ObjectId()).slice(6)),
      name: 'test',
      owner: ownerId,
      members: [
        { roles: [], userId: ownerId },
        { roles: [String(roleId)], userId: memberId },
      ],
      panels: [],
      roles: [{ _id: roleId, name: 'TestRole', permissions: rolePermissions }],
      fallbackPermissions,
    });

    return {
      groupId: String(group._id),
      ownerId: String(ownerId),
      memberId: String(memberId),
      roleId: String(roleId),
    };
  }

  describe('role actions require manageRoles', () => {
    const roleActions: [string, (roleId: string) => object][] = [
      ['createGroupRole', () => ({ roleName: 'NewRole', permissions: [] })],
      ['updateGroupRoleName', (roleId) => ({ roleId, roleName: 'Renamed' })],
      [
        'updateGroupRolePermission',
        (roleId) => ({ roleId, permissions: ['core.message'] }),
      ],
    ];

    test.each(roleActions)(
      '"group.%s" rejects operator who only has managePanel',
      async (action, buildParams) => {
        const { groupId, memberId, roleId } = await createTestGroup();
        operatorPermissions = [PERMISSION.core.managePanel];

        await expect(
          broker.call(
            `group.${action}`,
            { groupId, ...buildParams(roleId) },
            { meta: { userId: memberId } }
          )
        ).rejects.toBeInstanceOf(NoPermissionError);
      }
    );

    test.each(roleActions)(
      '"group.%s" allows operator who has manageRoles',
      async (action, buildParams) => {
        const { groupId, memberId, roleId } = await createTestGroup();
        operatorPermissions = [PERMISSION.core.manageRoles];

        const res: Group = await broker.call(
          `group.${action}`,
          { groupId, ...buildParams(roleId) },
          { meta: { userId: memberId } }
        );

        expect(String(res._id)).toBe(groupId);
      }
    );
  });

  describe('owner marker', () => {
    test('"group.getPermissions" ignores owner marker granted by role or fallback', async () => {
      const { groupId, memberId } = await createTestGroup(
        ['core.message', '__group_owner__'],
        ['__group_owner__', 'core.invite']
      );

      const res: string[] = await broker.call(
        'group.getPermissions',
        { groupId },
        { meta: { userId: memberId } }
      );

      expect(res).toEqual(['core.message', 'core.invite']);
    });

    test('"group.getPermissions" keeps owner marker for group owner', async () => {
      const { groupId, ownerId } = await createTestGroup();

      const res: string[] = await broker.call(
        'group.getPermissions',
        { groupId },
        { meta: { userId: ownerId } }
      );

      expect(res).toContain('__group_owner__');
    });
  });

  test('"group.getPermissions" rejects non-canonical groupId', async () => {
    const { groupId, ownerId } = await createTestGroup();

    await expect(
      broker.call(
        'group.getPermissions',
        { groupId: groupId.toUpperCase() },
        { meta: { userId: ownerId } }
      )
    ).rejects.toMatchObject({ type: 'VALIDATION_ERROR' });
  });

  describe('"group.updateGroupField" panels', () => {
    /**
     * 创建一个带有两个文字面板的群组
     */
    async function createTestGroupWithPanels() {
      const ownerId = new Types.ObjectId();
      const panelIds = [
        String(new Types.ObjectId()),
        String(new Types.ObjectId()),
      ];
      const group = await insertTestData({
        name: 'test',
        owner: ownerId,
        members: [{ roles: [], userId: ownerId }],
        panels: panelIds.map((id) => ({ id, name: id, type: 0 })),
      });

      return {
        groupId: String(group._id),
        ownerId: String(ownerId),
        panelIds,
      };
    }

    async function getPanelIds(groupId: string) {
      const group = await service.adapter.model.findById(groupId).lean().exec();

      return group.panels.map((p) => p.id);
    }

    test('rejects panel id which not belong to this group', async () => {
      const { groupId, ownerId, panelIds } = await createTestGroupWithPanels();
      operatorPermissions = [PERMISSION.core.owner];

      await expect(
        broker.call(
          'group.updateGroupField',
          {
            groupId,
            fieldName: 'panels',
            fieldValue: [
              { id: panelIds[0], name: 'a', type: 0 },
              { id: String(new Types.ObjectId()), name: 'foreign', type: 0 }, // 其他群组的面板id
            ],
          },
          { meta: { userId: ownerId } }
        )
      ).rejects.toThrow();

      expect(await getPanelIds(groupId)).toEqual(panelIds);
    });

    test('still allows reorder and rename of existing panels', async () => {
      const { groupId, ownerId, panelIds } = await createTestGroupWithPanels();
      operatorPermissions = [PERMISSION.core.managePanel];

      await broker.call(
        'group.updateGroupField',
        {
          groupId,
          fieldName: 'panels',
          fieldValue: [
            { id: panelIds[1], name: 'renamed', type: 0 },
            { id: panelIds[0], name: 'a', type: 0, parentId: panelIds[1] },
          ],
        },
        { meta: { userId: ownerId } }
      );

      const group = await service.adapter.model.findById(groupId).lean().exec();
      expect(group.panels.map((p) => p.id)).toEqual([panelIds[1], panelIds[0]]);
      expect(group.panels[0].name).toBe('renamed');
      expect(group.panels[1].parentId).toBe(panelIds[1]);
    });
  });

  describe('permission cache invalidation', () => {
    beforeEach(() => {
      operatorPermissions = [PERMISSION.core.owner];
    });

    test('"group.deleteGroupMember" cleans kicked member', async () => {
      const { groupId, ownerId, memberId } = await createTestGroup();

      await broker.call(
        'group.deleteGroupMember',
        { groupId, memberId },
        { meta: { userId: ownerId, user: { nickname: 'foo' } } }
      );

      expect(service.cleanActionCache).toHaveBeenCalledWith(
        'getUserAllPermissions',
        [groupId, memberId]
      );
    });

    test('"group.quitGroup" cleans member who quit', async () => {
      const { groupId, memberId } = await createTestGroup();

      await broker.call(
        'group.quitGroup',
        { groupId },
        { meta: { userId: memberId } }
      );

      expect(service.cleanActionCache).toHaveBeenCalledWith(
        'getUserAllPermissions',
        [groupId, memberId]
      );
    });

    test('"group.quitGroup" cleans all members when owner dissolves group', async () => {
      const { groupId, ownerId } = await createTestGroup();

      await broker.call(
        'group.quitGroup',
        { groupId },
        { meta: { userId: ownerId } }
      );

      expect(service.cleanActionCache).toHaveBeenCalledWith(
        'getUserAllPermissions',
        [groupId]
      );
    });

    test('"group.deleteGroupRole" cleans all members', async () => {
      const { groupId, ownerId, roleId } = await createTestGroup();

      await broker.call(
        'group.deleteGroupRole',
        { groupId, roleId },
        { meta: { userId: ownerId } }
      );

      expect(service.cleanActionCache).toHaveBeenCalledWith(
        'getUserAllPermissions',
        [groupId]
      );
    });

    test('"group.updateGroupField" cleans all members when roles replaced', async () => {
      const { groupId, ownerId } = await createTestGroup();

      await broker.call(
        'group.updateGroupField',
        { groupId, fieldName: 'roles', fieldValue: [] },
        { meta: { userId: ownerId } }
      );

      expect(service.cleanActionCache).toHaveBeenCalledWith(
        'getUserAllPermissions',
        [groupId]
      );
    });
  });
});
