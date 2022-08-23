import { createTestServiceBroker } from '../../utils';
import UserDMListService from '../../../services/core/user/dmlist.service';
import { Types } from 'mongoose';
import type { UserDMList } from '../../../models/user/dmList';

describe('Test "dmlist" service', () => {
  const { broker, service, insertTestData } =
    createTestServiceBroker<UserDMListService>(UserDMListService);

  describe('Test "user.dmlist.addConverse"', () => {
    test('addConverse should be ok', async () => {
      const userId = String(new Types.ObjectId());
      const converseId = String(new Types.ObjectId());

      await broker.call(
        'user.dmlist.addConverse',
        {
          converseId,
        },
        {
          meta: {
            userId,
          },
        }
      );

      try {
        const res = await service.adapter.model.findOne({
          userId,
        });

        expect(res.converseIds.map((r) => String(r))).toEqual([converseId]); // 应该被成功插入
      } finally {
        await service.adapter.model.deleteOne({
          userId,
        });
      }
    });

    test('addConverse should not be repeat', async () => {
      const userId = String(new Types.ObjectId());
      const converseId = String(new Types.ObjectId());

      await broker.call(
        'user.dmlist.addConverse',
        {
          converseId,
        },
        {
          meta: {
            userId,
          },
        }
      );

      await broker.call(
        'user.dmlist.addConverse',
        {
          converseId,
        },
        {
          meta: {
            userId,
          },
        }
      );

      try {
        const res = await service.adapter.model.findOne({
          userId,
        });

        expect(res.converseIds.map((r) => String(r))).toEqual([converseId]); // 应该被成功插入
      } finally {
        await service.adapter.model.deleteOne({
          userId,
        });
      }
    });

    test('addConverse can be add more', async () => {
      const userId = String(new Types.ObjectId());
      const converseId = String(new Types.ObjectId());
      const converseId2 = String(new Types.ObjectId());

      await broker.call(
        'user.dmlist.addConverse',
        {
          converseId,
        },
        {
          meta: {
            userId,
          },
        }
      );

      await broker.call(
        'user.dmlist.addConverse',
        {
          converseId: converseId2,
        },
        {
          meta: {
            userId,
          },
        }
      );

      try {
        const res = await service.adapter.model.findOne({
          userId,
        });

        expect(res.converseIds.map((r) => String(r))).toEqual([
          converseId,
          converseId2,
        ]);
      } finally {
        await service.adapter.model.deleteOne({
          userId,
        });
      }
    });
  });

  test('Test "user.dmlist.removeConverse"', async () => {
    const userId = String(new Types.ObjectId());
    const converseId = new Types.ObjectId();

    await insertTestData({
      userId,
      converseIds: [converseId],
    });

    expect(
      (await service.adapter.model.findOne({ userId })).converseIds.length
    ).toBe(1);

    await broker.call(
      'user.dmlist.removeConverse',
      {
        converseId: String(converseId),
      },
      {
        meta: {
          userId,
        },
      }
    );

    expect(
      (await service.adapter.model.findOne({ userId })).converseIds.length
    ).toBe(0);
  });

  test('Test "user.dmlist.getAllConverse"', async () => {
    const userId = String(new Types.ObjectId());

    const testData = await insertTestData({
      userId,
      converseIds: [new Types.ObjectId()],
    });

    const converseIds: UserDMList = await broker.call(
      'user.dmlist.getAllConverse',
      {},
      {
        meta: {
          userId,
        },
      }
    );

    expect(converseIds).toEqual([...testData.converseIds]);
  });
});
