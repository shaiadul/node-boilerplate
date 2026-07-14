import nodemailer from 'nodemailer';
import { env } from '../../../config/env';
import { logger } from '../../../config/logger';
import { EmailProvider, SendEmailOptions } from '../email.interface';

export class NodemailerProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    const config: any = {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
    };

    if (env.SMTP_USER && env.SMTP_PASS) {
      config.auth = {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      };
    }

    this.transporter = nodemailer.createTransport(config);
  }

  async send(options: SendEmailOptions): Promise<void> {
    try {
      const from = options.from || env.SMTP_FROM;
      const info = await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      logger.info(`[NodemailerProvider] Email sent successfully: ${info.messageId}`);
    } catch (error) {
      logger.error('[NodemailerProvider] Failed to send email via SMTP', error);
      throw error;
    }
  }
}
