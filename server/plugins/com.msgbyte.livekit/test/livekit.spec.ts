import { Types } from 'mongoose';
import { NoPermissionError } from 'tailchat-server-sdk';
import { createTestServiceBroker } from '../../../test/utils';
import LivekitService from '../services/livekit.service';

describe('Test "plugin:com.msgbyte.livekit" service', () => {
  const prevKey = process.env.LIVEKIT_API_KEY;
  const prevSecret = process.env.LIVEKIT_API_SECRET;
  const prevUrl = process.env.LIVEKIT_URL;
  process.env.LIVEKIT_API_KEY = 'test-livekit-key';
  process.env.LIVEKIT_API_SECRET = 'test-livekit-secret-1234567890abcdef';
  process.env.LIVEKIT_URL = 'wss://livekit.example.com';

  const groupId = String(new Types.ObjectId());
  const panelId = String(new Types.ObjectId());
  const otherPanelId = String(new Types.ObjectId());
  const dmConverseId = String(new Types.ObjectId());
  const memberId = String(new Types.ObjectId());
  const peerMemberId = String(new Types.ObjectId());
  const outsiderId = String(new Types.ObjectId());

  const { broker, service } = createTestServiceBroker<LivekitService>(
    LivekitService,
    {
      contextCallMockFn(actionName, params) {
        if (actionName === 'group.getGroupInfo') {
          if (params.groupId === groupId) {
            return {
              _id: groupId,
              members: [
                { userId: memberId, roles: [] },
                { userId: peerMemberId, roles: [] },
              ],
              panels: [{ id: panelId, type: 1 }],
            };
          }
          return null;
        }
        if (actionName === 'chat.converse.findConverseInfo') {
          if (
            params.converseId === dmConverseId &&
            [memberId, peerMemberId].includes(this.meta.userId)
          ) {
            return {
              _id: dmConverseId,
              members: [memberId, peerMemberId],
            };
          }
          throw new NoPermissionError('没有获取会话信息权限');
        }
        if (actionName === 'gateway.checkUserOnline') {
          return (params.userIds as string[]).map(() => true);
        }
      },
    }
  );

  afterAll(() => {
    if (prevKey === undefined) delete process.env.LIVEKIT_API_KEY;
    else process.env.LIVEKIT_API_KEY = prevKey;
    if (prevSecret === undefined) delete process.env.LIVEKIT_API_SECRET;
    else process.env.LIVEKIT_API_SECRET = prevSecret;
    if (prevUrl === undefined) delete process.env.LIVEKIT_URL;
    else process.env.LIVEKIT_URL = prevUrl;
  });

  test('generateToken enforces group and DM membership', async () => {
    const groupRoom = `${groupId}#${panelId}`;
    const res: any = await broker.call(
      'plugin:com.msgbyte.livekit.generateToken',
      { roomName: groupRoom },
      { meta: { userId: memberId, user: { nickname: 'member' } } }
    );
    expect(res.identity).toBe(memberId);
    expect(typeof res.accessToken).toBe('string');

    await expect(
      broker.call(
        'plugin:com.msgbyte.livekit.generateToken',
        { roomName: groupRoom },
        { meta: { userId: outsiderId, user: { nickname: 'outsider' } } }
      )
    ).rejects.toThrow(NoPermissionError);

    await expect(
      broker.call(
        'plugin:com.msgbyte.livekit.generateToken',
        { roomName: `${groupId}#${otherPanelId}` },
        { meta: { userId: memberId, user: { nickname: 'member' } } }
      )
    ).rejects.toThrow(NoPermissionError);

    const dmRes: any = await broker.call(
      'plugin:com.msgbyte.livekit.generateToken',
      { roomName: dmConverseId },
      { meta: { userId: memberId, user: { nickname: 'member' } } }
    );
    expect(dmRes.identity).toBe(memberId);

    await expect(
      broker.call(
        'plugin:com.msgbyte.livekit.generateToken',
        { roomName: dmConverseId },
        { meta: { userId: outsiderId, user: { nickname: 'outsider' } } }
      )
    ).rejects.toThrow(NoPermissionError);
  });

  test('roomMembers rejects non-members', async () => {
    await expect(
      broker.call(
        'plugin:com.msgbyte.livekit.roomMembers',
        { roomName: `${groupId}#${panelId}` },
        { meta: { userId: outsiderId } }
      )
    ).rejects.toThrow(NoPermissionError);
  });

  test('inviteCall filters out non-members of the room', async () => {
    const res: any = await broker.call(
      'plugin:com.msgbyte.livekit.inviteCall',
      {
        roomName: dmConverseId,
        targetUserIds: [peerMemberId, outsiderId],
      },
      { meta: { userId: memberId } }
    );
    expect(res.online).toEqual([peerMemberId]);
    expect(res.offline).toEqual([]);
  });

  test('webhook is not published externally', () => {
    expect((service.schema.actions['webhook'] as any)?.visibility).toBe(
      'public'
    );
    expect(service.getActionList().map((a) => a.name)).not.toContain('webhook');
  });
});
