import { startLocalServer } from '../src/main/lib/http';
import path from 'path';

const port = 12120;

startLocalServer(
  path.resolve(__dirname, '../release/app/dist/renderer'),
  port
).then(() => {
  console.log('HTTP Server start in', `http://localhost:${port}`);
});
