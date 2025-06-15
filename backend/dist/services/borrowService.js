"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowService = void 0;
const db_1 = __importDefault(require("../config/db"));
const nodemailer_1 = require("../config/nodemailer");
const fineCalculator_1 = require("../utils/fineCalculator");
const logger_1 = require("../utils/logger");
exports.borrowService = {
    borrowBook: (userId, bookId) => __awaiter(void 0, void 0, void 0, function* () {
        const book = yield db_1.default.book.findUnique({ where: { id: bookId } });
        if (!book || book.totalCopies <= book.borrowedCopies) {
            throw new Error('Book not available');
        }
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); // 2 weeks borrowing period
        const borrow = yield db_1.default.borrow.create({
            data: {
                userId,
                bookId,
                borrowDate: new Date(),
                dueDate,
                fine: 0,
            },
        });
        yield db_1.default.book.update({
            where: { id: bookId },
            data: { borrowedCopies: { increment: 1 } },
        });
        // Fetch user email for due reminder
        const user = yield db_1.default.user.findUnique({ where: { id: userId } });
        // Schedule due reminder (1 day before due date)
        setTimeout(() => {
            if (user && user.email) {
                (0, nodemailer_1.sendDueReminder)(user.email, book.title, dueDate);
                logger_1.logger.info(`Scheduled due reminder for borrow ID ${borrow.id}`);
            }
        }, dueDate.getTime() - Date.now() - 24 * 60 * 60 * 1000);
        return borrow;
    }),
    returnBook: (borrowId, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const borrow = yield db_1.default.borrow.findUnique({
            where: { id: borrowId },
            include: { book: true, user: true },
        });
        if (!borrow || borrow.userId !== userId) {
            throw new Error('Invalid borrow record');
        }
        if (borrow.returnDate) {
            throw new Error('Book already returned');
        }
        const fine = (0, fineCalculator_1.calculateFine)(borrow.dueDate);
        if (fine > 0) {
            yield (0, nodemailer_1.setOverdueNotification)(borrow.user.email, borrow.book.title, fine);
            logger_1.logger.info(`Sent overdue notification for borrow ID ${borrow.id}`);
        }
        yield db_1.default.borrow.update({
            where: { id: borrowId },
            data: { returnDate: new Date(), fine },
        });
        yield db_1.default.book.update({
            where: { id: borrow.bookId },
            data: { borrowedCopies: { decrement: 1 } },
        });
        return { message: 'Book returned successfully', fine };
    }),
    getBorrowHistory: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const borrows = yield db_1.default.borrow.findMany({
                where: userId ? { userId } : {},
                include: {
                    book: { select: { title: true, author: true } },
                    user: { select: { email: true, name: true } },
                },
                orderBy: { borrowDate: 'desc' },
            });
            return borrows;
        }
        catch (error) {
            logger_1.logger.error('Error fetching borrow history', error);
            throw new Error('Failed to fetch borrow history');
        }
    }),
};
