import http from 'http';
import { Readable } from 'stream';
import type { AddressInfo } from 'net';
import jwt from 'jsonwebtoken';
import {
  ApiGatewayMixin,
  config,
  TcBroker,
  TcMinioService,
} from 'tailchat-server-sdk';
import { TcHealth } from '../../../mixins/health.mixin';
import { TcSocketIOService } from '../../../mixins/socketio.mixin';
import ApiService from '../../../services/core/gateway.service';
import UserService from '../../../services/core/user/user.service';
import FileService from '../../../services/core/file.service';
import ConfigService from '../../../services/core/config.service';
import GroupService from '../../../services/core/group/group.service';
import MailService from '../../../services/core/user/mail.service';
import OpenAppService from '../../../services/openapi/app.service';
import OpenBotService from '../../../services/openapi/bot.service';
import UserModel from '../../../models/user/user';

const regularUser = new UserModel({
  _id: '507f1f77bcf86cd799439011',
  email: 'regular@example.invalid',
  nickname: 'RegularUser',
  discriminator: '0001',
  password: 'hashed-password',
});

const minioClientMock = {
  listBuckets: jest.fn(async () => [{ name: 'tailchat' }]),
  fGetObject: jest.fn(),
  fPutObject: jest.fn(),
  getObject: jest.fn(async () => Readable.from(['<script>alert(1)</script>'])),
  statObject: jest.fn(async () => ({ size: 12, metaData: {} })),
  removeObject: jest.fn(async () => undefined),
  putObject: jest.fn(async (_bucket, _name, stream: Readable) => {
    for await (const _chunk of stream) {
      // drain
    }
    return { etag: 'mock-etag' };
  }),
  copyObject: jest.fn(async () => ({ etag: 'mock-etag' })),
};

const fileSaveStreamSpy = jest.fn(async (ctx, filename, stream: Readable) => {
  for await (const _chunk of stream) {
    // drain upload stream
  }
  return {
    etag: 'mock-etag',
    objectName: `files/${ctx.meta.userId}/mock-etag.txt`,
    url: `/static/files/${ctx.meta.userId}/mock-etag.txt`,
  };
});

const userUpdateOneSpy = jest.fn(async () => ({ modifiedCount: 1 }));
const configSetClientSpy = jest.fn(async () => ({}));
const mailSendSpy = jest.fn(async () => ({}));

class TestUserService extends UserService {
  onInit() {
    this.registerLocalDb = () => {
      this.adapter = {
        model: {
          findById: async (id: string) =>
            String(id) === String(regularUser._id) ? regularUser : null,
          updateOne: userUpdateOneSpy,
        },
        findById: async (id: string) =>
          String(id) === String(regularUser._id) ? regularUser : null,
      } as any;
      this.transformDocuments = (async (_ctx, _params, doc) => {
        if (!doc) {
          return doc;
        }
        const json = doc.toJSON ? doc.toJSON() : { ...doc };
        if (json._id !== undefined) {
          json._id = String(json._id);
        }
        return json;
      }) as any;
    };
    super.onInit();
  }
}

class TestFileService extends FileService {
  onInit() {
    this.registerLocalDb = () => {
      this.adapter = {
        model: {
          updateOne: jest.fn(async () => ({})),
          deleteMany: jest.fn(async () => ({})),
        },
      } as any;
    };
    const origRegisterMixin = this.registerMixin.bind(this);
    this.registerMixin = (mixin) => {
      if (mixin === TcMinioService) {
        origRegisterMixin({
          ...TcMinioService,
          methods: {
            ...TcMinioService.methods,
            createMinioClient() {
              return minioClientMock;
            },
            ping() {
              return Promise.resolve(true);
            },
          },
        });
      } else {
        origRegisterMixin(mixin);
      }
    };
    super.onInit();
    this.registerSetting('minioHealthCheckInterval', 0);
  }

  async onInited() {
    // Skip bucket bootstrap in unit test
  }

  saveFileStream = fileSaveStreamSpy as any;
}

class TestConfigService extends ConfigService {
  onInit() {
    this.registerLocalDb = () => {
      this.adapter = {
        model: {
          getAllClientPersistConfig: jest.fn(async () => ({})),
          setClientPersistConfig: configSetClientSpy,
        },
      } as any;
    };
    this.cleanActionCache = jest.fn(async () => undefined);
    super.onInit();
  }
}

