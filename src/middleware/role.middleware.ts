import { Response, NextFunction, RequestHandler } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { ApiError } from '../utils/ApiError';
import { Role } from '@prisma/client';

export const authorize = (...roles: Role[]): RequestHandler => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication credentials not found.'));
    }

    if (!roles.includes(req.user.role as Role)) {
      return next(
        new ApiError(
          403,
          `Forbidden resource. Access requires one of these roles: ${roles.join(', ')}`
        )
      );
    }

    next();
  };
};
