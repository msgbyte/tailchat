import { CommandModule } from 'yargs';
import { config } from 'dotenv';
import inquirer from 'inquirer';
import nodemailer from 'nodemailer';
import { parseConnectionUrl } from 'nodemailer/lib/shared';

export const smtpCommand: CommandModule = {
  command: 'smtp',
  describe: 'SMTP Service',
  builder: (yargs) =>
    yargs
      .command(
        'verify',
        'Verify smtp sender service',
        (yargs) => {},
        async (args) => {
          config(); // 加载环境变量

          const { uri } = await inquirer.prompt([
            {
              type: 'input',
              name: 'uri',
              message: 'SMTP_URI',
              default: process.env.SMTP_URI,
              validate: (input) =>
                typeof input === 'string' && input.length > 0,
            },
          ]);

          const transporter = nodemailer.createTransport(
            parseConnectionUrl(uri)
          );

          try {
            const verify = await transporter.verify();
            console.log('Verify Result:', verify);
          } catch (err) {
            console.log('Verify Failed:', String(err));
          }
        }
      )
      .demandCommand(),
  handler() {},
};
