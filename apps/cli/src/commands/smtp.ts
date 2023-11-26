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

          console.log(
            'This command will verify SMTP URI which use in tailchat, please put your URI which same like in tailchat env'
          );
          const { uri } = await inquirer.prompt([
            {
              type: 'input',
              name: 'uri',
              message: 'SMTP_URI',
              default: process.env.SMTP_URI,
              validate: isValidStr,
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
      .command(
        'test',
        'Send test email with smtp service',
        (yargs) => {},
        async (args) => {
          config(); // 加载环境变量

          console.log(
            'This command will send test email to your own email, please put your info which same like in tailchat env'
          );

          const { sender, uri, target } = await inquirer.prompt([
            {
              type: 'input',
              name: 'sender',
              message: 'SMTP_SENDER',
              default: process.env.SMTP_SENDER,
              validate: isValidStr,
            },
            {
              type: 'input',
              name: 'uri',
              message: 'SMTP_URI',
              default: process.env.SMTP_URI,
              validate: isValidStr,
            },
            {
              type: 'input',
              name: 'target',
              message: 'Email address which wanna send',
              validate: isValidStr,
            },
          ]);

          const transporter = nodemailer.createTransport(
            parseConnectionUrl(uri)
          );

          try {
            const res = await transporter.sendMail({
              from: sender,
              to: target,
              subject: `Test email send in ${new Date().toLocaleDateString()}`,
              text: `This is a test email send by tailchat-cli at ${new Date().toLocaleString()}`,
            });
            console.log('Send Result:', res);
          } catch (err) {
            console.log('Send Failed:', String(err));
          } finally {
            transporter.close();
          }
        }
      )
      .demandCommand(),
  handler() {},
};

function isValidStr(input: any): boolean {
  return typeof input === 'string' && input.length > 0;
}
