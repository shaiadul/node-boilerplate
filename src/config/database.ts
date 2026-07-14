import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'stdout', level: 'info' },
      { emit: 'stdout', level: 'warn' },
      { emit: 'stdout', level: 'error' },
    ],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  (prisma as any).$on('query', (e: any) => {
    logger.debug(`Query: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
  });
}

prisma
  .$connect()
  .then(() => {
    logger.info('🔌 Neon/PostgreSQL Database connection established successfully via Prisma');
  })
  .catch((err: Error) => {
    logger.error('❌ Neon/PostgreSQL Database connection failed:', err);
  });
