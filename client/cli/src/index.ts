import yargs from 'yargs';
import { createCommand } from './commands/create';
import { connectCommand } from './commands/connect';
import { declarationCommand } from './commands/declaration';

yargs
  .demandCommand()
  .command(createCommand)
  .command(connectCommand)
  .command(declarationCommand)
  .alias('h', 'help')
  .scriptName('tailchat')
  .parse();
