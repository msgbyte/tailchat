import { Types } from 'mongoose';
import got from 'got';
import { NoPermissionError } from 'tailchat-server-sdk';
import { createTestServiceBroker } from '../../../test/utils';
import WxpusherService from '../services/wxpusher.service';

describe('Test "plugin:com.msgbyte.wxpusher" service', () => {
  const prevToken = process.env.WXPUSHER_APP_TOKEN;
  process.env.WXPUSHER_APP_TOKEN = 'test-wxpusher-token';

  const { broker, service } = createTestServiceBroker<WxpusherService>(
    WxpusherService,
    {
      brokerOptions: {
        cacher: 'Memory',
      },
    }
  );

  afterAll(() => {
    if (prevToken === undefined) {
      delete process.env.WXPUSHER_APP_TOKEN;
    } else {
      process.env.WXPUSHER_APP_TOKEN = prevToken;
    }
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await service.adapter.model.deleteMany({});
  });

  test('callback rejects forged raw userId in data.extra', async () => {
    const victimId = String(new Types.ObjectId());

    await expect(
      broker.call('plugin:com.msgbyte.wxpusher.callback', {
        action: 'app_subscribe',
        data: {
          extra: victimId,
          uid: 'UID_ATTACKER',
        },
      })
    ).rejects.toThrow(NoPermissionError);

    const record = await service.adapter.model.findOne({ userId: victimId });
    expect(record).toBeNull();
  });

  test('createQRCode issues single-use bind token that binds only the owning user', async () => {
    const userId = String(new Types.ObjectId());
    let capturedExtra: string | undefined;

    jest.spyOn(got, 'post').mockImplementation(((_url: any, options?: any) => {
      capturedExtra = options?.json?.extra;
      return {
        json: async () => ({
          code: 1000,
          data: { url: 'https://example.com' },
        }),
      };
    }) as any);

    await broker.call(
      'plugin:com.msgbyte.wxpusher.createQRCode',
      {},
      { meta: { userId } }
    );

    expect(capturedExtra).toBeDefined();
    expect(capturedExtra).not.toBe(userId);
    expect(capturedExtra).toMatch(/^[0-9a-f]{48}$/);

    // First callback succeeds and binds wxpusherUserId to userId
    await broker.call('plugin:com.msgbyte.wxpusher.callback', {
      action: 'app_subscribe',
      data: {
        extra: capturedExtra,
        uid: 'UID_LEGIT_USER',
      },
    });

    const record = await service.adapter.model.findOne({ userId });
    expect(record?.wxpusherUserId).toBe('UID_LEGIT_USER');

    // Replaying the same bind token is rejected
    await expect(
      broker.call('plugin:com.msgbyte.wxpusher.callback', {
        action: 'app_subscribe',
        data: {
          extra: capturedExtra,
          uid: 'UID_ATTACKER',
        },
      })
    ).rejects.toThrow(NoPermissionError);

    const recordAfter = await service.adapter.model.findOne({ userId });
    expect(recordAfter?.wxpusherUserId).toBe('UID_LEGIT_USER');
  });
});
