import express from 'express';
import path from 'path';

/**
 * 启动一个本地服务器
 */
export function startLocalServer(
  staticPath: string,
  port: number
): Promise<void> {
  return new Promise<void>((resolve) => {
    const app = express();

    const staticDir = path.resolve(__dirname, staticPath);
    console.log('Static File:', staticDir);

    app.use(express.static(staticDir));

    // Fallback
    app.use('/**', function (_, res) {
      res.sendFile(staticPath + '/index.html', { maxAge: 0 });
    });

    app.listen(port, () => {
      console.log('Static file server is listen at:', port);
      resolve();
    });
  });
}
