"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("../services/userService");
const userSchema_1 = require("../zodSchemas/userSchema");
const logger_1 = require("../utils/logger");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const db_1 = __importDefault(require("../config/db"));
const register = [
    (0, validationMiddleware_1.validationMiddleware)(userSchema_1.registerSchema),
    ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password, name } = req.body;
            const user = yield userService_1.userService.register(email, password, name);
            const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
            logger_1.logger.info(`User registered: ${email}`);
            res.status(201).json({
                user: { id: user.id, email: user.email, name: user.name, role: user.role },
                token,
            });
        }
        catch (error) {
            logger_1.logger.error('Error registering user', error);
            res.status(400).json({
                message: error.message === 'Email already exists' ? 'Email already exists' : 'Registration failed',
                error,
            });
        }
    })),
];
const login = [
    (0, validationMiddleware_1.validationMiddleware)(userSchema_1.loginSchema),
    ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield userService_1.userService.login(email, password);
            const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
            logger_1.logger.info(`User logged in: ${email}`);
            res.json({
                user: { id: user.id, email: user.email, name: user.name, role: user.role },
                token,
            });
        }
        catch (error) {
            logger_1.logger.error('Error logging in user', error);
            res.status(401).json({
                message: error.message === 'Invalid credentials' ? 'Invalid email or password' : 'Login failed',
                error,
            });
        }
    })),
];
const getCurrentUser = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.default.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, name: true, role: true },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        logger_1.logger.info(`Fetched current user: ${user.email}`);
        res.json(user);
    }
    catch (error) {
        logger_1.logger.error('Error fetching current user', error);
        res.status(500).json({ message: 'Failed to fetch user', error });
    }
}));
const googleCallback = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Inside backend google backback url ");
    try {
        const user = req.user;
        console.log("SO the user is ");
        console.log(user);
        if (!user) {
            logger_1.logger.error('Google OAuth callback error: user is undefined');
            return res.status(400).json({ message: 'User information not found in request' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        logger_1.logger.info(`Google OAuth login: ${user.email}`);
        res.redirect(`${process.env.FRONTEND_URL}`);
    }
    catch (error) {
        logger_1.logger.error('Google OAuth callback error', error);
        res.status(500).json({ message: 'Google OAuth failed', error });
    }
}));
const logout = ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info('User logged out');
        res.json({ message: 'Logged out successfully' });
    }
    catch (error) {
        logger_1.logger.error('Error logging out', error);
        res.status(500).json({ message: 'Logout failed', error });
    }
}));
exports.authController = {
    register,
    login,
    getCurrentUser,
    googleCallback,
    logout,
};
