"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const uuid_1 = require("uuid");
const logger_1 = require("../utils/logger");
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const env = process.env.NODE_ENV || "development";
    const errorId = (0, uuid_1.v4)();
    const message = err.message || "Internal Server Error";
    logger_1.logger.error(`Error [${errorId}] on ${req.method} ${req.originalUrl}`, {
        message,
        stack: err.stack,
        code: err.code,
        status: statusCode,
        path: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    res.status(statusCode).json(Object.assign({ success: false, message, code: err.code || "Internal_error", errorId }, (env === "development" && {
        stack: err.stack,
        details: err.details,
    })));
};
exports.errorMiddleware = errorMiddleware;
