import jwt from "jsonwebtoken";
import dbClient from "../config/db";
import { Request, Response, NextFunction } from "express";

export const protected_route = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "NO token provided" });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const user = await dbClient.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            res.status(401).json({ message: "user not found" });
            return;
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
        return;
    }
};
