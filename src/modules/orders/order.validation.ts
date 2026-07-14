import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.string().uuid('Invalid Product ID format'),
          quantity: z.number().int().positive('Quantity must be a positive integer'),
        })
      )
      .min(1, 'Order must contain at least one item'),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus),
  }),
  params: z.object({
    id: z.string().uuid('Invalid Order ID format'),
  }),
});

export const getOrderByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Order ID format'),
  }),
});
