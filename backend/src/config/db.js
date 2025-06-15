"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prismaSingletonClient = function () {
    return new client_1.PrismaClient();
};
var prismaClient = (_a = globalThis.prismaGlobal) !== null && _a !== void 0 ? _a : prismaSingletonClient();
exports.default = prismaClient;
if (process.env.NODE_ENV !== 'production')
    globalThis.prismaGlobal = prismaClient;
