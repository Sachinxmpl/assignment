"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookSchema = exports.bookSchema = void 0;
const zod_1 = require("zod");
exports.bookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    author: zod_1.z.string().min(1, 'Author is required'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    categoryId: zod_1.z.coerce.number().int().positive('Valid category ID is required'),
    totalCopies: zod_1.z.coerce.number().int().min(1, 'At least one copy is required'),
});
exports.updateBookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').optional(),
    author: zod_1.z.string().min(1, 'Author is required').optional(),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters').optional(),
    categoryId: zod_1.z.coerce.number().int().positive('Valid category ID is required'),
    totalCopies: zod_1.z.coerce.number().int().min(1, 'At least one copy is required'),
});
