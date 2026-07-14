import { z } from 'zod';
import { Role } from '@prisma/client';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(100).optional(),
    email: z.string().email('Invalid email format').optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6, 'Current password must be at least 6 characters long'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  }),
});

export const adminUpdateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email('Invalid email format').optional(),
    role: z.nativeEnum(Role).optional(),
    isVerified: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid User ID format'),
  }),
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid User ID format'),
  }),
});
