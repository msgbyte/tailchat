import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
  modelOptions,
  Severity,
  ReturnModelType,
} from '@typegoose/typegoose';
import type { Base } from '@typegoose/typegoose/lib/defaultClasses';
import type { Types } from 'mongoose';
import { User } from './user';
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { parseConnectionUrl } from 'nodemailer/lib/shared';
import { config } from 'tailchat-server-sdk';
import type SMTPConnection from 'nodemailer/lib/smtp-connection';

/**
 * 将地址格式化
 */
function stringifyAddress(address: SendMailOptions['to']): string {
  if (Array.isArray(address)) {
    return address.map((a) => stringifyAddress(a)).join(',');
  }

  if (typeof address === 'string') {
    return address;
  } else if (address === undefined) {
    return '';
  } else if (typeof address === 'object') {
    return `"${address.name}" ${address.address}`;
  }
}

function getSMTPConnectionOptions(): SMTPConnection.Options | null {
  if (config.smtp.connectionUrl) {
    return parseConnectionUrl(config.smtp.connectionUrl);
  }

  return null;
}

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Mail implements Base {
  _id: Types.ObjectId;
  id: string;

  /**
   * 发送到的用户id
   */
  @prop({
    ref: () => User,
    index: true,
  })
  userId: Ref<User>;

  /**
   * 发件人邮箱
   */
  @prop()
  from: string;

  /**
   * 收件人邮箱
   */
  @prop()
  to: string;

  /**
   * 邮件主题
   */
  @prop()
  subject: string;

  /**
   * 邮件内容
   */
  @prop()
  body: string;

  @prop()
  host?: string;

  @prop()
  port?: string;

  @prop()
  secure?: boolean;

  @prop()
  is_success: boolean;

  @prop()
  data?: any;

  @prop()
  error?: string;

  /**
   * 创建邮件发送实例
   */
  static createMailerTransporter(): Transporter | null {
    const options = getSMTPConnectionOptions();

    if (options) {
      const transporter = nodemailer.createTransport(options);

      return transporter;
    }

    return null;
  }

  /**
   * 检查邮件服务是否可用
   */
  static async verifyMailService(): Promise<boolean> {
    try {
      const transporter = Mail.createMailerTransporter();

      if (!transporter) {
        return false;
      }

      const verify = await transporter.verify();
      return verify;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  /**
   * 发送邮件
   */
  static async sendMail(
    this: ReturnModelType<typeof Mail>,
    mailOptions: SendMailOptions
  ) {
    try {
      const transporter = Mail.createMailerTransporter();
      if (!transporter) {
        throw new Error('Mail Transporter is null');
      }

      const options = {
        from: config.smtp.senderName,
        ...mailOptions,
      };

      const smtpOptions = getSMTPConnectionOptions();
      try {
        const info = await transporter.sendMail(options);

        await this.create({
          from: stringifyAddress(options.from),
          to: stringifyAddress(options.to),
          subject: options.subject,
          body: options.html,
          host: smtpOptions.host,
          port: smtpOptions.port,
          secure: smtpOptions.secure,
          is_success: true,
          data: info,
        });

        return info;
      } catch (err) {
        this.create({
          from: stringifyAddress(options.from),
          to: stringifyAddress(options.to),
          subject: options.subject,
          body: options.html,
          host: smtpOptions.host,
          port: smtpOptions.port,
          secure: smtpOptions.secure,
          is_success: false,
          error: String(err),
        });

        throw err;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export type MailDocument = DocumentType<Mail>;

const model = getModelForClass(Mail);

export type MailModel = typeof model;

export default model;
