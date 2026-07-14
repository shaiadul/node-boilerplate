import { Resend } from 'resend';
import { env } from '../../../config/env';
import { logger } from '../../../config/logger';
import { EmailProvider, SendEmailOptions } from '../email.interface';

export class ResendProvider implements EmailProvider {
  private resend: Resend;

  constructor() {
    if (!env.RESEND_API_KEY) {
      logger.warn('[ResendProvider] RESEND_API_KEY is not defined. Resend calls will fail.');
    }
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  async send(options: SendEmailOptions): Promise<void> {
    try {
      const from = options.from || env.SMTP_FROM;
      const response = await this.resend.emails.send({
        from,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      logger.info(`[ResendProvider] Email sent successfully via Resend: ${response.data?.id}`);
    } catch (error) {
      logger.error('[ResendProvider] Failed to send email via Resend', error);
      throw error;
    }
  }
}
