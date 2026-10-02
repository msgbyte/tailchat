import { createTestServiceBroker } from '../../utils';
import GroupService from '../../../services/core/group/group.service';
import auditLogModel from '../../../models/auditLog';
import { Types } from 'mongoose';
import { PERMISSION } from 'tailchat-server-sdk';

describe('Test "group" audit log', () => {
  const { broker, insertTestData } = createTestServiceBroker<GroupService>(
    GroupService,
    {
      contextCallMockFn(actionName) {
        if (actionName === 'group.getUserAllPermissions') {
          return [PERMISSION.core.owner];
        }
      },
    }
  );

  async function createTestGroup() {
    const userId = new Types.ObjectId();
    const group = await insertTestData({
      name: 'test',
      owner: userId,
      members: [{ roles: [], userId }],
      panels: [],
    });

    return { userId: String(userId), groupId: String(group._id) };
  }

  test('records role management with operator and params', async () => {
    const { userId, groupId } = await createTestGroup();

    await broker.call(
      'group.createGroupRole',
      { groupId, roleName: 'audit-role', permissions: [] },
      { meta: { userId, ip: '127.0.0.1', userAgent: 'jest' } }
    );

    const logs = await auditLogModel.find({ groupId }).lean();
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      source: 'group',
      action: 'group.createGroupRole',
      operator: userId,
      success: true,
      detail: { groupId, roleName: 'audit-role', permissions: [] },
      ip: '127.0.0.1',
      userAgent: 'jest',
    });
    expect(logs[0].createdAt).toBeInstanceOf(Date);
  });

  test('records a member join only once', async () => {
    const { groupId } = await createTestGroup();
    const memberId = String(new Types.ObjectId());

    await broker.call(
      'group.joinGroup',
      { groupId },
      { meta: { userId: memberId } }
    );

    const logs = await auditLogModel.find({ groupId }).lean();
    expect(logs.map((log) => [log.action, log.operator])).toEqual([
      ['group.joinGroup', memberId],
    ]);
  });

  test('attributes a delegated call to the authenticated user', async () => {
    const { userId, groupId } = await createTestGroup();
    const botId = String(new Types.ObjectId());

    await broker.call(
      'group.joinGroup',
      { groupId },
      { meta: { userId: botId, user: { _id: userId } } }
    );

    const logs = await auditLogModel.find({ groupId }).lean();
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      action: 'group.joinGroup',
      operator: userId,
      detail: { groupId, asUser: botId },
    });
  });

  test('marks an owner quit as dissolving the group', async () => {
    const { userId, groupId } = await createTestGroup();

    await broker.call('group.quitGroup', { groupId }, { meta: { userId } });

    const logs = await auditLogModel.find({ groupId }).lean();
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      action: 'group.quitGroup',
      operator: userId,
      detail: { groupId, dissolved: true, name: 'test' },
    });
  });

  test('does not record failed or read-only actions', async () => {
    const { userId, groupId } = await createTestGroup();

    await expect(
      broker.call(
        'group.deleteGroupMember',
        { groupId, memberId: userId },
        { meta: { userId } }
      )
    ).rejects.toThrow();
    await broker.call('group.isGroupOwner', { groupId }, { meta: { userId } });

    expect(await auditLogModel.countDocuments({ groupId })).toBe(0);
  });

  test('keeps the action result when audit storage fails', async () => {
    const { userId, groupId } = await createTestGroup();
    jest
      .spyOn(auditLogModel, 'create')
      .mockRejectedValueOnce(new Error('mongo down') as never);
    const error = jest.spyOn(console, 'error').mockImplementation();

    try {
      const res = await broker.call(
        'group.createGroupRole',
        { groupId, roleName: 'audit-role', permissions: [] },
        { meta: { userId } }
      );

      expect(res).toHaveProperty('roles.0.name', 'audit-role');
      expect(error).toHaveBeenCalled();
      expect(await auditLogModel.countDocuments({ groupId })).toBe(0);
    } finally {
      error.mockRestore();
    }
  });
});
