import type { MailDocument, MailModel } from '../../../models/user/mail';
import { TcService, TcContext, TcDbService } from 'tailchat-server-sdk';
import ejs from 'ejs';
import path from 'path';

interface MailService extends TcService, TcDbService<MailDocument, MailModel> {}
class MailService extends TcService {
  smtpServiceAvailable = false;

  get serviceName(): string {
    return 'mail';
  }

  onInit(): void {
    this.registerLocalDb(require('../../../models/user/mail').default);

    this.registerAction('sendMail', this.sendMail, {
      visibility: 'public',
      params: {
        to: 'string',
        subject: 'string',
        html: 'string',
      },
    });
  }

  onInited() {
    this.adapter.model.verifyMailService().then((available) => {
      if (available) {
        this.logger.info('SMTP 服务可用');
      } else {
        this.logger.warn('SMTP 服务不可用');
      }

      this.smtpServiceAvailable = available;
    });
  }

  /**
   * 发送邮件
   */
  async sendMail(
    ctx: TcContext<{
      to: string;
      subject: string;
      html: string;
    }>
  ) {
    if (!this.smtpServiceAvailable) {
      throw new Error('SMTP 服务不可用');
    }

    const { to, subject, html } = ctx.params;

    const info = await this.adapter.model.sendMail({
      to,
      subject,
      html: await ejs.renderFile(
        path.resolve(__dirname, '../../../views/mail.ejs'),
        {
          body: html,
        }
      ),
    });

    this.logger.info('sendMailSuccess:', info);
  }
}

export default MailService;
