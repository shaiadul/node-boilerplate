import { logger } from '../../../config/logger';
import { EmailProvider, SendEmailOptions } from '../email.interface';

export class ConsoleProvider implements EmailProvider {
  async send(options: SendEmailOptions): Promise<void> {
    logger.info('========================================');
    logger.info(`[Console Email Provider] Sending Email`);
    logger.info(`From: ${options.from || 'default'}`);
    logger.info(`To: ${options.to}`);
    logger.info(`Subject: ${options.subject}`);
    logger.info(`Text: ${options.text || '(no plain text)'}`);
    logger.info(`HTML length: ${options.html.length} chars`);
    logger.info('========================================');
  }
}
