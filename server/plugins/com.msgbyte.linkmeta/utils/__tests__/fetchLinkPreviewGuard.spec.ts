import dns from 'dns';
import http from 'http';
import type { AddressInfo } from 'net';
import { fetchLinkPreview } from '../fetchLinkPreview';

/**
 * 一个解析到内网地址的域名
 */
const INTERNAL_DOMAIN = 'internal.example.com';

describe('Test "fetchLinkPreview" private network guard', () => {
  const handler = jest.fn((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end('<html><head><title>INTERNAL-SECRET</title></head></html>');
  });
  const server = http.createServer(handler);
  let port: number;

  beforeAll((done) => {
    const lookup = dns.lookup;
    jest
      .spyOn(dns, 'lookup')
      .mockImplementation(((hostname: string, ...args: any[]) =>
        (lookup as any)(
          hostname === INTERNAL_DOMAIN ? '127.0.0.1' : hostname,
          ...args
        )) as any);

    server.listen(0, '127.0.0.1', () => {
      port = (server.address() as AddressInfo).port;
      done();
    });
  });

  afterAll((done) => {
    jest.restoreAllMocks();
    server.close(done);
  });

  test('should not fetch domain which resolves to private network', async () => {
    await expect(
      fetchLinkPreview(`http://${INTERNAL_DOMAIN}:${port}/a.html`)
    ).rejects.toThrow();

    expect(handler).not.toHaveBeenCalled();
  });
});
