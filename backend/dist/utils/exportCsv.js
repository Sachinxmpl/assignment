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
exports.exportBorrowHistory = void 0;
const db_1 = __importDefault(require("../config/db"));
const csv_writer_1 = require("csv-writer");
const exportBorrowHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const borrows = yield db_1.default.borrow.findMany({
        where: userId ? { userId } : {},
        include: { book: true, user: true },
    });
    const csvStringifier = (0, csv_writer_1.createObjectCsvStringifier)({
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
    const records = borrows.map((borrow) => {
        var _a;
        return ({
            id: borrow.id,
            bookTitle: borrow.book.title,
            userEmail: borrow.user.email,
            borrowDate: borrow.borrowDate.toISOString(),
            dueDate: borrow.dueDate.toISOString(),
            returnDate: ((_a = borrow.returnDate) === null || _a === void 0 ? void 0 : _a.toISOString()) || '',
            fine: borrow.fine,
        });
    });
    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
});
exports.exportBorrowHistory = exportBorrowHistory;
