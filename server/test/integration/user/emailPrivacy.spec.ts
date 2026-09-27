import http from 'http';
import type { AddressInfo } from 'net';
import jwt from 'jsonwebtoken';
import { ApiGatewayMixin, config, TcBroker } from 'tailchat-server-sdk';
import UserModel from '../../../models/user/user';
import UserService from '../../../services/core/user/user.service';
import GatewayService from '../../../services/core/gateway.service';

describe('user email privacy through the gateway and shared cache', () => {
  const broker = new TcBroker({ logger: false, cacher: 'Memory' });
  const originalMongoUrl = config.mongoUrl;
  config.mongoUrl = 'mongodb://127.0.0.1:1/email-privacy-test';
  const service = broker.createService(UserService) as UserService;
  config.mongoUrl = originalMongoUrl;

  const alice = new UserModel({
    _id: '507f1f77bcf86cd799439011',
    email: 'alice@example.invalid',
    nickname: 'Alice',
    discriminator: '0001',
    password: 'private-password-hash',
  });
  const bob = new UserModel({
    _id: '507f1f77bcf86cd799439012',
    email: 'bob@example.invalid',
    nickname: 'Bob',
    discriminator: '0002',
  });
  const users = [alice, bob];
  const tokens = users.map((user) =>
    jwt.sign({ _id: String(user._id) }, config.secret)
  );
  const findById = jest.fn(
    async (id) => users.find((user) => String(user._id) === String(id)) ?? null
  );

  // Replace database I/O only; keep real actions, serialization, auth and caching.
  service.adapter.connect = jest.fn().mockResolvedValue(undefined);
  service.adapter.disconnect = jest.fn().mockResolvedValue(undefined);
  service.adapter.findById = findById;
  service.adapter.findOne = jest.fn(
    async ({ nickname, discriminator }) =>
      users.find(
        (user) =>
          user.nickname === nickname && user.discriminator === discriminator
      ) ?? null
  );
  jest
    .spyOn(service.adapter.model, 'findById')
    .mockImplementation((id) => findById(id) as any);

  const gateway = broker.createService({
    name: 'gateway',
    mixins: [ApiGatewayMixin],
    settings: {
      port: 0,
      ip: '127.0.0.1',
      routes: [
        {
          ...GatewayService.prototype.getRoutes.call({})[0],
          aliases: {
            'POST /user/profileAlias': 'user.getUserInfo',
            'POST /user/optionalIdentity': 'gateway.optionalIdentity',
            'POST /user/whitelistedOptionalIdentity':
              'gateway.optionalIdentity',
            'POST /user/requiredIdentity': 'gateway.requiredIdentity',
            'POST /user/anonymousIdentity': 'gateway.requiredIdentity',
          },
        },
      ],
      logRequestParams: null,
      logResponseData: null,
    },
    methods: {
      authorize: GatewayService.prototype.authorize,
      getAuthWhitelist: GatewayService.prototype.getAuthWhitelist,
    },
    actions: {
      getUserSocketToken: () => [],
      tickUser: () => undefined,
      optionalIdentity: {
        optionalAuth: true,
        handler: (ctx) => ctx.meta.userId ?? null,
      },
      requiredIdentity: (ctx) => ctx.meta.userId ?? null,
    },
    created() {
      this.authWhitelist = [
        '/user/anonymousIdentity',
        '/user/whitelistedOptionalIdentity',
      ];
    },
  });

  async function request(action: string, params: object, token?: string) {
    const { port } = gateway.server.address() as AddressInfo;
    return new Promise<{ status: number; body: any }>((resolve, reject) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          path: `/api/user/${action}`,
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            ...(token === undefined ? {} : { 'x-token': token }),
          },
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => {
            body += chunk;
          });
          res.on('end', () =>
            resolve({ status: res.statusCode, body: JSON.parse(body) })
          );
        }
      );
      req.on('error', reject);
      req.end(JSON.stringify(params));
    });
  }

  beforeAll(() => broker.start());
  beforeEach(async () => {
    await broker.cacher.clean('**');
    findById.mockClear();
  });
  afterAll(async () => {
    await broker.stop();
    jest.restoreAllMocks();
  });

  test.each([
    [0, 1, undefined, 0],
    [undefined, 1, 0, 1],
  ])(
    'only the owner gets email regardless of cache order (%j)',
    async (...viewers) => {
      for (const viewer of viewers) {
        const { status, body } = await request(
          'getUserInfo',
          {
            userId: String(alice._id),
          },
          tokens[viewer]
        );
        expect(status).toBe(200);
        expect(body.data).toHaveProperty('nickname', 'Alice');
        expect(body.data).not.toHaveProperty('password');
        if (viewer === 0) {
          expect(body.data).toHaveProperty('email', alice.email);
        } else {
          expect(body.data).not.toHaveProperty('email');
        }
      }
    }
  );

  test('batch and search preserve only the requesting user email', async () => {
    const { status, body } = await request(
      'getUserInfoList',
      {
        userIds: users.map((user) => String(user._id)),
      },
      tokens[0]
    );
    expect(status).toBe(200);
    expect(body.data[0]).toHaveProperty('email', alice.email);
    expect(body.data[1]).not.toHaveProperty('email');

    for (const user of users) {
      const result = await request(
        'searchUserWithUniqueName',
        {
          uniqueName: `${user.nickname}#${user.discriminator}`,
        },
        tokens[0]
      );
      expect(result.status).toBe(200);
      expect(result.body.data).not.toHaveProperty('password');
      if (user === alice) {
        expect(result.body.data).toHaveProperty('email', alice.email);
      } else {
        expect(result.body.data).not.toHaveProperty('email');
      }
    }
  });

  test('old public cache entries cannot bypass email filtering', async () => {
    await broker.cacher.set(`user.getUserInfo:${alice._id}`, {
      _id: String(alice._id),
      email: alice.email,
    });
    const result = await request('getUserInfo', { userId: String(alice._id) });
    expect(result.status).toBe(200);
    expect(result.body.data).not.toHaveProperty('email');
    expect(result.body.data).toHaveProperty('nickname', 'Alice');
  });

  test('anonymous batch queries omit every email and missing users stay null', async () => {
    const result = await request('getUserInfoList', {
      userIds: users.map((user) => String(user._id)),
    });
    expect(result.status).toBe(200);
    expect(result.body.data).toHaveLength(2);
    for (const user of result.body.data) {
      expect(user).not.toHaveProperty('email');
    }

    const missing = await request('getUserInfo', {
      userId: '507f1f77bcf86cd799439099',
    });
    expect(missing.status).toBe(200);
    expect(missing.body.data).toBeNull();
  });

  test('profile edits invalidate the shared profile cache', async () => {
    const params = { userId: String(alice._id) };
    await request('getUserInfo', params, tokens[0]);
    const update = jest
      .spyOn(service.adapter.model, 'findOneAndUpdate')
      .mockReturnValueOnce({ exec: async () => alice } as any);
    try {
      alice.nickname = 'Updated Alice';
      const result = await request(
        'updateUserField',
        {
          fieldName: 'nickname',
          fieldValue: alice.nickname,
        },
        tokens[0]
      );
      expect(result.status).toBe(200);
      expect(result.body.data).toHaveProperty('email', alice.email);
      const profile = await request('getUserInfo', params);
      expect(profile.body.data).toHaveProperty('nickname', 'Updated Alice');
      expect(profile.body.data).not.toHaveProperty('email');
    } finally {
      alice.nickname = 'Alice';
      update.mockRestore();
    }
  });

  test('administrative updates invalidate the shared profile cache', async () => {
    const params = { userId: String(alice._id) };
    await request('getUserInfo', params);
    const update = jest
      .spyOn(service.adapter.model, 'updateOne')
      .mockImplementationOnce(() => {
        alice.banned = true;
        return Promise.resolve({}) as any;
      });
    try {
      await broker.call('user.banUser', params);
      const result = await request('getUserInfo', params);
      expect(result.body.data).toHaveProperty('banned', true);
      expect(result.body.data).not.toHaveProperty('email');
    } finally {
      alice.banned = false;
      update.mockRestore();
    }
  });

  test('invalid tokens cannot establish identity on anonymous profile endpoints', async () => {
    const result = await request(
      'getUserInfo',
      {
        userId: String(alice._id),
      },
      'invalid-token'
    );
    expect(result.status).toBe(401);
  });

  test('profile aliases use the same optional authentication policy', async () => {
    const params = { userId: String(alice._id) };
    const anonymous = await request('profileAlias', params);
    expect(anonymous.status).toBe(200);
    expect(anonymous.body.data).not.toHaveProperty('email');

    const owner = await request('profileAlias', params, tokens[0]);
    expect(owner.status).toBe(200);
    expect(owner.body.data).toHaveProperty('email', alice.email);
  });

  test.each([
    ['optionalIdentity', undefined, 200, null],
    ['optionalIdentity', tokens[0], 200, String(alice._id)],
    ['optionalIdentity', 'invalid-token', 401, undefined],
    ['whitelistedOptionalIdentity', undefined, 200, null],
    ['whitelistedOptionalIdentity', tokens[0], 200, String(alice._id)],
    ['whitelistedOptionalIdentity', 'invalid-token', 401, undefined],
    ['requiredIdentity', undefined, 401, undefined],
    ['requiredIdentity', tokens[0], 200, String(alice._id)],
    ['requiredIdentity', 'invalid-token', 401, undefined],
    ['anonymousIdentity', undefined, 200, null],
    ['anonymousIdentity', tokens[0], 200, null],
    ['anonymousIdentity', 'invalid-token', 200, null],
  ])(
    'authentication policy for %s (%#)',
    async (action, token, status, userId) => {
      const result = await request(action, {}, token);
      expect(result.status).toBe(status);
      if (status === 200) {
        expect(result.body.data).toBe(userId);
      }
    }
  );

  test('internal profile access is available to services but blocked over HTTP', async () => {
    const params = { userId: String(alice._id) };
    const user = await broker.call('user.getUserInfoInternal', params);
    expect(user).toHaveProperty('email', alice.email);
    const result = await request('getUserInfoInternal', params, tokens[1]);
    expect(result.status).toBe(404);

    const token = await broker.call<string, typeof params>(
      'user.signUserToken',
      params
    );
    expect(jwt.verify(token, config.secret)).toHaveProperty(
      'email',
      alice.email
    );
  });
});
