import http from 'http';
import type { AddressInfo } from 'net';
import got from 'got';
import {
  isPrivateAddress,
  resolvePublicAddress,
  safeGotOptions,
} from '../safeRequest';

describe('safeRequest', () => {
  test.each([
    '127.0.0.1',
    '127.8.8.8',
    '0.0.0.0',
    '10.1.2.3',
    '172.16.0.1',
    '172.31.255.255',
    '192.168.1.1',
    '169.254.169.254', // 云厂商元数据服务
    '100.64.0.1',
    '224.0.0.1',
    '::',
    '::1',
    'fc00::1',
    'fd12:3456::1',
    'fe80::1',
    '::ffff:127.0.0.1',
    '::ffff:10.0.0.1',
    'not-an-ip',
  ])('isPrivateAddress("%s") should be true', (address) => {
    expect(isPrivateAddress(address)).toBe(true);
  });

  test.each([
    '8.8.8.8',
    '1.1.1.1',
    '172.15.255.255',
    '172.32.0.1',
    '192.169.0.1',
    '100.128.0.1',
    '2606:4700:4700::1111',
    '::ffff:8.8.8.8',
  ])('isPrivateAddress("%s") should be false', (address) => {
    expect(isPrivateAddress(address)).toBe(false);
  });

  test('resolvePublicAddress should return public ip', async () => {
    expect(await resolvePublicAddress('8.8.8.8')).toBe('8.8.8.8');
    expect(await resolvePublicAddress('[2606:4700:4700::1111]')).toBe(
      '2606:4700:4700::1111'
    );
  });

  test('resolvePublicAddress should reject private address', async () => {
    await expect(resolvePublicAddress('127.0.0.1')).rejects.toThrow();
    await expect(resolvePublicAddress('[::1]')).rejects.toThrow();
    await expect(resolvePublicAddress('localhost')).rejects.toThrow();
  });

  describe('got with safeGotOptions', () => {
    const handler = jest.fn((req, res) => {
      res.end('internal secret');
    });
    const server = http.createServer(handler);
    let port: number;

    beforeAll((done) => {
      server.listen(0, '127.0.0.1', () => {
        port = (server.address() as AddressInfo).port;
        done();
      });
    });

    afterAll((done) => {
      server.close(done);
    });

    test('local server is reachable without guard', async () => {
      const res = await got(`http://127.0.0.1:${port}/a.png`);

      expect(res.body).toBe('internal secret');
      handler.mockClear();
    });

    test('should refuse literal private ip', async () => {
      await expect(
        got(`http://127.0.0.1:${port}/a.png`, safeGotOptions)
      ).rejects.toThrow();
      expect(handler).not.toHaveBeenCalled();
    });

    test('should refuse hostname which resolves to private ip', async () => {
      await expect(
        got(`http://localhost:${port}/a.png`, safeGotOptions)
      ).rejects.toThrow();
      expect(handler).not.toHaveBeenCalled();
    });

    test('stream should refuse private address too', async () => {
      const stream = got.stream(
        `http://localhost:${port}/a.png`,
        safeGotOptions
      );

      await expect(
        new Promise((resolve, reject) => {
          stream.on('error', reject);
          stream.on('end', resolve);
          stream.resume();
        })
      ).rejects.toThrow();
      expect(handler).not.toHaveBeenCalled();
    });
  });
});
