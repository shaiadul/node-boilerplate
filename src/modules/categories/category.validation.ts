import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(50),
    description: z.string().max(500).optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(50).optional(),
    description: z.string().max(500).optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid Category ID format'),
  }),
});

export const getCategoryByIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Category ID format'),
  }),
});
