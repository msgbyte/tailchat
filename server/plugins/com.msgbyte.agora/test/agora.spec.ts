import { Types } from 'mongoose';
import { NoPermissionError } from 'tailchat-server-sdk';
import { createTestServiceBroker } from '../../../test/utils';
import AgoraService from '../services/agora.service';

describe('Test "plugin:com.msgbyte.agora" service', () => {
  const prevEnv = {
    AGORA_APP_ID: process.env.AGORA_APP_ID,
    AGORA_APP_CERT: process.env.AGORA_APP_CERT,
    AGORA_CUSTOMER_KEY: process.env.AGORA_CUSTOMER_KEY,
    AGORA_CUSTOMER_SECRET: process.env.AGORA_CUSTOMER_SECRET,
  };
  process.env.AGORA_APP_ID = '0123456789abcdef0123456789abcdef';
  process.env.AGORA_APP_CERT = 'fedcba9876543210fedcba9876543210';
  process.env.AGORA_CUSTOMER_KEY = 'test-key';
  process.env.AGORA_CUSTOMER_SECRET = 'test-secret';

  const groupId = String(new Types.ObjectId());
  const panelId = String(new Types.ObjectId());
  const otherPanelId = String(new Types.ObjectId());
  const dmConverseId = String(new Types.ObjectId());
  const memberId = String(new Types.ObjectId());
  const outsiderId = String(new Types.ObjectId());

  const { broker } = createTestServiceBroker<AgoraService>(AgoraService, {
    contextCallMockFn(actionName, params) {
      if (actionName === 'group.getGroupInfo') {
        if (params.groupId === groupId) {
          return {
            _id: groupId,
            members: [{ userId: memberId, roles: [] }],
            panels: [{ id: panelId, type: 0 }],
          };
        }
        return null;
      }
      if (actionName === 'chat.converse.findConverseInfo') {
        if (
          params.converseId === dmConverseId &&
          this.meta.userId === memberId
        ) {
          return { _id: dmConverseId, members: [memberId] };
        }
        throw new NoPermissionError('没有获取会话信息权限');
      }
    },
  });

  afterAll(() => {
    for (const [k, v] of Object.entries(prevEnv)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });

  test('generateJoinInfo enforces channel membership and prevents userId impersonation', async () => {
    const channelName = `${groupId}|${panelId}`;

    // Legitimate member self join
    const selfRes: any = await broker.call(
      'plugin:com.msgbyte.agora.generateJoinInfo',
      { channelName },
      { meta: { userId: memberId } }
    );
    expect(selfRes.appId).toBe(process.env.AGORA_APP_ID);
    expect(typeof selfRes.token).toBe('string');

    // Legitimate member screen-sharing join
    const screenRes: any = await broker.call(
      'plugin:com.msgbyte.agora.generateJoinInfo',
      { channelName, userId: `${memberId}_screen` },
      { meta: { userId: memberId } }
    );
    expect(typeof screenRes.token).toBe('string');

    // Impersonating another userId is rejected
    await expect(
      broker.call(
        'plugin:com.msgbyte.agora.generateJoinInfo',
        { channelName, userId: outsiderId },
        { meta: { userId: memberId } }
      )
    ).rejects.toThrow(NoPermissionError);

    // Non-member is rejected
    await expect(
      broker.call(
        'plugin:com.msgbyte.agora.generateJoinInfo',
        { channelName },
        { meta: { userId: outsiderId } }
      )
    ).rejects.toThrow(NoPermissionError);

    // Unrelated panelId is rejected
    await expect(
      broker.call(
        'plugin:com.msgbyte.agora.generateJoinInfo',
        { channelName: `${groupId}|${otherPanelId}` },
        { meta: { userId: memberId } }
      )
    ).rejects.toThrow(NoPermissionError);

    // Personal DM channel enforces converse membership
    const dmRes: any = await broker.call(
      'plugin:com.msgbyte.agora.generateJoinInfo',
      { channelName: `personal|${dmConverseId}` },
      { meta: { userId: memberId } }
    );
    expect(typeof dmRes.token).toBe('string');

    await expect(
      broker.call(
        'plugin:com.msgbyte.agora.generateJoinInfo',
        { channelName: `personal|${dmConverseId}` },
        { meta: { userId: outsiderId } }
      )
    ).rejects.toThrow(NoPermissionError);
  });

  test('getChannelUserList rejects non-members', async () => {
    await expect(
      broker.call(
        'plugin:com.msgbyte.agora.getChannelUserList',
        { channelName: `${groupId}|${panelId}` },
        { meta: { userId: outsiderId } }
      )
    ).rejects.toThrow(NoPermissionError);
  });
});
