import { CommandModule } from 'yargs';
import nodePlop from 'node-plop';
import path from 'path';
import inquirer from 'inquirer';

const plop = nodePlop(path.resolve(__dirname, '../../templates/plopfile.js'));

export const createCommand: CommandModule = {
  command: 'create [template]',
  describe: 'Create Tailchat repo code',
  builder: (yargs) =>
    yargs.positional('template', {
      demandOption: true,
      description: 'Template Name',
      type: 'string',
      choices: plop.getGeneratorList().map((v) => v.name),
    }),
  async handler(args) {
    let template: string;

    if (!args.template) {
      const res = await inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: 'Choose Template',
          choices: plop.getGeneratorList().map((v) => ({
            name: `${v.name} (${v.description})`,
            value: v.name,
          })),
        },
      ]);
      template = String(res.template);
    } else {
      template = String(args.template);
    }

    const basic = plop.getGenerator(template);

    const answers = await basic.runPrompts();
    const results = await basic.runActions(answers);

    console.log('Changes:');
    console.log(results.changes.map((change) => change.path).join('\n'));

    if (results.failures.length > 0) {
      console.log('Operation failed:');
      console.log(results.failures);
    }
  },
};
