import { createTestServiceBroker } from '../../utils';
import GroupService from '../../../services/core/group/group.service';
import { Types } from 'mongoose';
import { Group, GroupPanelType } from '../../../models/group/group';
import { generateRandomStr } from '../../../lib/utils';
import _ from 'lodash';

function createTestGroup(
  userId: Types.ObjectId = new Types.ObjectId(),
  groupInfo?: Partial<Group>
): Partial<Group> {
  return {
    name: 'test',
    owner: userId,
    members: [
      {
        roles: [],
        userId: userId,
      },
    ],
    panels: [],
    ...groupInfo,
  };
}

function createTestRole(
  name: string = generateRandomStr(),
  permissions: string[] = []
) {
  const roleId = new Types.ObjectId();
  return {
    _id: roleId,
    id: String(roleId),
    name,
    permissions,
  };
}

describe('Test "group" service', () => {
  const { broker, service, insertTestData } =
    createTestServiceBroker<GroupService>(GroupService);

  test('Test "group.createGroup"', async () => {
    const userId = String(new Types.ObjectId());

    const res: Group = await broker.call(
      'group.createGroup',
      {
        name: 'test',
        panels: [
          {
            id: '00',
            name: '频道1',
            type: GroupPanelType.TEXT,
          },
          {
            id: '10',
            name: '频道分组',
            type: GroupPanelType.GROUP,
          },
          {
            id: '11',
            name: '子频道',
            parentId: '10',
            type: GroupPanelType.TEXT,
          },
        ],
      },
      {
        meta: {
          userId,
        },
      }
    );

    try {
      expect(res).toHaveProperty('name', 'test');
      expect(res).toHaveProperty('panels');
      expect(res).toHaveProperty('owner');
      expect(res.members.length).toBe(1);

      // 面板ID会被自动转换
      const panels = res.panels;
      expect(panels[0].id).toHaveLength(24);
      expect(panels[1].id).toBe(panels[2].parentId);
      expect(res.roles).toEqual([]);
    } finally {
      await service.adapter.model.findByIdAndRemove(res._id);
    }
  });

  test('Test "group.getUserGroups"', async () => {
    const userId = new Types.ObjectId();
    const testGroup = await insertTestData(createTestGroup(userId));

    const res: Group[] = await broker.call(
      'group.getUserGroups',
      {},
      {
        meta: {
          userId: String(userId),
        },
      }
    );

    expect(res.length).toBe(1);
    expect(res[0]._id).toBe(String(testGroup._id));
  });

  test('Test "group.joinGroup"', async () => {
    const userId = new Types.ObjectId();
    const testGroup = await insertTestData(createTestGroup(userId));

    expect(
      [...(testGroup.members ?? [])].map((v) =>
        service.adapter.entityToObject(v)
      )
    ).toEqual([
      {
        roles: [],
        userId,
      },
    ]);

    const newMemberUserId = new Types.ObjectId();

    const res: Group = await broker.call(
      'group.joinGroup',
      {
        groupId: String(testGroup._id),
      },
      {
        meta: {
          userId: String(newMemberUserId),
        },
      }
    );

    const newMembers = [...res.members];
    expect(newMembers).toEqual([
      {
        roles: [],
        userId,
      },
      {
        roles: [],
        userId: newMemberUserId,
      },
    ]);
  });

  test('Test "group.modifyGroupPanel"', async () => {
    const testGroupPanels = [
      {
        id: String(new Types.ObjectId()),
        name: generateRandomStr(),
        type: 1,
      },
      {
        id: String(new Types.ObjectId()),
        name: generateRandomStr(),
        type: 1,
      },
      {
        id: String(new Types.ObjectId()),
        name: generateRandomStr(),
        type: 1,
      },
    ];
    const testGroup = await insertTestData(
      createTestGroup(new Types.ObjectId(), {
        panels: [...testGroupPanels],
      })
    );

    const newPanelName = generateRandomStr();

    const res: Group = await broker.call(
      'group.modifyGroupPanel',
      {
        groupId: String(testGroup._id),
        panelId: String(testGroupPanels[1].id),
        name: newPanelName,
      },
      {
        meta: {
          userId: String(testGroup.owner),
        },
      }
    );

    const expectedPanels = [
      testGroupPanels[0],
      { ...testGroupPanels[1], name: newPanelName },
      testGroupPanels[2],
    ];
    expect(res.panels).toEqual(expectedPanels);
    expect(_.omit(res, 'updatedAt')).toEqual(
      _.omit(
        {
          ...testGroup.toJSON(),
          _id: String(testGroup._id),
          panels: expectedPanels,
        },
        'updatedAt'
      )
    );
  });

  describe('Test "group.deleteGroupPanel"', () => {
    const groupPanelId = new Types.ObjectId();
    const textPanelId = new Types.ObjectId();

    const sampleGroupInfo = {
      panels: [
        {
          id: String(groupPanelId),
          name: '文字频道',
          type: 1,
        },
        {
          id: String(textPanelId),
          name: '大厅',
          parentId: String(groupPanelId),
          type: 0,
        },
        {
          id: String(new Types.ObjectId()),
          name: '其他面板',
          type: 0,
        },
      ],
    };

    test('delete single panel', async () => {
      const userId = new Types.ObjectId();
      const testGroup = await insertTestData(
        createTestGroup(userId, sampleGroupInfo)
      );

      const res: Group = await broker.call(
        'group.deleteGroupPanel',
        {
          groupId: String(testGroup._id),
          panelId: String(textPanelId),
        },
        {
          meta: {
            userId: String(userId),
          },
        }
      );

      expect(res.panels.length).toBe(2);
    });
    test('delete group panel', async () => {
      const userId = new Types.ObjectId();
      const testGroup = await insertTestData(
        createTestGroup(userId, sampleGroupInfo)
      );

      const res: Group = await broker.call(
        'group.deleteGroupPanel',
        {
          groupId: String(testGroup._id),
          panelId: String(groupPanelId),
        },
        {
          meta: {
            userId: String(userId),
          },
        }
      );

      expect(res.panels.length).toBe(1);
    });
  });

  describe('Group Roles Controllers', () => {
    test('Test "group.createGroupRole"', async () => {
      const userId = new Types.ObjectId();
      const testGroup = await insertTestData(createTestGroup(userId));

      const res: Group = await broker.call(
        'group.createGroupRole',
        {
          groupId: String(testGroup.id),
          roleName: 'testRole',
        },
        {
          meta: {
            userId: String(userId),
          },
        }
      );

      expect((res.roles ?? []).length).toBe(1);
      expect(res.roles).toMatchObject([
        {
          name: 'testRole',
          permissions: [],
        },
      ]);
    });

    test('Test "group.deleteGroupRole"', async () => {
      const userId = new Types.ObjectId();
      const role1 = createTestRole('TestRole1', ['permission1', 'permission2']);
      const role2 = createTestRole('TestRole2', ['permission1', 'permission2']);
      const testGroup = await insertTestData(
        createTestGroup(userId, {
          roles: [role1, role2],
        })
      );

      expect(testGroup.roles?.length).toBe(2);
      expect(testGroup.roles).toMatchObject([role1, role2]);

      const res: Group = await broker.call(
        'group.deleteGroupRole',
        {
          groupId: String(testGroup.id),
          roleId: testGroup.roles?.[0]._id,
        },
        {
          meta: {
            userId: String(userId),
          },
        }
      );

      expect(res.roles?.length).toBe(1);
      expect(res.roles).toMatchObject([
        {
          name: 'TestRole2',
          permissions: ['permission1', 'permission2'],
        },
      ]);
    });

    test('Test "group.updateGroupRolePermission"', async () => {
      const userId = new Types.ObjectId();
      const role1 = createTestRole('TestRole1', ['permission1', 'permission2']);
      const role2 = createTestRole('TestRole2', ['permission1', 'permission2']);
      const testGroup = await insertTestData(
        createTestGroup(userId, {
          roles: [role1, role2],
        })
      );

      const res: Group = await broker.call(
        'group.updateGroupRolePermission',
        {
          groupId: String(testGroup.id),
          roleName: 'TestRole1',
          permissions: ['foo'],
        },
        {
          meta: {
            userId: String(userId),
          },
        }
      );

      expect((res.roles ?? []).length).toBe(2);
      expect(res.roles).toMatchObject([
        {
          name: 'TestRole1',
          permissions: ['foo'],
        },
        {
          name: 'TestRole2',
          permissions: ['permission1', 'permission2'],
        },
      ]);
    });

    test('Test "group.getPermissions"', async () => {
      const userId = new Types.ObjectId();
      const role1 = createTestRole('TestRole1', ['permission1', 'permission2']);
      const role2 = createTestRole('TestRole2', ['permission2', 'permission3']);
      const testGroup = await insertTestData(
        createTestGroup(userId, {
          members: [
            {
              userId,
              roles: [role1.id, role2.id],
            },
          ],
          roles: [role1, role2],
        })
      );

      const res: string[] = await broker.call(
        'group.getPermissions',
        {
          groupId: String(testGroup.id),
        },
        {
          meta: {
            userId: String(userId),
          },
        }
      );
      expect(res).toEqual(['permission1', 'permission2', 'permission3']);
    });

    test('Test "group.appendGroupMemberRoles"', async () => {
      const userId = new Types.ObjectId();
      const role1 = createTestRole('TestRole1', ['permission1', 'permission2']);
      const role2 = createTestRole('TestRole2', ['permission2', 'permission3']);
      const testGroup = await insertTestData(
        createTestGroup(userId, {
          members: [
            {
              userId,
              roles: [role1.id],
            },
          ],
          roles: [role1, role2],
        })
      );

      await broker.call(
        'group.appendGroupMemberRoles',
        {
          groupId: String(testGroup.id),
          memberIds: [String(userId)],
          roles: [role2.id],
        },
        {
          meta: {
            userId: String(userId),
          },
        }
      );

      expect(_.last(service.cleanActionCache.mock.calls)).toEqual([
        'getGroupInfo',
        [String(testGroup.id)],
      ]);
      const notifiedGroupId = _.last(service.roomcastNotify.mock.calls)[1];
      const notifiedGroupInfo: Group = _.last(
        service.roomcastNotify.mock.calls
      )[3];

      expect(notifiedGroupId).toEqual(String(testGroup.id));
      expect(notifiedGroupInfo.members).toEqual([
        {
          roles: [role1.id, role2.id],
          userId,
        },
      ]);
    });

    test('Test "group.removeGroupMemberRoles"', async () => {
      const userId = new Types.ObjectId();
      const role1 = createTestRole('TestRole1', ['permission1', 'permission2']);
      const role2 = createTestRole('TestRole2', ['permission2', 'permission3']);
      const testGroup = await insertTestData(
        createTestGroup(userId, {
          members: [
            {
              userId,
              roles: [role1.id],
            },
          ],
          roles: [role1, role2],
        })
      );

      await broker.call(
        'group.removeGroupMemberRoles',
        {
          groupId: String(testGroup.id),
          memberIds: [String(userId)],
          roles: [role1.id],
        },
        {
          meta: {
            userId: String(userId),
          },
        }
      );

      expect(_.last(service.cleanActionCache.mock.calls)).toEqual([
        'getGroupInfo',
        [String(testGroup.id)],
      ]);
      const notifiedGroupId = _.last(service.roomcastNotify.mock.calls)[1];
      const notifiedGroupInfo: Group = _.last(
        service.roomcastNotify.mock.calls
      )[3];

      expect(notifiedGroupId).toEqual(String(testGroup.id));
      expect(notifiedGroupInfo.members).toEqual([
        {
          roles: [],
          userId,
        },
      ]);
    });
  });

  test('Test "group.muteGroupMember"', async () => {
    const userId = new Types.ObjectId();
    const testGroup = await insertTestData(createTestGroup(userId));

    const muteUntil = new Date().valueOf() + 1000 * 60 * 60 * 10;

    await broker.call(
      'group.muteGroupMember',
      {
        groupId: String(testGroup._id),
        memberId: String(userId),
        muteMs: 1000 * 60 * 60 * 10,
      },
      {
        meta: {
          userId: String(userId),
          user: { nickname: 'foo' },
        },
      }
    );

    const finalGroup = await service.adapter.model.findById(testGroup._id);

    expect(new Date(finalGroup?.members[0].muteUntil ?? 0).valueOf()).toBe(
      muteUntil
    );
  });
});
