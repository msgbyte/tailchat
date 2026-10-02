import { createTestServiceBroker } from '../../utils';
import MessageService from '../../../services/core/chat/message.service';
import auditLogModel from '../../../models/auditLog';
import { Types } from 'mongoose';
import { PERMISSION } from 'tailchat-server-sdk';

describe('Test "chat.message" audit log', () => {
  const { broker, insertTestData } = createTestServiceBroker<MessageService>(
    MessageService,
    {
      contextCallMockFn(actionName) {
        if (actionName === 'group.getUserAllPermissions') {
          return [PERMISSION.core.deleteMessage];
        }
      },
    }
  );

  test('records who deleted which message', async () => {
    const groupId = new Types.ObjectId();
    const converseId = new Types.ObjectId();
    const author = new Types.ObjectId();
    const operator = String(new Types.ObjectId());
    const message = await insertTestData({
      content: 'deleted content',
      author,
      groupId,
      converseId,
    });

    await broker.call(
      'chat.message.deleteMessage',
      { messageId: String(message._id) },
      { meta: { userId: operator } }
    );

    const logs = await auditLogModel.find({ groupId: String(groupId) }).lean();
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      source: 'group',
      action: 'chat.message.deleteMessage',
      operator,
      detail: {
        messageId: String(message._id),
        converseId: String(converseId),
        author: String(author),
        content: 'deleted content',
      },
    });
  });
});
