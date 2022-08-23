import { createTestServiceBroker } from '../../utils';
import AckService from '../../../services/core/chat/ack.service';
import { Types } from 'mongoose';
import _ from 'lodash';

describe('Test "chat.message" service', () => {
  const { broker, service, insertTestData } =
    createTestServiceBroker<AckService>(AckService);

  test('Test "chat.ack.update"', async () => {
    const converseId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    const lastMessageId = new Types.ObjectId();

    await broker.call(
      'chat.ack.update',
      {
        converseId: String(converseId),
        lastMessageId: String(lastMessageId),
      },
      {
        meta: {
          userId: String(userId),
        },
      }
    );

    const record = await service.adapter.model.findOne({
      userId,
      converseId,
    });
    try {
      expect(String(record.lastMessageId)).toBe(String(lastMessageId));
    } finally {
      await record.deleteOne();
    }
  });
});
