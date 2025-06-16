import { Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { userService } from '../services/userService';
import { registerSchema, loginSchema } from '../zodSchemas/userSchema';
import { logger } from '../utils/logger';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { CustomRequest } from '../types/type';
import dbclient from '../config/db';

const register = [
    validationMiddleware(registerSchema),
    (async (req: Request, res: Response) => {
        try {
            const { email, password, name } = req.body;
            const user = await userService.register(email, password, name);
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: '1d' }
            );
            logger.info(`User registered: ${email}`);
            res.status(201).json({
                user: { id: user.id, email: user.email, name: user.name, role: user.role },
                token,
            });
        } catch (error: any) {
            logger.error('Error registering user', error);
            res.status(400).json({
                message: error.message === 'Email already exists' ? 'Email already exists' : 'Registration failed',
                error,
            });
        }
    }) as RequestHandler,
];

const login = [
    validationMiddleware(loginSchema),
    (async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await userService.login(email, password);
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: '1d' }
            );
            logger.info(`User logged in: ${email}`);
            res.json({
                user: { id: user.id, email: user.email, name: user.name, role: user.role },
                token,
            });
        } catch (error: any) {
            logger.error('Error logging in user', error);
            res.status(401).json({
                message: error.message === 'Invalid credentials' ? 'Invalid email or password' : 'Login failed',
                error,
            });
        }
    }) as RequestHandler,
];

const getCurrentUser = (async (req: CustomRequest, res: Response) => {
    try {
        const user = await dbclient.user.findUnique({
            where: { id: req.user!.id },
            select: { id: true, email: true, name: true, role: true },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        logger.info(`Fetched current user: ${user.email}`);
        res.json(user);
    } catch (error) {
        logger.error('Error fetching current user', error);
        res.status(500).json({ message: 'Failed to fetch user', error });
    }
}) as RequestHandler;

const googleCallback = (async (req: CustomRequest, res: Response) => {
    console.log("Inside backend google backback url ")
    try {
        const user = req.user as any;
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );
        logger.info(`Google OAuth login: ${user.email}`);
        res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
    } catch (error) {
        logger.error('Google OAuth callback error', error);
        res.status(500).json({ message: 'Google OAuth failed', error });
    }
}) as RequestHandler;

const logout = (async (_req: Request, res: Response) => {
    try {
        logger.info('User logged out');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        logger.error('Error logging out', error);
        res.status(500).json({ message: 'Logout failed', error });
    }
}) as RequestHandler;

export const authController = {
    register,
    login,
    getCurrentUser,
    googleCallback,
    logout,
};
