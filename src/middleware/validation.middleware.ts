import { Request, Response, NextFunction, RequestHandler } from 'express';

export const validate = (schema: any): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const bodySchema = schema.body || (schema.shape && schema.shape.body);
      const querySchema = schema.query || (schema.shape && schema.shape.query);
      const paramsSchema = schema.params || (schema.shape && schema.shape.params);
      const headersSchema = schema.headers || (schema.shape && schema.shape.headers);

      if (bodySchema) {
        req.body = await bodySchema.parseAsync(req.body);
      }
      if (querySchema) {
        req.query = await querySchema.parseAsync(req.query);
      }
      if (paramsSchema) {
        req.params = await paramsSchema.parseAsync(req.params);
      }
      if (headersSchema) {
        req.headers = await headersSchema.parseAsync(req.headers);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
