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
exports.borrowController = exports.getBorrowId = exports.exportBorrowHistory = exports.getBorrowHistory = exports.returnBook = exports.borrowBook = void 0;
const borrowService_1 = require("../services/borrowService");
const borrowSchema_1 = require("../zodSchemas/borrowSchema");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const exportCsv_1 = require("../utils/exportCsv");
const logger_1 = require("../utils/logger");
const db_1 = __importDefault(require("../config/db"));
// Middleware + controller
exports.borrowBook = [
    (0, validationMiddleware_1.validationMiddleware)(borrowSchema_1.borrowSchema),
    ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { bookId } = req.body;
            const userId = req.user.id;
            const borrow = yield borrowService_1.borrowService.borrowBook(userId, bookId);
            logger_1.logger.info(`Book borrowed: ${bookId} by user ${userId}`);
            res.status(201).json(borrow);
        }
        catch (error) {
            logger_1.logger.error('Error borrowing book', error);
            res.status(400).json({ message: 'Borrow failed', error });
        }
    })),
];
exports.returnBook = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowId = parseInt(req.params.id);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(borrowId);
        const userId = req.user.id;
        const result = yield borrowService_1.borrowService.returnBook(borrowId, userId);
        console.log("Result is " + result);
        logger_1.logger.info(`Book returned: borrow ID ${borrowId}`);
        res.json(result);
    }
    catch (error) {
        logger_1.logger.error('Error returning book', error);
        res.status(400).json({ message: 'Return failed', error });
    }
}));
exports.getBorrowHistory = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.role === 'ADMIN' ? undefined : req.user.id;
        const borrows = yield borrowService_1.borrowService.getBorrowHistory(userId);
        res.json(borrows);
    }
    catch (error) {
        logger_1.logger.error('Error fetching borrow history', error);
        res.status(500).json({ message: 'Failed to fetch borrow history', error });
    }
}));
exports.exportBorrowHistory = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.role === 'ADMIN' ? undefined : req.user.id;
        const csv = yield (0, exportCsv_1.exportBorrowHistory)(userId);
        res.header('Content-Type', 'text/csv');
        res.attachment('borrow_history.csv');
        res.send(csv);
        logger_1.logger.info(`Borrow history exported by user ${req.user.id}`);
    }
    catch (error) {
        logger_1.logger.error('Error exporting borrow history', error);
        res.status(500).json({ message: 'Export failed', error });
    }
}));
exports.getBorrowId = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId, userId } = req.query;
    try {
        const borrow = yield db_1.default.borrow.findFirst({
            where: {
                bookId: Number(bookId),
                userId: Number(userId),
            }
        });
        if (!borrow) {
            return res.status(404).json({ message: 'Borrow record not found' });
        }
        res.json({ borrowId: borrow.id });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
// Controller export
exports.borrowController = {
    borrowBook: exports.borrowBook,
    returnBook: exports.returnBook,
    getBorrowHistory: exports.getBorrowHistory,
    exportBorrowHistory: exports.exportBorrowHistory,
    getBorrowId: exports.getBorrowId
};
