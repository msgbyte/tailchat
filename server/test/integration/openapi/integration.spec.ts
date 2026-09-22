import { createTestServiceBroker } from '../../utils';
import OpenAppIntegrationService from '../../../services/openapi/integration.service';
import { Types } from 'mongoose';
import { PERMISSION } from 'tailchat-server-sdk';

describe('Test "openapi.integration" service', () => {
  let userPermissions: string[] = [];
  const botUserId = String(new Types.ObjectId());

  const { broker, contextCallMock } =
    createTestServiceBroker<OpenAppIntegrationService>(
      OpenAppIntegrationService,
      {
        contextCallMockFn(actionName) {
          if (actionName === 'group.getUserAllPermissions') {
            return userPermissions;
          }
          if (actionName === 'openapi.app.get') {
            return { appId: 'tc_test', capability: ['bot'] };
          }
          if (actionName === 'openapi.bot.getOrCreateBotAccount') {
            return { userId: botUserId, nickname: 'test-bot' };
          }
        },
      }
    );

  function addBotUser(userId: string) {
    return broker.call(
      'openapi.integration.addBotUser',
      {
        appId: 'tc_test',
        groupId: String(new Types.ObjectId()),
      },
      {
        meta: {
          userId,
          user: { nickname: 'operator' },
        },
      }
    );
  }

  beforeEach(() => {
    contextCallMock.mockClear();
  });

  test('rejects member without manageUser permission', async () => {
    userPermissions = [];

    await expect(addBotUser(String(new Types.ObjectId()))).rejects.toThrow(
      '没有操作权限'
    );

    const joinCalls = contextCallMock.mock.calls.filter(
      ([actionName]) => actionName === 'group.joinGroup'
    );
    expect(joinCalls).toHaveLength(0);
  });

  test('adds bot when member has manageUser permission', async () => {
    userPermissions = [PERMISSION.core.manageUser];

    await addBotUser(String(new Types.ObjectId()));

    const joinCalls = contextCallMock.mock.calls.filter(
      ([actionName]) => actionName === 'group.joinGroup'
    );
    expect(joinCalls).toHaveLength(1);
    expect(joinCalls[0][2]).toMatchObject({ meta: { userId: botUserId } });
  });
});
