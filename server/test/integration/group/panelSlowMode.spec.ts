import { createTestServiceBroker } from '../../utils';
import GroupService from '../../../services/core/group/group.service';
import { Types } from 'mongoose';
import type { Group } from '../../../models/group/group';
import { EntityError, GroupPanelType, PERMISSION } from 'tailchat-server-sdk';

describe('Test "group" service panel slowMode normalization & validation', () => {
  const { broker, contextCallMock, service, insertTestData } =
    createTestServiceBroker<GroupService>(GroupService, {
      contextCallMockFn(actionName, params) {
        if (actionName === 'group.getUserAllPermissions') {
          return [PERMISSION.core.owner];
        }
        if (actionName === 'group.getGroupInfo') {
          return service.adapter.model.findById(params.groupId).lean().exec();
        }
      },
    });

  beforeEach(() => {
    contextCallMock.mockClear();
  });

  async function createTestGroupWithTextPanel(meta?: Record<string, unknown>) {
    const ownerId = new Types.ObjectId();
    const panelId = String(new Types.ObjectId());
    const group = await insertTestData({
      name: 'test-group',
      owner: ownerId,
      members: [{ roles: [], userId: ownerId }],
      panels: [
        {
          id: panelId,
          name: '中文公告',
          type: GroupPanelType.TEXT,
          ...(meta !== undefined ? { meta } : {}),
        },
      ],
    });

    return {
      groupId: String(group._id),
      ownerId: String(ownerId),
      panelId,
    };
  }

  test('"group.modifyGroupPanel" accepts empty string or null slowMode and strips it from stored meta', async () => {
    const { groupId, ownerId, panelId } = await createTestGroupWithTextPanel();
    const roleId = String(new Types.ObjectId());

    const res: Group = await broker.call(
      'group.modifyGroupPanel',
      {
        groupId,
        panelId,
        name: '中文公告',
        type: GroupPanelType.TEXT,
        meta: { slowMode: '' },
        permissionMap: {
          [roleId]: ['core.viewPanel', 'core.message'],
        },
        fallbackPermissions: ['core.viewPanel'],
      },
      {
        meta: {
          userId: ownerId,
        },
      }
    );

    const updatedPanel = res.panels.find((p) => p.id === panelId);
    expect(updatedPanel?.meta).toBeUndefined();
    expect(updatedPanel?.fallbackPermissions).toEqual(['core.viewPanel']);
    expect(updatedPanel?.permissionMap).toEqual({
      [roleId]: ['core.viewPanel', 'core.message'],
    });

    const resWithNull: Group = await broker.call(
      'group.modifyGroupPanel',
      {
        groupId,
        panelId,
        name: '中文公告2',
        type: GroupPanelType.TEXT,
        meta: { slowMode: null, extra: 'kept' },
      },
      {
        meta: {
          userId: ownerId,
        },
      }
    );

    const updatedPanelAfterNull = resWithNull.panels.find(
      (p) => p.id === panelId
    );
    expect(updatedPanelAfterNull?.meta).toEqual({ extra: 'kept' });
  });

  test('"group.modifyGroupPanel" resets slowMode counters when clearing slowMode via empty string', async () => {
    const { groupId, ownerId, panelId } = await createTestGroupWithTextPanel({
      slowMode: { intervalSeconds: 60, maxMessages: 3 },
    });

    const res: Group = await broker.call(
      'group.modifyGroupPanel',
      {
        groupId,
        panelId,
        name: '中文公告',
        type: GroupPanelType.TEXT,
        meta: { slowMode: '' },
      },
      {
        meta: {
          userId: ownerId,
        },
      }
    );

    const updatedPanel = res.panels.find((p) => p.id === panelId);
    expect(updatedPanel?.meta).toBeUndefined();
    expect(contextCallMock).toHaveBeenCalledWith(
      'chat.message.resetSlowModeCounters',
      {
        groupId,
        converseIds: [panelId],
      }
    );
  });

  test('"group.modifyGroupPanel" preserves valid slowMode, strips extra slowMode fields, and resets counters only when meta changes', async () => {
    const { groupId, ownerId, panelId } = await createTestGroupWithTextPanel();

    const res: Group = await broker.call(
      'group.modifyGroupPanel',
      {
        groupId,
        panelId,
        name: '中文公告',
        type: GroupPanelType.TEXT,
        meta: {
          slowMode: { intervalSeconds: 60, maxMessages: 5, extraField: 'drop' },
        },
      },
      {
        meta: {
          userId: ownerId,
        },
      }
    );

    const updatedPanel = res.panels.find((p) => p.id === panelId);
    expect(updatedPanel?.meta).toEqual({
      slowMode: { intervalSeconds: 60, maxMessages: 5 },
    });
    expect(contextCallMock).toHaveBeenCalledWith(
      'chat.message.resetSlowModeCounters',
      {
        groupId,
        converseIds: [panelId],
      }
    );

    contextCallMock.mockClear();

    await broker.call(
      'group.modifyGroupPanel',
      {
        groupId,
        panelId,
        name: '中文公告改名',
        type: GroupPanelType.TEXT,
      },
      {
        meta: {
          userId: ownerId,
        },
      }
    );

    expect(contextCallMock).not.toHaveBeenCalledWith(
      'chat.message.resetSlowModeCounters',
      expect.anything()
    );
  });

  test('"group.modifyGroupPanel" still rejects invalid slowMode values and non-text panels', async () => {
    const { groupId, ownerId, panelId } = await createTestGroupWithTextPanel();

    await expect(
      broker.call(
        'group.modifyGroupPanel',
        {
          groupId,
          panelId,
          name: '中文公告',
          type: GroupPanelType.TEXT,
          meta: { slowMode: { intervalSeconds: 30, maxMessages: 1 } },
        },
        {
          meta: {
            userId: ownerId,
          },
        }
      )
    ).rejects.toBeInstanceOf(EntityError);

    await expect(
      broker.call(
        'group.modifyGroupPanel',
        {
          groupId,
          panelId,
          name: '分组',
          type: GroupPanelType.GROUP,
          meta: { slowMode: { intervalSeconds: 60, maxMessages: 1 } },
        },
        {
          meta: {
            userId: ownerId,
          },
        }
      )
    ).rejects.toBeInstanceOf(EntityError);
  });

  test('"group.createGroupPanel" strips empty slowMode and rejects invalid slowMode', async () => {
    const { groupId, ownerId } = await createTestGroupWithTextPanel();

    await broker.call(
      'group.createGroupPanel',
      {
        groupId,
        name: '新频道',
        type: GroupPanelType.TEXT,
        meta: { slowMode: '' },
      },
      {
        meta: {
          userId: ownerId,
        },
      }
    );

    const group = await service.adapter.model.findById(groupId).lean().exec();
    const createdPanel = group.panels.find((p) => p.name === '新频道');
    expect(createdPanel).toBeDefined();
    expect(createdPanel?.meta).toBeUndefined();

    await expect(
      broker.call(
        'group.createGroupPanel',
        {
          groupId,
          name: '非法频道',
          type: GroupPanelType.TEXT,
          meta: { slowMode: 'invalid' },
        },
        {
          meta: {
            userId: ownerId,
          },
        }
      )
    ).rejects.toBeInstanceOf(EntityError);
  });

  test('"group.createGroup" strips empty slowMode on panels and rejects invalid slowMode', async () => {
    const userId = String(new Types.ObjectId());

    const created: Group = await broker.call(
      'group.createGroup',
      {
        name: 'slowmode-group',
        panels: [
          {
            id: '00',
            name: '频道1',
            type: GroupPanelType.TEXT,
            meta: { slowMode: '' },
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
      expect(created.panels[0].meta).toBeUndefined();
    } finally {
      await service.adapter.model.findByIdAndRemove(created._id);
    }

    await expect(
      broker.call(
        'group.createGroup',
        {
          name: 'invalid-slowmode-group',
          panels: [
            {
              id: '00',
              name: '频道1',
              type: GroupPanelType.TEXT,
              meta: { slowMode: { intervalSeconds: 10, maxMessages: 1 } },
            },
          ],
        },
        {
          meta: {
            userId,
          },
        }
      )
    ).rejects.toBeInstanceOf(EntityError);
  });
});
