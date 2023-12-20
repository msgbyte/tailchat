import inquirer from 'inquirer';
import { CommandModule } from 'yargs';
import fs, { mkdirp } from 'fs-extra';
import path from 'path';
import ora from 'ora';
import got from 'got';

const onlineDeclarationUrl =
  'https://raw.githubusercontent.com/msgbyte/tailchat/master/client/web/tailchat.d.ts';
export const declarationCommand: CommandModule = {
  command: 'declaration <source>',
  describe: 'Tailchat plugin type declaration',
  builder: (yargs) =>
    yargs.positional('source', {
      demandOption: true,
      description: 'Declaration Type Source',
      type: 'string',
      choices: ['empty', 'github'],
    }),
  async handler(args) {
    let source = String(args.source);

    if (!source) {
      const res = await inquirer.prompt([
        {
          type: 'list',
          name: 'source',
          message: 'Select type source',
          choices: [
            {
              name: 'Empty',
              value: 'empty',
            },
            {
              name: 'Download the full statement from Github',
              value: 'github',
            },
          ],
        },
      ]);
      source = String(res.source);
    }

    let content = '';
    if (source === 'empty') {
      content =
        "declare module '@capital/common';\ndeclare module '@capital/component';\n";
    } else if (source === 'github') {
      const url = onlineDeclarationUrl;

      const spinner = ora(
        `Downloading plugin type declarations from Github: ${url}`
      ).start();

      content = await got.get(url).then((res) => res.body);

      spinner.succeed('The declaration file has been downloaded');
    }

    if (content !== '') {
      const target = path.resolve(process.cwd(), './types/tailchat.d.ts');
      await mkdirp(path.dirname(target));
      await fs.writeFile(target, content);
      console.log('Writing type file complete:', target);
    }
  },
};
