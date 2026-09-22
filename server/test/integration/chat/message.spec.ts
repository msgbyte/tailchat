import { createTestServiceBroker } from '../../utils';
import MessageService from '../../../services/core/chat/message.service';
import type { MessageDocument } from '../../../models/chat/message';
import { Types } from 'mongoose';
import _ from 'lodash';
import { SYSTEM_USERID } from 'tailchat-server-sdk';

function createTestMessage(converseId: Types.ObjectId, content = 'bar') {
  return {
    content,
    // author: '',
    // groupId: '',
    avatar: null,
    converseId,
  };
}

describe('Test "chat.message" service', () => {
  const { broker, service, insertTestData, contextCallMock } =
    createTestServiceBroker<MessageService>(MessageService, {
      contextCallMockFn: function (
        this: { meta: { userId: string } },
        actionName
      ) {
        if (actionName === 'user.getUserInfo') {
          return { type: 'normal' };
        }
        if (actionName === 'chat.converse.findConverseInfo') {
          return { type: 'Multi', members: [this.meta.userId] };
        }
      },
    });

  test('returns the persisted message when the online status lookup fails', async () => {
    const converseId = String(new Types.ObjectId());
    const userId = String(new Types.ObjectId());
    const defaultCall = contextCallMock.getMockImplementation();
    const emit = jest.spyOn(broker, 'emit');
    contextCallMock.mockImplementation(function (actionName, ...args) {
      if (actionName === 'gateway.checkUserOnline') {
        throw new Error('Online status unavailable');
      }
      return defaultCall.call(this, actionName, ...args);
    });

    try {
      const result: MessageDocument = await broker.call(
        'chat.message.sendMessage',
        { converseId, content: 'Persisted message' },
        { meta: { userId } }
      );

      expect(String(result.converseId)).toBe(converseId);
      expect(result.content).toBe('Persisted message');
      const messages = await service.adapter.model.find({ converseId });
      expect(messages).toHaveLength(1);
      expect(String(messages[0]._id)).toBe(String(result._id));
      expect(emit).toHaveBeenCalledWith(
        'chat.message.updateMessage',
        expect.objectContaining({
          type: 'add',
          converseId,
          messageId: String(result._id),
        }),
        expect.any(Object)
      );
    } finally {
      contextCallMock.mockImplementation(defaultCall);
      emit.mockRestore();
      await service.adapter.model.deleteMany({ converseId });
    }
  });

  describe('Test slow mode bypass policy', () => {
    test('plugin bots keep converse access but do not bypass slow mode', async () => {
      const userId = String(new Types.ObjectId());
      const ctx = {
        meta: {
          userId,
          t: (key: string) => key,
        },
        call: jest.fn().mockResolvedValue({ type: 'pluginBot' }),
      };

      const result = await (service as any).checkConversePermission(
        ctx,
        String(new Types.ObjectId()),
        String(new Types.ObjectId())
      );

      expect(result).toEqual({ bypassSlowMode: false });
      expect(ctx.call).toHaveBeenCalledWith('user.getUserInfo', { userId });
    });

    test('system messages still bypass slow mode', async () => {
      const ctx = {
        meta: {
          userId: SYSTEM_USERID,
          t: (key: string) => key,
        },
        call: jest.fn(),
      };

      const result = await (service as any).checkConversePermission(
        ctx,
        String(new Types.ObjectId()),
        String(new Types.ObjectId())
      );

      expect(result).toEqual({ bypassSlowMode: true });
      expect(ctx.call).not.toHaveBeenCalled();
    });
  });

  describe('Test "chat.message.fetchConverseMessage"', () => {
    test('single message', async () => {
      const converseId = new Types.ObjectId();
      const testDoc = await insertTestData(createTestMessage(converseId));

      const res: MessageDocument = await broker.call(
        'chat.message.fetchConverseMessage',
        {
          converseId: String(converseId),
        }
      );

      expect(res).not.toBe(null);
      expect(Array.isArray(res)).toBe(true);
      expect(_.get(res, [0, '_id'])).toBe(String(testDoc._id));
    });

    test('limit should be ok', async () => {
      const converseId = new Types.ObjectId();
      const docs = await Promise.all(
        Array(60)
          .fill(null)
          .map(() => insertTestData(createTestMessage(converseId)))
      );

      const res: MessageDocument[] = await broker.call(
        'chat.message.fetchConverseMessage',
        {
          converseId: String(converseId),
        }
      );

      expect(res).not.toBe(null);
      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBe(50);
    });

    test('startId should be ok', async () => {
      const converseId = new Types.ObjectId();
      const docs = await Promise.all(
        Array(60)
          .fill(null)
          .map(() => insertTestData(createTestMessage(converseId)))
      );

      const startId = docs[20]._id; // 这是第21条数据

      const res: MessageDocument[] = await broker.call(
        'chat.message.fetchConverseMessage',
        {
          converseId: String(converseId),
          startId: String(startId),
        }
      );

      expect(res).not.toBe(null);
      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBe(20); // 因为是倒序排列, 所以会拿到前20条
    });
  });

  describe('Test message reaction"', () => {
    test('chat.message.addReaction', async () => {
      const converseId = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const emoji = ':any:';
      const message = await insertTestData(createTestMessage(converseId));

      const res: MessageDocument[] = await broker.call(
        'chat.message.addReaction',
        {
          messageId: String(message._id),
          emoji,
        },
        {
          meta: {
            userId: String(userId),
          },
        }
      );

      expect(res).toBe(true);

      const _message = await service.adapter.findById(String(message._id));
      expect(_message.reactions.length).toBe(1);
      expect(_message.reactions[0].name).toBe(emoji);
      expect(String(_message.reactions[0].author)).toBe(String(userId));
    });

    describe('chat.message.removeReaction', () => {
      test('remove exist reaction', async () => {
        const converseId = new Types.ObjectId();
        const userId = new Types.ObjectId();
        const emoji = ':any:';
        const message = await insertTestData({
          ...createTestMessage(converseId),
          reactions: [
            {
              author: userId,
              name: emoji,
            },
          ],
        });

        const res: MessageDocument[] = await broker.call(
          'chat.message.removeReaction',
          {
            messageId: String(message._id),
            emoji,
          },
          {
            meta: {
              userId: String(userId),
            },
          }
        );

        expect(res).toBe(true);

        const _message = await service.adapter.findById(String(message._id));
        expect(_message.reactions.length).toBe(0);
      });

      test('remove non-exist reaction', async () => {
        const converseId = new Types.ObjectId();
        const userId = new Types.ObjectId();
        const emoji = ':any:';
        const message = await insertTestData({
          ...createTestMessage(converseId),
          reactions: [
            {
              author: userId,
              name: emoji,
            },
          ],
        });

        const res: MessageDocument[] = await broker.call(
          'chat.message.removeReaction',
          {
            messageId: String(message._id),
            emoji: ':none:',
          },
          {
            meta: {
              userId: String(userId),
            },
          }
        );

        expect(res).toBe(true);

        const _message = await service.adapter.findById(String(message._id));
        expect(_message.reactions.length).toBe(1);
        expect(_message.reactions[0].name).toBe(emoji);
        expect(String(_message.reactions[0].author)).toBe(String(userId));
      });
    });
  });
});
