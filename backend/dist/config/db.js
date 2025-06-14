"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prismaSingletonClient = () => {
    return new client_1.PrismaClient();
};
const prismaClient = (_a = globalThis.prismaGlobal) !== null && _a !== void 0 ? _a : prismaSingletonClient();
exports.default = prismaClient;
if (process.env.NODE_ENV !== 'production')
    globalThis.prismaGlobal = prismaClient;
