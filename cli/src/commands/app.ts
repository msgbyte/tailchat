import { CommandModule } from 'yargs';
import { run } from '../app';

export const appCommand: CommandModule = {
  command: 'app',
  describe: 'Tailchat cli 版本',
  builder: undefined,
  async handler() {
    await run();
  },
};
