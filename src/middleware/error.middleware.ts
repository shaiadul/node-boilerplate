import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';
import { env } from '../config/env';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errors: unknown[] = [];

    // Zod Validation Errors
    if (error instanceof ZodError) {
      statusCode = 400;
      message = 'Validation Error';
      errors = error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
    }
    // Prisma DB Errors
    else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      statusCode = 400;
      message = `Database query error [${error.code}]`;
      if (error.code === 'P2002') {
        statusCode = 409;
        message = 'Unique constraint violation. Field value already exists.';
        errors = [
          {
            field: (error.meta?.target as string[])?.join(', ') || 'unknown',
            message: 'Unique constraint violated',
          },
        ];
      }
    }
    // JWT Authentication Errors
    else if (error instanceof jwt.JsonWebTokenError) {
      statusCode = 401;
      message = 'Invalid token. Authorization failed.';
    } else if (error instanceof jwt.TokenExpiredError) {
      statusCode = 401;
      message = 'Token has expired. Authorization failed.';
    } else if (error instanceof Error) {
      message = error.message;
    }

    error = new ApiError(statusCode, message, errors, err.stack);
  }

  // Log Error using Winston logger
  logger.error(
    `[${req.method}] ${req.originalUrl} - Status: ${error.statusCode} - Message: ${error.message}`
  );

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};
