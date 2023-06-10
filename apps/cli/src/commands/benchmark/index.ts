import { CommandModule } from 'yargs';
import { benchMessageCommand } from './message';

// https://docs.docker.com/engine/api/v1.41/

export const benchmarkCommand: CommandModule = {
  command: 'benchmark',
  describe: 'Tailchat Benchmark Test',
  builder: (yargs) => yargs.command(benchMessageCommand).demandCommand(),
  handler(args) {},
};