class TestGroupService extends GroupService {
  onInit() {
    this.registerLocalDb = () => {
      this.adapter = { model: {} } as any;
    };
    super.onInit();
  }
}

class TestMailService extends MailService {
  onInit() {
    this.registerLocalDb = () => {
      this.adapter = {
        model: {
          verifyMailService: jest.fn(async () => false),
          sendMail: mailSendSpy,
        },
      } as any;
    };
    super.onInit();
  }

  onInited() {
    // Skip SMTP check
  }
}

class TestOpenAppService extends OpenAppService {
  onInit() {
    this.registerLocalDb = () => {
      this.adapter = { model: {} } as any;
    };
    super.onInit();
  }
}

class TestGatewayService extends ApiService {
  onInit() {
    const socketSchema = TcSocketIOService({
      userAuth: async () => null,
    });
    this.registerMixin(ApiGatewayMixin);
    this.registerMixin({
      actions: socketSchema.actions,
    });
    this.registerMixin(TcHealth());
    this.registerSetting('port', 0);
    this.registerSetting('ip', '127.0.0.1');
    this.registerSetting('routes', this.getRoutes());
    this.registerSetting('log4XXResponses', false);
    this.registerSetting('logRequestParams', null);
    this.registerSetting('logResponseData', null);
    this.registerMethod('authorize', this.authorize);
  }
}

