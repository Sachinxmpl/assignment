import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";

interface CustomError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;
  const env = process.env.NODE_ENV || "development";
  const errorId = uuidv4();
  const message = err.message || "Internal Server Error";

  logger.error(`Error [${errorId}] on ${req.method} ${req.originalUrl}`, {
    message,
    stack: err.stack,
    code: err.code,
    status: statusCode,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.status(statusCode).json({
    success: false,
    message,
    code: err.code || "Internal_error",
    errorId,
    ...(env === "development" && {
      stack: err.stack,
      details: err.details,
    }),
  });
};
