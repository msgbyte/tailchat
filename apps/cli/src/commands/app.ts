import { CommandModule } from 'yargs';
import { run } from '../app';
import { isDev } from '../utils';

export const appCommand: CommandModule = {
  command: 'app',
  describe: isDev() ? false : 'Tailchat cli 版本(WIP)',
  builder: undefined,
  async handler() {
    await run();
  },
};
