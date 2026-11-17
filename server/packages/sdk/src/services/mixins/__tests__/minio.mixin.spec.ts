import { ServiceBroker } from 'moleculer';
import { TcMinioService } from '../minio.mixin';

describe('TcMinioService', () => {
  const broker = new ServiceBroker({ logger: false });
  const client = {
    listBuckets: jest.fn(async () => [{ name: 'tailchat' }]),
    fGetObject: jest.fn(),
    fPutObject: jest.fn(),
  };
  const service = broker.createService({
    name: 'file',
    mixins: [TcMinioService],
    settings: { minioHealthCheckInterval: 0 },
    methods: {
      // 不连接真实 minio
      createMinioClient() {
        return client;
      },
    },
  });

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  it('marks every raw object storage action as private', () => {
    for (const action of Object.values(TcMinioService.actions)) {
      expect((action as { visibility?: string }).visibility).toBe('private');
    }
  });

  it.each([
    ['listBuckets', {}],
    [
      'fGetObject',
      { bucketName: 'b', objectName: 'o', filePath: '/app/server/public/x.js' },
    ],
    [
      'fPutObject',
      { bucketName: 'b', objectName: 'o', filePath: '/etc/passwd' },
    ],
  ])('rejects %s called through the broker', async (name, params) => {
    await expect(broker.call(`file.${name}`, params)).rejects.toMatchObject({
      name: 'ServiceNotFoundError',
    });
  });

  it('keeps raw actions callable inside the service', async () => {
    await expect(service.actions.listBuckets({})).resolves.toEqual([
      { name: 'tailchat' },
    ]);
    expect(client.fGetObject).not.toHaveBeenCalled();
    expect(client.fPutObject).not.toHaveBeenCalled();
  });
});
