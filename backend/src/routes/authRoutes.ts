import express from 'express'
import passport from 'passport'
import {authController} from "../controllers/authController"
import { protected_route } from '../middlewares/authMiddleware';

const router = express.Router()

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), authController.googleCallback);
router.get('/me', protected_route, authController.getCurrentUser);
router.post('/logout', authController.logout);

export default router;