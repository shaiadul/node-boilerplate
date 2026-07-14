import { EmailProvider } from './email.interface';
import { EmailProviderFactory } from './providers/provider.factory';
import { EmailTemplateResult } from './email.templates';

export class EmailService {
  private provider: EmailProvider;

  constructor() {
    this.provider = EmailProviderFactory.createProvider();
  }

  /**
   * Sends an email to the recipient with the specified template.
   */
  async send(to: string, template: EmailTemplateResult): Promise<void> {
    await this.provider.send({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }
}

export const emailService = new EmailService();
