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
exports.reviewController = exports.getReviews = exports.createReview = void 0;
const db_1 = __importDefault(require("../config/db"));
const reviewSchema_1 = require("../zodSchemas/reviewSchema");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const logger_1 = require("../utils/logger");
exports.createReview = [
    (0, validationMiddleware_1.validationMiddleware)(reviewSchema_1.reviewSchema),
    ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { bookId, rating, comment } = req.body;
            const userId = req.user.id;
            // Ensure the user has borrowed and returned the book
            const borrow = yield db_1.default.borrow.findFirst({
                where: { userId, bookId, returnDate: { not: null } },
            });
            if (!borrow) {
                return res.status(403).json({ message: 'Only users who borrowed and returned this book can review' });
            }
            const review = yield db_1.default.review.create({
                data: { userId, bookId, rating, comment },
            });
            logger_1.logger.info(`Review created for book ${bookId} by user ${userId}`);
            res.status(201).json(review);
        }
        catch (error) {
            logger_1.logger.error('Error creating review', error);
            res.status(400).json({ message: 'Review creation failed', error });
        }
    })),
];
exports.getReviews = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.query;
        const reviews = yield db_1.default.review.findMany({
            where: bookId ? { bookId: parseInt(bookId) } : {},
            include: {
                user: {
                    select: { name: true },
                },
            },
        });
        res.json(reviews);
    }
    catch (error) {
        logger_1.logger.error('Error fetching reviews', error);
        res.status(500).json({ message: 'Failed to fetch reviews', error });
    }
}));
exports.reviewController = {
    createReview: exports.createReview,
    getReviews: exports.getReviews,
};
