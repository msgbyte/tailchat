import { Types } from 'mongoose';
import { DataNotFoundError } from 'tailchat-server-sdk';
import { createTestServiceBroker } from '../../../test/utils';
import GithubSubscribeService from '../services/subscribe.service';

const PERMISSION_MANAGE = 'plugin.com.msgbyte.github.subscribe.manage';

describe('Test "plugin:com.msgbyte.github.subscribe" service', () => {
  const groupA = String(new Types.ObjectId());
  const groupB = String(new Types.ObjectId());
  const panelA = String(new Types.ObjectId());
  const panelB = String(new Types.ObjectId());
  const ownerA = String(new Types.ObjectId());
  const ownerB = String(new Types.ObjectId());

  const { broker, service, insertTestData } =
    createTestServiceBroker<GithubSubscribeService>(GithubSubscribeService, {
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
      groupId: { $in: [groupA, groupB] },
    });
  });

  test('delete scopes deletion to groupId and cannot delete another group subscription', async () => {
    const subB = await insertTestData({
      groupId: groupB,
      textPanelId: panelB,
      repoName: 'msgbyte/tailchat',
    });

    // Owner of groupA attempts to delete groupB's subscription using groupA's permissions
    await broker.call(
      'plugin:com.msgbyte.github.subscribe.delete',
      {
        groupId: groupA,
        subscribeId: String(subB._id),
      },
      { meta: { userId: ownerA } }
    );

    const stillExists = await service.adapter.model.findById(subB._id);
    expect(stillExists).not.toBeNull();

    // Owner of groupB can delete their own subscription
    await broker.call(
      'plugin:com.msgbyte.github.subscribe.delete',
      {
        groupId: groupB,
        subscribeId: String(subB._id),
      },
      { meta: { userId: ownerB } }
    );

    const deleted = await service.adapter.model.findById(subB._id);
    expect(deleted).toBeNull();
  });

  test('add rejects textPanelId that does not belong to groupId', async () => {
    await expect(
      broker.call(
        'plugin:com.msgbyte.github.subscribe.add',
        {
          groupId: groupA,
          textPanelId: panelB,
          repoName: 'msgbyte/tailchat',
        },
        { meta: { userId: ownerA } }
      )
    ).rejects.toThrow(DataNotFoundError);

    await broker.call(
      'plugin:com.msgbyte.github.subscribe.add',
      {
        groupId: groupA,
        textPanelId: panelA,
        repoName: 'msgbyte/tailchat',
      },
      { meta: { userId: ownerA } }
    );

    const created = await service.adapter.model.findOne({
      groupId: groupA,
      textPanelId: panelA,
    });
    expect(created).not.toBeNull();
  });
});
