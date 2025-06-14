import { z } from 'zod';

export const reviewSchema = z.object({
  bookId: z.number().int().positive('Valid book ID is required'),
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  comment: z.string().optional(),
});