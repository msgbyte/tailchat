import path from 'path';
import { startDevRunner } from 'tailchat-server-sdk/dist/runner';

startDevRunner({
  config: path.resolve(__dirname, './moleculer.config.ts'),
});
