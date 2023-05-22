import { CommandModule } from 'yargs';
import inquirer from 'inquirer';
import find from 'find-process';
import pidusage from 'pidusage';

export const usageCommand: CommandModule = {
  command: 'usage [pid]',
  describe: 'View Tailchat process usage',
  builder: (yargs) =>
    yargs.positional('pid', {
      demandOption: false,
      description: 'process id',
      type: 'number',
    }),
  async handler(args) {
    let pidList: number[] = [];

    if (!args.pid) {
      const list = await find('name', 'tailchat');

      const processList = list.filter((item) => item.pid !== process.pid);

      const res = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'process',
          message: 'Select the process to view',
          choices: processList.map((item) => ({
            name: `(${item.pid})${item.cmd}`,
            value: item.pid,
          })),
        },
      ]);

      pidList = res.process;
    } else {
      if (Array.isArray(args.pid)) {
        pidList = args.pid;
      } else {
        pidList = [args.pid as number];
      }
    }

    const stats = await pidusage(pidList);
    const res = Object.entries(stats).map(([pid, info]) => ({
      pid,
      cpu: info.cpu,
      memory: `${info.memory / 1024 / 1024} MB`,
    }));
    console.table(res);
  },
};
