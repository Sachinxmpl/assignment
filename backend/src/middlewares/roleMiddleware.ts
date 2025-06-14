import { Request, Response, NextFunction } from 'express';

export const restrictTo = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes((req.user as any).role)) {
      res.status(403).json({ message: 'Access denied' });
      return
    }
    next();
  };
};