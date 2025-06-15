import dbclient from '../config/db';
import { createObjectCsvStringifier } from 'csv-writer';

export const exportBorrowHistory = async (userId?: number) => {
  const borrows = await dbclient.borrow.findMany({
    where: userId ? { userId } : {},
    include: { book: true, user: true },
  });

  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'id', title: 'Borrow ID' },
      { id: 'bookTitle', title: 'Book Title' },
      { id: 'userEmail', title: 'User Email' },
      { id: 'borrowDate', title: 'Borrow Date' },
      { id: 'dueDate', title: 'Due Date' },
      { id: 'returnDate', title: 'Return Date' },
      { id: 'fine', title: 'Fine' },
    ],
  });

  const records = borrows.map((borrow) => ({
    id: borrow.id,
    bookTitle: borrow.book.title,
    userEmail: borrow.user.email,
    borrowDate: borrow.borrowDate.toISOString(),
    dueDate: borrow.dueDate.toISOString(),
    returnDate: borrow.returnDate?.toISOString() || '',
    fine: borrow.fine,
  }));

  return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
};