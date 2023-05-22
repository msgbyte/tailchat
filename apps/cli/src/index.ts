import './update';
import yargs from 'yargs';
import { createCommand } from './commands/create';
import { connectCommand } from './commands/connect';
import { appCommand } from './commands/app';
import { declarationCommand } from './commands/declaration';
import { benchCommand } from './commands/bench';
import { dockerCommand } from './commands/docker';
import { usageCommand } from './commands/usage';
import { registryCommand } from './commands/registry';
import { smtpCommand } from './commands/smtp';

yargs
  .demandCommand()
  .command(createCommand)
  .command(connectCommand)
  .command(appCommand)
  .command(benchCommand)
  .command(declarationCommand)
  .command(dockerCommand)
  .command(registryCommand)
  .command(smtpCommand)
  .command(usageCommand)
  .alias('h', 'help')
  .scriptName('tailchat')
  .parse();
