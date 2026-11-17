import http from 'http';
import { Readable } from 'stream';
import { TcBroker } from 'tailchat-server-sdk';
import ApiService from '../../../services/core/gateway.service';

const PORT = 28194;

function request(
  path: string,
  headers: Record<string, string> = {}
): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    http
      .get(`http://127.0.0.1:${PORT}${path}`, { headers }, (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        });
      })
      .on('error', reject);
  });
}

function requestHeaders(path: string): Promise<http.IncomingHttpHeaders> {
  return new Promise((resolve, reject) => {
    http
      .get(`http://127.0.0.1:${PORT}${path}`, (res) => {
        res.resume();
        res.on('end', () => resolve(res.headers));
      })
      .on('error', reject);
  });
}

describe('Test "gateway" service', () => {
  const broker = new TcBroker({ logger: false });
  const service = broker.createService(ApiService);
  service.settings.port = PORT;
  broker.createService({
    name: 'user',
    actions: {
      resolveToken: () => ({
        _id: 'test-user-id',
        nickname: 'test',
        email: '',
        avatar: '',
      }),
    },
  });
  broker.createService({
    name: 'file',
    actions: {
      get: () => Readable.from(['<script>alert(1)</script>']),
    },
  });
  const headers = { 'x-token': 'any' };

  beforeAll(async () => {
    await broker.start();
  });

  afterAll(async () => {
    await broker.stop();
  });

  test('should not expose moleculer internal actions to logged-in user', async () => {
    for (const action of ['options', 'list', 'services', 'actions', 'health']) {
      const res = await request(`/api/~node/${action}`, headers);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe('ServiceNotFoundError');
    }
  });

  test('should still expose published service actions', async () => {
    const res = await request('/api/gateway/health', headers);

    expect(res.status).toBe(200);
    expect(res.body.data.services).toEqual(
      expect.arrayContaining(['gateway', 'user'])
    );
  });

  test.each([
    'files/u/a.html',
    'files/u/a.svg',
    'files/u/noext',
    'files/u.dir/noext',
  ])('static %s is served as a download, not a page', async (objectName) => {
    const res = await requestHeaders(`/static/${objectName}`);

    expect(res['content-disposition']).toBe('attachment');
    expect(res['x-content-type-options']).toBe('nosniff');
  });

  test.each([
    ['files/u/a.png', 'image/png'],
    ['files/u/a.mp4', 'video/mp4'],
    ['files/u/a.jpg@1200w_630h', 'image/jpeg'],
    ['files/u/a.png&w=640&q=75', 'image/png'],
  ])('static %s is still shown inline', async (objectName, type) => {
    const res = await requestHeaders(`/static/${objectName}`);

    expect(res['content-type']).toBe(type);
    expect(res['content-disposition']).toBeUndefined();
  });

  test('health check route should still work without token', async () => {
    const res = await request('/health');

    expect(res.status).toBe(200);
    expect(res.body.services).toEqual(expect.arrayContaining(['gateway']));
  });
});
