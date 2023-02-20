import { CommandModule } from 'yargs';
import { run } from '../app';
import { isDev } from '../utils';

export const appCommand: CommandModule = {
  command: 'app',
  describe: isDev() ? false : 'Tailchat cli(WIP)',
  builder: undefined,
  async handler() {
    await run();
  },
};
