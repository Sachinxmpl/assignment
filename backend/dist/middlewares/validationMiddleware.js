"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const logger_1 = require("../utils/logger");
const validationMiddleware = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            logger_1.logger.error('Validation error', error);
            res.status(400).json({ message: 'Validation failed', errors: error });
        }
    };
};
exports.validationMiddleware = validationMiddleware;
