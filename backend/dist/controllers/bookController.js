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
exports.bookController = void 0;
const bookService_1 = require("../services/bookService");
const bookSchema_1 = require("../zodSchemas/bookSchema");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const getBooks = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, author, rating, availability, sortBy } = req.query;
        const books = yield bookService_1.bookService.getBooks({
            category: category,
            author: author,
            rating: rating ? parseInt(rating) : undefined,
            availability: availability,
            sortBy: sortBy,
        });
        res.json(books);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
}));
const getBookById = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield bookService_1.bookService.getBookById(parseInt(req.params.id));
        if (!book)
            return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching book', error });
    }
}));
const createBook = [
    (0, validationMiddleware_1.validationMiddleware)(bookSchema_1.bookSchema),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('inside creating boook ++++++++++++++++++++++++');
        try {
            if (!req.files ||
                typeof req.files !== 'object' ||
                !('coverImage' in req.files) ||
                !('ebookFile' in req.files)) {
                return res.status(400).json({ message: 'Cover image and ebook file are required' });
            }
            const { coverImage, ebookFile } = req.files;
            if (!coverImage || !ebookFile) {
                return res.status(400).json({ message: 'Cover image and ebook file are required' });
            }
            const coverImageResult = yield cloudinary_1.default.uploader.upload(coverImage[0].path);
            const ebookFileResult = yield cloudinary_1.default.uploader.upload(ebookFile[0].path, { resource_type: 'raw' });
            const book = yield bookService_1.bookService.createBook(Object.assign(Object.assign({}, req.body), { coverImage: coverImageResult.secure_url, ebookUrl: ebookFileResult.secure_url }));
            res.status(201).json(book);
        }
        catch (error) {
            res.status(500).json({ message: 'Error creating book', error });
        }
    }),
];
const updateBook = [
    (0, validationMiddleware_1.validationMiddleware)(bookSchema_1.updateBookSchema),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let coverImage, ebookFile;
            if (req.files &&
                typeof req.files === 'object' &&
                'coverImage' in req.files &&
                'ebookFile' in req.files) {
                ({ coverImage, ebookFile } = req.files);
            }
            const updateData = Object.assign({}, req.body);
            if (coverImage) {
                const coverImageResult = yield cloudinary_1.default.uploader.upload(coverImage[0].path);
                updateData.coverImage = coverImageResult.secure_url;
            }
            if (ebookFile) {
                const ebookFileResult = yield cloudinary_1.default.uploader.upload(ebookFile[0].path, { resource_type: 'raw' });
                updateData.ebookUrl = ebookFileResult.secure_url;
            }
            const book = yield bookService_1.bookService.updateBook(parseInt(req.params.id), updateData);
            if (!book)
                return res.status(404).json({ message: 'Book not found' });
            res.json(book);
        }
        catch (error) {
            res.status(500).json({ message: 'Error updating book', error });
        }
    }),
];
const deleteBook = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield bookService_1.bookService.deleteBook(parseInt(req.params.id));
        if (!book)
            return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
    }
}));
exports.bookController = {
    updateBook,
    deleteBook,
    getBookById,
    getBooks,
    createBook
};
