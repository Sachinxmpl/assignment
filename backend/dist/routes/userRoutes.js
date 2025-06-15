"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.protected_route, (0, roleMiddleware_1.restrictTo)('ADMIN'), userController_1.userController.getUsers);
router.put('/:id', authMiddleware_1.protected_route, (0, roleMiddleware_1.restrictTo)('ADMIN'), userController_1.userController.updateUser);
router.delete('/:id', authMiddleware_1.protected_route, (0, roleMiddleware_1.restrictTo)('ADMIN'), userController_1.userController.deleteUser);
router.get('/borrows', authMiddleware_1.protected_route, userController_1.userController.getUserBorrows);
exports.default = router;
