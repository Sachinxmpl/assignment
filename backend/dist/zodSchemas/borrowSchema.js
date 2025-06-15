"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowSchema = void 0;
const zod_1 = require("zod");
exports.borrowSchema = zod_1.z.object({
    bookId: zod_1.z.number().int().positive('Valid book ID is Required'),
});
