import { Types } from 'mongoose';
import { DataNotFoundError } from 'tailchat-server-sdk';
import { createTestServiceBroker } from '../../../test/utils';
import SimpleNotifyService from '../services/simplenotify.service';

const PERMISSION_MANAGE = 'plugin.com.msgbyte.simplenotify.subscribe.manage';

describe('Test "plugin:com.msgbyte.simplenotify" service', () => {
  const groupA = String(new Types.ObjectId());
  const groupB = String(new Types.ObjectId());
  const panelA = String(new Types.ObjectId());
  const panelB = String(new Types.ObjectId());
  const ownerA = String(new Types.ObjectId());
  const ownerB = String(new Types.ObjectId());

  const { broker, service, insertTestData } =
    createTestServiceBroker<SimpleNotifyService>(SimpleNotifyService, {
      contextCallMockFn(actionName, params) {
        if (actionName === 'group.getUserAllPermissions') {
          if (
            (params.groupId === groupA && params.userId === ownerA) ||
            (params.groupId === groupB && params.userId === ownerB)
          ) {
            return [PERMISSION_MANAGE];
          }
          return [];
        }
        if (actionName === 'group.getGroupInfo') {
          if (params.groupId === groupA) {
            return { _id: groupA, panels: [{ id: panelA, type: 0 }] };
          }
          if (params.groupId === groupB) {
            return { _id: groupB, panels: [{ id: panelB, type: 0 }] };
          }
          return null;
        }
      },
    });

  afterEach(async () => {
    await service.adapter.model.deleteMany({
      $or: [{ groupId: { $in: [groupA, groupB] } }, { type: 'user' }],
    });
  });

  test('delete scopes deletion to groupId and group type', async () => {
    const subB = await insertTestData({
      groupId: groupB,
      textPanelId: panelB,
      type: 'group',
    });
    const userSub = await insertTestData({
      userConverseId: String(new Types.ObjectId()),
      type: 'user',
    });

    // Owner of groupA cannot delete groupB's or a user's subscription
    await broker.call(
      'plugin:com.msgbyte.simplenotify.delete',
      {
        groupId: groupA,
        subscribeId: String(subB._id),
      },
      { meta: { userId: ownerA } }
    );
    await broker.call(
      'plugin:com.msgbyte.simplenotify.delete',
      {
        groupId: groupA,
        subscribeId: String(userSub._id),
      },
      { meta: { userId: ownerA } }
    );

    expect(await service.adapter.model.findById(subB._id)).not.toBeNull();
    expect(await service.adapter.model.findById(userSub._id)).not.toBeNull();

    // Owner of groupB can delete their own group subscription
    await broker.call(
      'plugin:com.msgbyte.simplenotify.delete',
      {
        groupId: groupB,
        subscribeId: String(subB._id),
      },
      { meta: { userId: ownerB } }
    );

    expect(await service.adapter.model.findById(subB._id)).toBeNull();
  });

  test('addGroupSubscribe rejects textPanelId that does not belong to groupId', async () => {
    await expect(
      broker.call(
        'plugin:com.msgbyte.simplenotify.addGroupSubscribe',
        {
          groupId: groupA,
          textPanelId: panelB,
        },
        { meta: { userId: ownerA } }
      )
    ).rejects.toThrow(DataNotFoundError);

    await broker.call(
      'plugin:com.msgbyte.simplenotify.addGroupSubscribe',
      {
        groupId: groupA,
        textPanelId: panelA,
      },
      { meta: { userId: ownerA } }
    );

    const created = await service.adapter.model.findOne({
      groupId: groupA,
      textPanelId: panelA,
      type: 'group',
    });
    expect(created).not.toBeNull();
  });
});
