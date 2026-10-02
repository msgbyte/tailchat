import http from 'http';
import type { AddressInfo } from 'net';
import FileService from '../../../services/core/file.service';

describe('Test "file" service', () => {
  describe('Test "file.saveFileWithUrl"', () => {
    const handler = jest.fn((req, res) => {
      res.end('internal secret');
    });
    const server = http.createServer(handler);
    let port: number;

    /**
     * 不启动服务(需要minio), 只用真实的方法实现, 存储部分替换为读完数据流
     */
    const saved: string[] = [];
    const service = {
      bucketName: 'test',
      logger: { error: jest.fn() },
      async saveFileStream(ctx, filename, stream) {
        let content = '';
        for await (const chunk of stream) {
          content += String(chunk);
        }
        saved.push(content);

        return { etag: 'etag', objectName: filename, url: `/${filename}` };
      },
    };

    function saveFileWithUrl(fileUrl: string) {
      return FileService.prototype.saveFileWithUrl.call(service, {
        params: { fileUrl },
        meta: { t: (key: string) => key },
      });
    }

    beforeAll((done) => {
      server.listen(0, '127.0.0.1', () => {
        port = (server.address() as AddressInfo).port;
        done();
      });
    });

    afterAll((done) => {
      server.close(done);
    });

    test('should not fetch url which points to private network', async () => {
      await expect(
        saveFileWithUrl(`http://localhost:${port}/secret.png`)
      ).rejects.toThrow();
      await expect(
        saveFileWithUrl(`http://127.0.0.1:${port}/secret.png`)
      ).rejects.toThrow();

      expect(handler).not.toHaveBeenCalled();
      expect(saved).toEqual([]);
    });
  });
});
