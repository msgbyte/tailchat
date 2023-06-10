import { CommandModule } from 'yargs';
import { benchmarkConnectionsCommand } from './connections';
import { benchmarkMessageCommand } from './message';
import { benchmarkRegisterCommand } from './register';

// https://docs.docker.com/engine/api/v1.41/

export const benchmarkCommand: CommandModule = {
  command: 'benchmark',
  describe: 'Tailchat Benchmark Test',
  builder: (yargs) =>
    yargs
      .command(benchmarkMessageCommand)
      .command(benchmarkConnectionsCommand)
      .command(benchmarkRegisterCommand)
      .demandCommand(),
  handler(args) {},
};
