import { sendDueReminder, setOverdueNotification } from '../config/nodemailer';
import dbclient from '../config/db';
import { logger } from '../utils/logger';

export const emailService = {
    scheduleDueReminders: async () => {
        try {
            const borrows = await dbclient.borrow.findMany({
                where: { returnDate: null },
                include: { user: true, book: true },
            });

            for (const borrow of borrows) {
                const dueDate = new Date(borrow.dueDate);
                const now = new Date();
                const oneDayBefore = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);

                if (now >= oneDayBefore && now < dueDate) {
                    await sendDueReminder(borrow.user.email, borrow.book.title, dueDate);
                    logger.info(`Sent due reminder for borrow ID ${borrow.id}`);
                } else if (now > dueDate) {
                    await setOverdueNotification(borrow.user.email, borrow.book.title, borrow.fine);
                    logger.info(`Sent overdue notification for borrow ID ${borrow.id}`);
                }
            }
        } catch (error) {
            logger.error('Error scheduling email reminders', error);
        }
    },
};