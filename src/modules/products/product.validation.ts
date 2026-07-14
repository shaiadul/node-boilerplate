import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name must be at least 2 characters long').max(150),
    description: z.string().max(1000).optional(),
    price: z.number().positive('Price must be greater than zero'),
    stock: z.number().int().nonnegative('Stock cannot be negative').optional(),
    categoryId: z.string().uuid('Invalid Category ID format'),
    images: z.array(z.string().url('Images must be valid URLs')).optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150).optional(),
    description: z.string().max(1000).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    categoryId: z.string().uuid().optional(),
    images: z.array(z.string().url()).optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid Product ID format'),
  }),
});

export const getProductByIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Product ID format'),
  }),
});
