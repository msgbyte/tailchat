import { TcSocketIOService } from '../socketio.mixin';
import { io } from 'socket.io-client';
import { createTestUserToken } from '../../test/utils';
import { UserJWTPayload, TcBroker, ApiGatewayMixin } from 'tailchat-server-sdk';

require('dotenv').config();

const PORT = 28193;

async function createAndEmitMessage(
  eventName: string,
  eventData: unknown = {}
): Promise<any> {
  const socket = io(`http://localhost:${PORT}/`, {
    transports: ['websocket'],
    auth: {
      token: createTestUserToken(),
    },
  });

  await new Promise((resolve, reject) => {
    socket.on('connect', () => {
      resolve(null);
    });
    socket.on('connect_error', (err) => {
      reject(err);
    });
  });

  const res = await new Promise((resolve) => {
    socket.emit(eventName, eventData, (ret) => {
      resolve(ret);
    });
  });

  socket.close();

  return res;
}

describe('Testing "socketio.mixin"', () => {
  const broker = new TcBroker({ logger: false });
  const actionHandler1 = jest.fn();
  const actionHandler2 = jest.fn();
  const service = broker.createService({
    name: 'test',
    mixins: [
      ApiGatewayMixin,
      TcSocketIOService({
        async userAuth(token): Promise<UserJWTPayload> {
          return {
            _id: 'any some',
            nickname: '',
            email: '',
            avatar: '',
          };
        },
      }),
    ],
    settings: {
      port: PORT,
    },
    actions: {
      hello: actionHandler1,
      publicAction: {
        visibility: 'public',
        handler: actionHandler2,
      },
    },
  });

  beforeAll(async () => {
    await broker.start();
  });

  afterAll(async () => {
    await broker.stop();
  });

  test('actions should be ok', () => {
    expect(service.actions).toHaveProperty('joinRoom');
    expect(service.actions).toHaveProperty('leaveRoom');
    expect(service.actions).toHaveProperty('notify');
    expect(service.actions).toHaveProperty('checkUserOnline');
  });

  test('socketio should be call action', async () => {
    const res = await createAndEmitMessage('test.hello');

    expect(actionHandler1.mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(res).toEqual({ result: true });
  });

  test('socketio should not call non-published action', async () => {
    const res = await createAndEmitMessage('test.publicAction');

    expect(actionHandler2.mock.calls.length).toBe(0);
    expect(res).toEqual({
      result: false,
      message: "Service 'test.publicAction' is not found.",
    });
  });
});
