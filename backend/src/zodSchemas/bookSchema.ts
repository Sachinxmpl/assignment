import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.coerce.number().int().positive('Valid category ID is required'),
  totalCopies: z.coerce.number().int().min(1, 'At least one copy is required'),
});

export const updateBookSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  author: z.string().min(1, 'Author is required').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  categoryId: z.number().int().positive('Valid category ID is required').optional(),
  totalCopies: z.number().int().min(1, 'At least one copy is required').optional(),
});