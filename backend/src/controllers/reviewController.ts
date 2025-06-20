import { Request, Response, RequestHandler } from 'express';
import dbclient from '../config/db';
import { reviewSchema } from '../zodSchemas/reviewSchema';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { logger } from '../utils/logger';
import { CustomRequest } from '../types/type';

export const createReview = [
  validationMiddleware(reviewSchema),
  (async (req: CustomRequest, res: Response) => {
    try {
      const { bookId, rating, comment } = req.body;
      const userId = req.user!.id;

      // Ensure the user has borrowed and returned the book
      const borrow = await dbclient.borrow.findFirst({
        where: { userId, bookId, returnDate: { not: null } },
      });

      if (!borrow) {
        return res.status(403).json({ message: 'Only users who borrowed and returned this book can review' });
      }

      const review = await dbclient.review.create({
        data: { userId, bookId, rating, comment },
      });

      logger.info(`Review created for book ${bookId} by user ${userId}`);
      res.status(201).json(review);
    } catch (error) {
      logger.error('Error creating review', error);
      res.status(400).json({ message: 'Review creation failed', error });
    }
  }) as RequestHandler,
];

export const getReviews = (async (req: Request, res: Response) => {
  try {
    const { bookId } = req.query;

    const reviews = await dbclient.review.findMany({
      where: bookId ? { bookId: parseInt(bookId as string) } : {},
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    res.json(reviews);
  } catch (error) {
    logger.error('Error fetching reviews', error);
    res.status(500).json({ message: 'Failed to fetch reviews', error });
  }
}) as RequestHandler;

export const reviewController = {
  createReview,
  getReviews,
};
