import jwt from 'jsonwebtoken';
import type { DocumentType } from '@typegoose/typegoose';
import { config, TcService, TcBroker } from 'tailchat-server-sdk';

interface TestServiceBrokerOptions {
  contextCallMockFn?: (actionName: string, params: any, opts?: any) => void;
}

type MockedService<T extends TcService> = T & {
  roomcastNotify: jest.Mock;
  cleanActionCache: jest.Mock;
};

/**
 * 常见一个测试微服务节点
 * @param serviceCls 微服务类
 */
export function createTestServiceBroker<T extends TcService = TcService>(
  serviceCls: typeof TcService,
  options?: TestServiceBrokerOptions
): {
  broker: TcBroker;
  contextCallMock: jest.Mock;
  service: MockedService<T>;
  insertTestData: <E, R extends E = E>(
    entity: E
  ) => Promise<DocumentType<R & { _id: string }>>;
} {
  const broker = new TcBroker({ logger: false });
  const service = broker.createService(serviceCls) as MockedService<T>;
  const testDataStack = [];
  const contextCallMock = jest.fn(options?.contextCallMockFn);

  broker.ContextFactory = class extends broker.ContextFactory {
    call = contextCallMock as any;
  } as any;

  // Mock
  service.roomcastNotify = jest.fn();
  service.cleanActionCache = jest.fn();

  beforeAll(async () => {
    await broker.start();
  });
  afterAll(async () => {
    await Promise.all(
      testDataStack.map((item) => {
        if (typeof service.adapter !== 'object') {
          throw new Error('无法调用 insertTestData');
        }

        return service.adapter.removeById(item._id);
      })
    )
      .then(() => {
        console.log(`已清理 ${testDataStack.length} 条测试数据`);
      })
      .catch((err) => {
        console.error('测试数据清理失败:', err);
      });

    await broker.stop();
  });

  const insertTestData = async (entity: any) => {
    if (typeof service.adapter !== 'object') {
      throw new Error('无法调用 insertTestData');
    }
    const doc = await service.adapter.insert(entity);
    testDataStack.push(doc);
    return doc;
  };

  return {
    broker,
    contextCallMock,
    service,
    insertTestData,
  };
}

/**
 * 创建用户Token
 */
export function createTestUserToken(
  user: {
    _id: string;
    username: string;
    email: string;
    avatar: string;
  } = {
    _id: '',
    username: 'test',
    email: 'test',
    avatar: '',
  }
): string {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
    config.secret,
    {
      expiresIn: '30d',
    }
  );
}
