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
exports.emailService = void 0;
const nodemailer_1 = require("../config/nodemailer");
const db_1 = __importDefault(require("../config/db"));
const logger_1 = require("../utils/logger");
exports.emailService = {
    scheduleDueReminders: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const borrows = yield db_1.default.borrow.findMany({
                where: { returnDate: null },
                include: { user: true, book: true },
            });
            for (const borrow of borrows) {
                const dueDate = new Date(borrow.dueDate);
                const now = new Date();
                const oneDayBefore = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);
                if (now >= oneDayBefore && now < dueDate) {
                    yield (0, nodemailer_1.sendDueReminder)(borrow.user.email, borrow.book.title, dueDate);
                    logger_1.logger.info(`Sent due reminder for borrow ID ${borrow.id}`);
                }
                else if (now > dueDate) {
                    yield (0, nodemailer_1.setOverdueNotification)(borrow.user.email, borrow.book.title, borrow.fine);
                    logger_1.logger.info(`Sent overdue notification for borrow ID ${borrow.id}`);
                }
            }
        }
        catch (error) {
            logger_1.logger.error('Error scheduling email reminders', error);
        }
    }),
};
