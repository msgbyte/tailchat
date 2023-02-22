import { CommandModule } from 'yargs';
import path from 'path';
import glob from 'glob';
import inquirer from 'inquirer';
import fs from 'fs-extra';

const feRegistryPath = path.join(process.cwd(), './client/web/registry.json');

export const registryConfigCommand: CommandModule = {
  command: 'config',
  describe:
    'config tailchat registry which can display in Tailchat, run it in tailchat root path',
  builder: (yargs) =>
    yargs
      .option('fe', {
        describe: 'Config FE Plugin List',
        type: 'boolean',
      })
      .option('verbose', {
        describe: 'Show plugin manifest path list',
        type: 'boolean',
      }),
  async handler(args) {
    const feplugins = glob.sync(
      path.join(process.cwd(), './client/web/plugins/*/manifest.json')
    );
    const beplugins = glob.sync(
      path.join(process.cwd(), './server/plugins/*/web/plugins/*/manifest.json')
    );

    if (args.verbose) {
      console.log('feplugins', feplugins);
      console.log('beplugins', beplugins);
    }

    console.log(
      `Scan plugins: fe(count: ${feplugins.length}) be(count: ${beplugins.length})`
    );

    if (args.fe) {
      const alreadySelected = await fs.readJSON(feRegistryPath);
      const feInfos = await Promise.all(feplugins.map((p) => fs.readJSON(p)));
      const { selected: selectedInfo } = await inquirer.prompt([
        {
          name: 'selected',
          type: 'checkbox',
          default: alreadySelected
            .map((item: any) => feInfos.find((info) => info.name === item.name))
            .filter(Boolean),
          choices: feInfos.map((info) => ({
            name: `${info.name}(${info.version})`,
            value: info,
          })),
        },
      ]);

      console.log(`Selected ${selectedInfo.length} plugin.`);

      await fs.writeJSON(feRegistryPath, selectedInfo, { spaces: 2 });
    }
  },
};
