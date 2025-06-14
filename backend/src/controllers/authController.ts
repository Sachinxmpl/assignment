import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { userService } from "../services/userService";
import { registerSchema, loginSchema } from "../zodSchemas/userSchema";
import { logger } from "../utils/logger";
import { validationMiddleware } from "../middlewares/validationMiddleware";

export const authController = {
    register: [
        validationMiddleware(registerSchema),
        async (req: Request, res: Response) => {
            try {
                const { email, password, name } = req.body
                const user = await userService.register(email, password, name)
                const token = jwt.sign({
                    id: user.id,
                }, process.env.JWT_SECRET!, { expiresIn: '1d' })
                logger.info(`User registered: ${email}`)
                res.status(201).json({
                    user, token
                })
            } catch (error) {
                logger.error('Error registering user', error)
                res.status(400).json({
                    message: 'Registration failed',
                    error
                })
            }
        }
    ],
    login: [
        validationMiddleware(loginSchema),
        async (req: Request, res: Response) => {
            try {
                const { email, password } = req.body
                const user = await userService.login(email, password)
                const token = jwt.sign({
                    id: user.id
                }, process.env.JWT_SECRET!, { expiresIn: '1d' })

                logger.info(`User logged in ${email}`)
                res.json({ user, token })
            } catch (error) {
                logger.error('Error logging user', error)
                res.status(401).json({
                    message: 'Error login',
                    error
                })
            }
        }
    ],

    googleCallback: async (req: Request, res: Response) => {
        try {
            const user = req.user as any;
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
            logger.info(`Google OAuth login: ${user.email}`);
            res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
        } catch (error) {
            logger.error('Google OAuth callback error', error);
            res.status(500).json({ message: 'Google OAuth failed' });
        }
    },

}