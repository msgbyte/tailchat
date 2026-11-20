import { Types } from 'mongoose';
import {
  DataNotFoundError,
  NoPermissionError,
  PERMISSION,
  SYSTEM_USERID,
} from 'tailchat-server-sdk';
import GroupExtraService from '../../../services/core/group/groupExtra.service';
import { createTestServiceBroker } from '../../utils';

describe('Test "group.extra" service', () => {
  const groupId = String(new Types.ObjectId());
  const panelId = String(new Types.ObjectId());
  const otherPanelId = String(new Types.ObjectId());
  const memberId = String(new Types.ObjectId());
  const outsiderId = String(new Types.ObjectId());

  const { broker, service } = createTestServiceBroker<GroupExtraService>(
    GroupExtraService,
    {
      brokerOptions: {
        cacher: 'Memory',
      },
      contextCallMockFn(actionName, params) {
        if (actionName === 'group.getGroupInfo') {
          if (params.groupId === groupId) {
            return {
              _id: groupId,
              members: [{ userId: memberId, roles: [] }],
              panels: [{ id: panelId, name: 'panel-1', type: 0 }],
            };
          }
          return null;
        }
        if (actionName === 'group.getUserAllPermissions') {
          if (params.groupId === groupId && params.userId === memberId) {
            return [PERMISSION.core.groupConfig, PERMISSION.core.managePanel];
          }
          return [];
        }
      },
    }
  );

  afterEach(async () => {
    await service.adapter.model.deleteMany({ groupId });
  });

  test('getGroupData allows member and SYSTEM_USERID, rejects non-member even when cached', async () => {
    await broker.call(
      'group.extra.saveGroupData',
      {
        groupId,
        name: 'secret-note',
        data: 'private-group-data',
      },
      { meta: { userId: memberId } }
    );

    const memberRes = await broker.call(
      'group.extra.getGroupData',
      { groupId, name: 'secret-note' },
      { meta: { userId: memberId } }
    );
    expect(memberRes).toEqual({ data: 'private-group-data' });

    await expect(
      broker.call(
        'group.extra.getGroupData',
        { groupId, name: 'secret-note' },
        { meta: { userId: outsiderId } }
      )
    ).rejects.toThrow(NoPermissionError);

    const systemRes = await broker.call(
      'group.extra.getGroupData',
      { groupId, name: 'secret-note' },
      { meta: { userId: SYSTEM_USERID } }
    );
    expect(systemRes).toEqual({ data: 'private-group-data' });
  });

  test('getPanelData and savePanelData enforce membership and panel ownership', async () => {
    await broker.call(
      'group.extra.savePanelData',
      {
        groupId,
        panelId,
        name: 'doc',
        data: 'panel-secret',
      },
      { meta: { userId: memberId } }
    );

    const memberRes = await broker.call(
      'group.extra.getPanelData',
      { groupId, panelId, name: 'doc' },
      { meta: { userId: memberId } }
    );
    expect(memberRes).toEqual({ data: 'panel-secret' });

    // Non-member cannot read even after member warmed cache
    await expect(
      broker.call(
        'group.extra.getPanelData',
        { groupId, panelId, name: 'doc' },
        { meta: { userId: outsiderId } }
      )
    ).rejects.toThrow(NoPermissionError);

    // Unrelated panelId is rejected for both read and write
    await expect(
      broker.call(
        'group.extra.getPanelData',
        { groupId, panelId: otherPanelId, name: 'doc' },
        { meta: { userId: memberId } }
      )
    ).rejects.toThrow(DataNotFoundError);

    await expect(
      broker.call(
        'group.extra.savePanelData',
        { groupId, panelId: otherPanelId, name: 'doc', data: 'bad' },
        { meta: { userId: memberId } }
      )
    ).rejects.toThrow(DataNotFoundError);
  });

  test('internal cached actions are not published externally', () => {
    const publishedActionNames = service
      .getActionList()
      .map((action) => action.name);

    for (const actionName of ['getGroupDataInternal', 'getPanelDataInternal']) {
      expect((service.schema.actions[actionName] as any)?.visibility).toBe(
        'public'
      );
      expect(publishedActionNames).not.toContain(actionName);
    }
  });
});