describe('Gateway access control against real service action schemas', () => {
  const broker = new TcBroker({ logger: false, cacher: 'Memory' });
  let gateway: TestGatewayService;
  let fileService: TestFileService;
  const originalStorage = { ...config.storage };
  try {
    config.storage.minioUrl = '127.0.0.1:9000';
    config.storage.user = 'test';
    config.storage.pass = 'test';

    gateway = broker.createService(TestGatewayService) as TestGatewayService;
    fileService = broker.createService(TestFileService) as TestFileService;
    broker.createService(TestUserService);
    broker.createService(TestConfigService);
    broker.createService(TestGroupService);
    broker.createService(TestMailService);
    broker.createService(TestOpenAppService);
    broker.createService(OpenBotService);
  } finally {
    config.storage.minioUrl = originalStorage.minioUrl;
    config.storage.user = originalStorage.user;
    config.storage.pass = originalStorage.pass;
  }

  const userToken = jwt.sign({ _id: String(regularUser._id) }, config.secret);

  function httpRequest(options: {
    method: string;
    path: string;
    headers?: Record<string, string>;
    body?: string;
  }): Promise<{
    status: number;
    headers: http.IncomingHttpHeaders;
    rawBody: string;
    json: any;
  }> {
    const { port } = gateway.server.address() as AddressInfo;
    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          method: options.method,
          path: options.path,
          headers: options.headers,
        },
        (res) => {
          let rawBody = '';
          res.on('data', (chunk) => {
            rawBody += chunk;
          });
          res.on('end', () => {
            let json: any = null;
            try {
              json = JSON.parse(rawBody);
            } catch {
              // non-json response (e.g. /static)
            }
            resolve({
              status: res.statusCode ?? 0,
              headers: res.headers,
              rawBody,
              json,
            });
          });
        }
      );
      req.on('error', reject);
      if (options.body !== undefined) {
        req.write(options.body);
      }
      req.end();
    });
  }

  beforeAll(() => broker.start());
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => broker.stop());

  test.each([
    // MinIO raw actions (visibility: 'private') + file service actions (excluded from /api)
    [
      'POST',
      '/api/file/fPutObject',
      { bucketName: 'tailchat', objectName: 'x', filePath: '/etc/passwd' },
    ],
    [
      'POST',
      '/api/file/fGetObject',
      { bucketName: 'tailchat', objectName: 'x', filePath: '/tmp/pwn' },
    ],
    ['POST', '/api/file/listBuckets', {}],
    [
      'POST',
      '/api/file/removeObject',
      { bucketName: 'tailchat', objectName: 'files/victim/a.png' },
    ],
    ['POST', '/api/file/delete', { objectName: 'files/victim/a.png' }],
    [
      'POST',
      '/api/file/saveFileWithUrl',
      { fileUrl: 'https://example.com/a.png' },
    ],
    ['POST', '/api/file/get', { objectName: 'files/victim/a.html' }],
    ['POST', '/api/file/stat', { objectName: 'files/victim/a.png' }],
    ['POST', '/api/file/save', {}],
    ['POST', '/api/file.save', {}],
    ['GET', '/api/file/save', undefined],
    // User internal actions (visibility: 'public')
    [
      'POST',
      '/api/user/generateUserToken',
      { userId: 'target', nickname: 'admin', email: 'a@b.c', avatar: '' },
    ],
    ['POST', '/api/user/signUserToken', { userId: String(regularUser._id) }],
    ['POST', '/api/user.signUserToken', { userId: String(regularUser._id) }],
    ['GET', `/api/user/signUserToken?userId=${regularUser._id}`, undefined],
    ['POST', '/api/user/banUser', { userId: String(regularUser._id) }],
    ['POST', '/api/user/unbanUser', { userId: String(regularUser._id) }],
    ['POST', '/api/user/ensurePluginBot', { botId: 'x', nickname: 'x' }],
    ['POST', '/api/user/ensureOpenapiBot', { botId: 'x', nickname: 'x' }],
    ['POST', '/api/user/findOpenapiBotId', { email: 'x@openapi.msgbyte.com' }],
    [
      'POST',
      '/api/user/getUserInfoInternal',
      { userId: String(regularUser._id) },
    ],
    ['POST', '/api/user/findUserByEmail', { email: regularUser.email }],
    ['POST', '/api/user/findUserByUsername', { username: 'admin' }],
    // Config internal actions (visibility: 'public')
    ['POST', '/api/config/set', { key: 'evil', value: true }],
    [
      'POST',
      '/api/config/addToSet',
      { key: '$gatewayAfterHooks.user.login', value: 'evil.action' },
    ],
    [
      'POST',
      '/api/config/setClientConfig',
      { key: 'serverName', value: 'pwned' },
    ],
    ['POST', '/api/config/all', {}],
    ['POST', '/api/config/get', { key: 'panelFeature' }],
    // Gateway internal actions (visibility: 'public')
    ['GET', '/api/gateway/list-aliases?withActionSchema=true', undefined],
    ['POST', '/api/gateway/listAliases', { withActionSchema: true }],
    ['POST', '/api/gateway/addRoute', { route: { path: '/pwn' } }],
    ['POST', '/api/gateway/removeRoute', { path: '/api' }],
    [
      'POST',
      '/api/gateway/joinRoom',
      { roomIds: ['secret-room'], userId: String(regularUser._id) },
    ],
    [
      'POST',
      '/api/gateway/leaveRoom',
      { roomIds: ['secret-room'], userId: String(regularUser._id) },
    ],
    [
      'POST',
      '/api/gateway/fetchUserSocketIds',
      { userId: String(regularUser._id) },
    ],
    [
      'POST',
      '/api/gateway/getUserSocketToken',
      { userId: String(regularUser._id) },
    ],
    ['POST', '/api/gateway/tickUser', { userId: String(regularUser._id) }],
    [
      'POST',
      '/api/gateway/notify',
      { type: 'broadcast', eventName: 'x', eventData: {} },
    ],
    // Group, mail & openapi internal actions (visibility: 'public')
    [
      'POST',
      '/api/group/getGroupInfo',
      { groupId: '507f1f77bcf86cd799439022' },
    ],
    [
      'POST',
      '/api/group/addMember',
      { groupId: '507f1f77bcf86cd799439022', userId: String(regularUser._id) },
    ],
    ['POST', '/api/group/joinGroup', { groupId: '507f1f77bcf86cd799439022' }],
    [
      'POST',
      '/api/group/getUserAllPermissions',
      { groupId: '507f1f77bcf86cd799439022', userId: String(regularUser._id) },
    ],
    [
      'POST',
      '/api/group/getGroupLobbyConverseId',
      { groupId: '507f1f77bcf86cd799439022' },
    ],
    [
      'POST',
      '/api/mail/sendMail',
      { to: 'victim@example.com', subject: 'hi', html: 'hi' },
    ],
    ['POST', '/api/openapi/app/authToken', { appId: 'tc_1', token: 'abc' }],
    ['POST', '/api/openapi/bot/getOrCreateBotAccount', { appId: 'tc_1' }],
  ])(
    'rejects %s %s for an authenticated normal user with 404 ServiceNotFoundError',
    async (method, path, payload) => {
      const res = await httpRequest({
        method,
        path,
        headers: {
          'x-token': userToken,
          ...(payload !== undefined
            ? { 'content-type': 'application/json' }
            : {}),
        },
        body: payload !== undefined ? JSON.stringify(payload) : undefined,
      });

      expect(res.status).toBe(404);
      expect(res.json?.name).toBe('ServiceNotFoundError');
      expect(minioClientMock.fPutObject).not.toHaveBeenCalled();
      expect(minioClientMock.fGetObject).not.toHaveBeenCalled();
      expect(minioClientMock.removeObject).not.toHaveBeenCalled();
      expect(minioClientMock.getObject).not.toHaveBeenCalled();
      expect(minioClientMock.statObject).not.toHaveBeenCalled();
      expect(fileSaveStreamSpy).not.toHaveBeenCalled();
      expect(userUpdateOneSpy).not.toHaveBeenCalled();
      expect(configSetClientSpy).not.toHaveBeenCalled();
      expect(mailSendSpy).not.toHaveBeenCalled();
    }
  );

  test('rejects unauthenticated requests to /upload', async () => {
    const postNoToken = await httpRequest({
      method: 'POST',
      path: '/upload',
      body: 'hello',
    });
    expect(postNoToken.status).toBe(401);
    expect(postNoToken.json?.type).toBe('NO_TOKEN');

    const putNoToken = await httpRequest({
      method: 'PUT',
      path: '/upload',
      body: 'hello',
    });
    expect(putNoToken.status).toBe(401);
    expect(putNoToken.json?.type).toBe('NO_TOKEN');

    const putInvalidToken = await httpRequest({
      method: 'PUT',
      path: '/upload',
      headers: { 'x-token': 'invalid-token' },
      body: 'hello',
    });
    expect(putInvalidToken.status).toBe(401);
    expect(putInvalidToken.json?.type).toBe('INVALID_TOKEN');
    expect(fileSaveStreamSpy).not.toHaveBeenCalled();
  });

  test('allows authenticated normal user on published endpoints', async () => {
    const res = await httpRequest({
      method: 'POST',
      path: '/api/user/whoami',
      headers: {
        'x-token': userToken,
        'content-type': 'application/json',
      },
      body: '{}',
    });

    expect(res.status).toBe(200);
    expect(res.json?.data?.userId).toBe(String(regularUser._id));
  });

  test('allows authenticated uploads to /upload via PUT stream and POST multipart', async () => {
    const putRes = await httpRequest({
      method: 'PUT',
      path: '/upload',
      headers: { 'x-token': userToken },
      body: 'hello tailchat',
    });

    expect(putRes.status).toBe(200);
    expect(fileSaveStreamSpy).toHaveBeenCalledTimes(1);
    expect(fileSaveStreamSpy.mock.calls[0][0].meta.userId).toBe(
      String(regularUser._id)
    );

    const boundary = '----TailchatTestBoundary';
    const multipartBody = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="hello.txt"',
      'Content-Type: text/plain',
      '',
      'hello multipart',
      `--${boundary}--`,
      '',
    ].join('\r\n');
    const postRes = await httpRequest({
      method: 'POST',
      path: '/upload',
      headers: {
        'x-token': userToken,
        'content-type': `multipart/form-data; boundary=${boundary}`,
      },
      body: multipartBody,
    });

    expect(postRes.status).toBe(200);
    expect(fileSaveStreamSpy).toHaveBeenCalledTimes(2);
    expect(fileSaveStreamSpy.mock.calls[1][0].meta.userId).toBe(
      String(regularUser._id)
    );
  });

  test('keeps /static working via internal file.get while enforcing attachment headers', async () => {
    const htmlRes = await httpRequest({
      method: 'GET',
      path: '/static/files/u/xss.html',
    });
    expect(htmlRes.status).toBe(200);
    expect(htmlRes.headers['content-disposition']).toBe('attachment');
    expect(htmlRes.headers['x-content-type-options']).toBe('nosniff');
    expect(minioClientMock.getObject).toHaveBeenCalledWith(
      fileService.bucketName,
      'files/u/xss.html'
    );
  });

  test('marks file.save as disableSocket and omits internal file actions from published action list', () => {
    expect((fileService.schema.actions.save as any)?.disableSocket).toBe(true);
    const publishedFileActions = fileService.getActionList().map((a) => a.name);
    expect(publishedFileActions).not.toContain('get');
    expect(publishedFileActions).not.toContain('stat');
    expect(publishedFileActions).not.toContain('delete');
    expect(publishedFileActions).not.toContain('saveFileWithUrl');
    expect(publishedFileActions).not.toContain('fPutObject');
    expect(publishedFileActions).not.toContain('fGetObject');
  });
});
