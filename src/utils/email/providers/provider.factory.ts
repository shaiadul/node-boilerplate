import { env } from '../../../config/env';
import { logger } from '../../../config/logger';
import { EmailProvider } from '../email.interface';
import { ConsoleProvider } from './console.provider';
import { NodemailerProvider } from './nodemailer.provider';
import { ResendProvider } from './resend.provider';

export class EmailProviderFactory {
  static createProvider(): EmailProvider {
    const providerType = env.EMAIL_PROVIDER;
    logger.info(`[EmailProviderFactory] Initializing provider: ${providerType}`);

    switch (providerType) {
      case 'nodemailer':
        return new NodemailerProvider();
      case 'resend':
        return new ResendProvider();
      case 'console':
      default:
        return new ConsoleProvider();
    }
  }
}
