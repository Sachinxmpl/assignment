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
exports.bookService = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.bookService = {
    createBook: (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("This is inside hte debuggin conloe ");
        console.log(data);
        return db_1.default.book.create({
            data: Object.assign(Object.assign({}, data), { borrowedCopies: 0 })
        });
    }),
    getBooks: (filters) => __awaiter(void 0, void 0, void 0, function* () {
        const where = {};
        if (filters.category) {
            where.category = { name: filters.category };
        }
        if (filters.author) {
            where.author = { contains: filters.author, mode: 'insensitive' };
        }
        if (filters.availability === 'available') {
            where.totalCopies = { gt: db_1.default.book.fields.borrowedCopies };
        }
        if (filters.rating) {
            where.reviews = { some: { rating: { gte: filters.rating } } };
        }
        const orderBy = {};
        if (filters.sortBy === 'newest') {
            orderBy.createdAt = 'desc';
        }
        else if (filters.sortBy === 'rating') {
            orderBy.reviews = { _count: 'desc' };
        }
        else if (filters.sortBy === 'popularity') {
            orderBy.borrows = { _count: 'desc' };
        }
        return db_1.default.book.findMany({
            where,
            orderBy,
            include: { category: true, reviews: true },
        });
    }),
    getBookById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return db_1.default.book.findUnique({
            where: { id },
            include: {
                category: true,
                reviews: {
                    include: {
                        user: true
                    }
                }
            }
        });
    }),
    updateBook: (id, data) => __awaiter(void 0, void 0, void 0, function* () {
        return db_1.default.book.update({
            where: { id },
            data,
        });
    }),
    deleteBook: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return db_1.default.book.delete({ where: { id } });
    }),
};
