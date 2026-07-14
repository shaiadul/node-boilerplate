import { Response } from 'express';
import { ApiResponse } from './ApiResponse';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data: T,
  message = 'Success',
  meta?: unknown
): void => {
  res.status(statusCode).json(new ApiResponse(data, message, meta));
};
