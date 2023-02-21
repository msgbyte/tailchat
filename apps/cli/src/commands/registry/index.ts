import { CommandModule } from 'yargs';
import { registryConfigCommand } from './config';

// https://docs.docker.com/engine/api/v1.41/

export const registryCommand: CommandModule = {
  command: 'registry',
  describe: 'Tailchat registry config',
  builder: (yargs) => yargs.command(registryConfigCommand).demandCommand(),
  handler(args) {},
};
