import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  logger.info(`📖 API documentation available at http://localhost:${env.PORT}/api-docs`);
});

const exitHandler = () => {
  if (server) {
    logger.info('Closing server gracefully...');
    server.close(() => {
      logger.info('Server closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error('Unexpected error occurred:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Initiating graceful shutdown...');
  if (server) {
    server.close(() => {
      logger.info('Server shut down successfully.');
    });
  }
});
