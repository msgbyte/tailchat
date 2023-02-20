import { CommandModule } from 'yargs';
import { dockerInitCommand } from './init';
import { dockerUpdateCommand } from './update';
import { dockerDoctorCommand } from './doctor';

// https://docs.docker.com/engine/api/v1.41/

export const dockerCommand: CommandModule = {
  command: 'docker',
  describe: 'Tailchat image management',
  builder: (yargs) =>
    yargs
      .command(dockerInitCommand)
      .command(dockerDoctorCommand)
      .command(dockerUpdateCommand)
      .demandCommand(),
  handler(args) {},
};
