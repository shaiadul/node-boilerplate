import { z } from 'zod';

export const deleteUploadSchema = z.object({
  body: z.object({
    publicId: z.string().min(1, 'Public ID is required to perform deletion'),
  }),
});

export const replaceUploadSchema = z.object({
  body: z.object({
    publicId: z.string().min(1, 'Public ID is required to perform replacement'),
  }),
});
