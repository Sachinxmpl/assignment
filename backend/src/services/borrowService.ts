import dbclient from '../config/db';
import { sendDueReminder, setOverdueNotification } from '../config/nodemailer';
import { calculateFine } from '../utils/fineCalculator';
import { logger } from '../utils/logger';

export const borrowService = {
  borrowBook: async (userId: number, bookId: number) => {
    const book = await dbclient.book.findUnique({ where: { id: bookId } });
    if (!book || book.totalCopies <= book.borrowedCopies) {
      throw new Error('Book not available');
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks borrowing period

    const borrow = await dbclient.borrow.create({
      data: {
        userId,
        bookId,
        borrowDate: new Date(),
        dueDate,
        fine: 0,
      },
    });

    await dbclient.book.update({
      where: { id: bookId },
      data: { borrowedCopies: { increment: 1 } },
    });

    // Fetch user email for due reminder
    const user = await dbclient.user.findUnique({ where: { id: userId } });

    // Schedule due reminder (1 day before due date)
    setTimeout(() => {
      if (user && user.email) {
        sendDueReminder(user.email, book.title, dueDate);
        logger.info(`Scheduled due reminder for borrow ID ${borrow.id}`);
      }
    }, dueDate.getTime() - Date.now() - 24 * 60 * 60 * 1000);

    return borrow;
  },

  returnBook: async (borrowId: number, userId: number) => {
    const borrow = await dbclient.borrow.findUnique({
      where: { id: borrowId },
      include: { book: true, user: true },
    });
    console.log("{{{{{{{{{{{{{{{{{{")
    console.log(borrowId , userId)
    console.log(borrow)
    if (!borrow || borrow.userId !== userId) {
      throw new Error('Invalid borrow record');
    }
    if (borrow.returnDate) {
      throw new Error('Book already returned');
    }

    const fine = calculateFine(borrow.dueDate);
    if (fine > 0) {
      await setOverdueNotification(borrow.user.email, borrow.book.title, fine);
      logger.info(`Sent overdue notification for borrow ID ${borrow.id}`);
    }

    await dbclient.borrow.update({
      where: { id: borrowId },
      data: { returnDate: new Date(), fine },
    });

    await dbclient.book.update({
      where: { id: borrow.bookId },
      data: { borrowedCopies: { decrement: 1 } },
    });

    return { message: 'Book returned successfully', fine };
  },

  getBorrowHistory: async (userId?: number) => {
    try {
      const borrows = await dbclient.borrow.findMany({
        where: userId ? { userId } : {},
        include: {
          book: { select: { title: true, author: true } },
          user: { select: { email: true, name: true } },
        },
        orderBy: { borrowDate: 'desc' },
      });
      return borrows;
    } catch (error) {
      logger.error('Error fetching borrow history', error);
      throw new Error('Failed to fetch borrow history');
    }
  },
};