import got from 'got';
import type { AddressInfo } from 'net';
import { ApiGatewayMixin, TcBroker } from 'tailchat-server-sdk';
import ApiService from '../../../services/core/gateway.service';
import FriendService from '../../../services/core/user/friend.service';
import FriendRequestService from '../../../services/core/user/friendRequest.service';

// OAuth is unused here; its Axios ESM entry is incompatible with Jest 27.
jest.mock('../../../packages/sdk/node_modules/axios', () => ({}));

const request = {
  _id: '000000000000000000000001',
  from: '000000000000000000000002',
  to: '000000000000000000000003',
};
const buildFriendRelation = jest.fn().mockResolvedValue(undefined);
const removeRequest = jest.fn().mockResolvedValue(undefined);

// Keep routing and service actions real; replace only database access.
class TestFriendService extends FriendService {
  onInit() {
    this.registerLocalDb = () => {
      this.adapter = { model: { buildFriendRelation } } as any;
    };
    super.onInit();
  }
}

class TestFriendRequestService extends FriendRequestService {
  onInit() {
    this.registerLocalDb = () => {
      this.adapter = {
        findById: async () => request,
        removeById: removeRequest,
      } as any;
    };
    super.onInit();
  }
}

class TestGateway extends ApiService {
  onInit() {
    this.registerMixin(ApiGatewayMixin);
    this.registerSetting('port', 0);
    this.registerSetting('ip', '127.0.0.1');
    this.registerSetting('routes', [this.getRoutes()[0]]);
    this.registerSetting('log4XXResponses', false);
    this.registerMethod('authorize', this.authorize);
    this.registerAction('notify', () => {}, { visibility: 'public' });
  }
}

describe('Friend relation action visibility', () => {
  const options = {
    logger: false as const,
    namespace: 'friend-visibility-test',
    transporter: 'Fake',
    requestTimeout: 2000,
  };
  const worker = new TcBroker({ ...options, nodeID: 'friend-worker' });
  const gatewayBroker = new TcBroker({ ...options, nodeID: 'friend-gateway' });
  const friend = worker.createService(TestFriendService) as TestFriendService;
  gatewayBroker.createService(TestFriendRequestService);
  gatewayBroker.createService({
    name: 'user',
    actions: {
      resolveToken: () => ({ _id: request.to, nickname: 'Test recipient' }),
    },
  });
  const gateway = gatewayBroker.createService(TestGateway);
  let api: typeof got;

  beforeAll(async () => {
    await Promise.all([worker.start(), gatewayBroker.start()]);
    await gatewayBroker.waitForServices('friend', 3000);
    await worker.waitForServices('gateway', 3000);
    const { port } = gateway.server.address() as AddressInfo;
    api = got.extend({
      prefixUrl: `http://127.0.0.1:${port}/api/`,
      headers: { 'x-token': 'test-token' },
      throwHttpErrors: false,
      retry: 0,
      timeout: 3000,
    });
  });
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => Promise.all([gatewayBroker.stop(), worker.stop()]));

  test('rejects direct HTTP creation without writing a friend relation', async () => {
    const response = await api.post('friend/buildFriendRelation', {
      json: { user1: request.from, user2: request.to },
    });

    expect(response.statusCode).toBe(404);
    expect(buildFriendRelation).not.toHaveBeenCalled();
  });

  test('accepting a request still creates the relation on another node', async () => {
    const response = await api.post('friend/request/accept', {
      json: { requestId: request._id },
    });

    expect(response.statusCode).toBe(200);
    expect(buildFriendRelation).toHaveBeenCalledWith(request.from, request.to);
    expect(removeRequest).toHaveBeenCalledWith(request._id);
  });

  test('omits the internal action from the generated API action list', () => {
    expect(friend.getActionList().map((action) => action.name)).not.toContain(
      'buildFriendRelation'
    );
  });
});
