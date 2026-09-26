import Redis from 'ioredis';
import { randomBytes } from 'crypto';
import UserService from '../../../services/core/user/user.service';

describe('registration IP quota', () => {
  let redis: Redis.Redis;
  let prefix: string;
  const createService = () => {
    const service = Object.create(UserService.prototype);
    service.broker = { cacher: { client: redis, prefix }, namespace: 'test' };
    service.validateEntity = jest.fn();
    service.validateRegisterParams = jest.fn();
    service.hashPassword = jest.fn();
    service.adapter = {
      model: { generateDiscriminator: jest.fn() },
      insert: jest.fn().mockResolvedValue({ _id: 'test' }),
    };
    service.recordUserLoginMeta = jest.fn();
    service.transformDocuments = jest.fn();
    service.transformEntity = jest.fn();
    service.entityChanged = jest.fn();
    return service;
  };
  const register = (service: UserService, ip = '203.0.113.1', guest = false) =>
    service[guest ? 'createTemporaryUser' : 'register']({
      params: { nickname: 'test', username: 'test', password: 'test' },
      meta: { ip, t: (message: string) => message },
    } as any);

  beforeAll(async () => {
    if (!process.env.REDIS_URL) throw new Error('REDIS_URL is required');
    redis = new Redis(process.env.REDIS_URL);
    await redis.ping();
  });
  beforeEach(() => {
    prefix = `registration-test:${randomBytes(8).toString('hex')}:`;
  });
  afterEach(async () => {
    const keys = await redis.keys(`${prefix}*`);
    if (keys.length) await redis.del(...keys);
  });
  afterAll(async () => {
    await redis.quit();
  });

  test('shares quota across normal/guest registration and service instances under concurrency', async () => {
    const first = createService();
    const second = createService();
    const results = await Promise.allSettled(
      Array.from({ length: 20 }, (_, i) =>
        register(i % 2 ? first : second, '203.0.113.1', i % 2 === 0)
      )
    );
    expect(
      results.filter((result) => result.status === 'fulfilled')
    ).toHaveLength(3);
    const errors = results.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected'
    );
    expect(errors).toHaveLength(17);
    errors.forEach(({ reason }) => {
      expect(reason.code).toBe(429);
      expect(reason.data.retryAfterMs).toBeGreaterThan(0);
    });
    expect(
      first.adapter.insert.mock.calls.length +
        second.adapter.insert.mock.calls.length
    ).toBe(3);
    await expect(register(first, '203.0.113.2')).resolves.toBeUndefined();
    await expect(register(first, '::ffff:203.0.113.1')).rejects.toMatchObject({
      code: 429,
    });
  });

  test('retains the daily cap when hourly slots expire and bounds key TTLs', async () => {
    const service = createService();
    for (let batch = 0; batch < 4; batch++) {
      for (let i = 0; i < (batch === 3 ? 1 : 3); i++) await register(service);
      const keys = await redis.keys(`${prefix}*`);
      for (const key of keys) {
        const ttl = await redis.pttl(key);
        expect(ttl).toBeGreaterThan(0);
        expect(ttl).toBeLessThanOrEqual(86400000);
        if (key.endsWith(':3600:3')) {
          // Move entries beyond the rolling hour without changing the application clock.
          const [seconds] = await redis.time();
          for (const member of await redis.zrange(key, 0, -1)) {
            await redis.zadd(key, Number(seconds) * 1000 - 3600001, member);
          }
        }
      }
    }
    await expect(register(service)).rejects.toMatchObject({
      code: 429,
      data: { windowSeconds: 86400 },
    });
    expect(service.adapter.insert).toHaveBeenCalledTimes(10);
  });

  test('fails closed before hashing or writing when IP or Redis is unavailable', async () => {
    for (const guest of [false, true]) {
      const service = createService();
      await expect(register(service, '', guest)).rejects.toMatchObject({
        code: 503,
      });
      service.broker.cacher.client = {
        status: 'ready',
        eval: jest.fn().mockRejectedValue(new Error('offline')),
      };
      await expect(
        register(service, '203.0.113.1', guest)
      ).rejects.toMatchObject({ code: 503 });
      service.broker.cacher = undefined;
      await expect(
        register(service, '203.0.113.1', guest)
      ).rejects.toMatchObject({ code: 503 });
      expect(service.hashPassword).not.toHaveBeenCalled();
      expect(service.adapter.insert).not.toHaveBeenCalled();
    }
  });
});
