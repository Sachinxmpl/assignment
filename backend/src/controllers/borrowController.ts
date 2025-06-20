import { Request, Response, RequestHandler } from 'express';
import { borrowService } from '../services/borrowService';
import { borrowSchema } from '../zodSchemas/borrowSchema';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { exportBorrowHistory as exportCSV } from '../utils/exportCsv';
import { logger } from '../utils/logger';
import { CustomRequest } from '../types/type';
import dbclient from '../config/db';

// Middleware + controller
export const borrowBook = [
  validationMiddleware(borrowSchema),
  (async (req: CustomRequest, res: Response) => {
    try {
      const { bookId } = req.body;
      const userId = req.user!.id;

      const borrow = await borrowService.borrowBook(userId, bookId);

      logger.info(`Book borrowed: ${bookId} by user ${userId}`);
      res.status(201).json(borrow);
    } catch (error) {
      logger.error('Error borrowing book', error);
      res.status(400).json({ message: 'Borrow failed', error });
    }
  }) as RequestHandler,
];

export const returnBook = (async (req: CustomRequest, res: Response) => {
  try {
    const borrowId = parseInt(req.params.id);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    console.log(borrowId)
    const userId = req.user!.id;

    const result = await borrowService.returnBook(borrowId, userId);
    console.log("Result is " + result)
    logger.info(`Book returned: borrow ID ${borrowId}`);
    res.json(result);
  } catch (error) {
    logger.error('Error returning book', error);
    res.status(400).json({ message: 'Return failed', error });
  }
}) as RequestHandler;

export const getBorrowHistory = (async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.role === 'ADMIN' ? undefined : req.user!.id;

    const borrows = await borrowService.getBorrowHistory(userId);

    res.json(borrows);
  } catch (error) {
    logger.error('Error fetching borrow history', error);
    res.status(500).json({ message: 'Failed to fetch borrow history', error });
  }
}) as RequestHandler;

export const exportBorrowHistory = (async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.role === 'ADMIN' ? undefined : req.user!.id;

    const csv = await exportCSV(userId);

    res.header('Content-Type', 'text/csv');
    res.attachment('borrow_history.csv');
    res.send(csv);

    logger.info(`Borrow history exported by user ${req.user!.id}`);
  } catch (error) {
    logger.error('Error exporting borrow history', error);
    res.status(500).json({ message: 'Export failed', error });
  }
}) as RequestHandler;

export const getBorrowId = (async (req: CustomRequest, res: Response) => {
  const { bookId, userId } = req.query;
  try {
    const borrow = await dbclient.borrow.findFirst({
      where: {
        bookId: Number(bookId),
        userId: Number(userId),
      }
    })

    if (!borrow) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    res.json({ borrowId: borrow.id });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
) as RequestHandler

// Controller export
export const borrowController = {
  borrowBook,
  returnBook,
  getBorrowHistory,
  exportBorrowHistory,
  getBorrowId
};
