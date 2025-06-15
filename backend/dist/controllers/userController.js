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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const userService_1 = require("../services/userService");
const borrowService_1 = require("../services/borrowService");
const logger_1 = require("../utils/logger");
const getUsers = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userService_1.userService.getUsers();
        res.json(users);
    }
    catch (error) {
        logger_1.logger.error('Error fetching users', error);
        res.status(500).json({ message: 'Failed to fetch users', error });
    }
}));
const updateUser = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = req.body;
        const user = yield userService_1.userService.updateUser(parseInt(id), data);
        logger_1.logger.info(`User updated: ${id}`);
        res.json(user);
    }
    catch (error) {
        logger_1.logger.error('Error updating user', error);
        res.status(400).json({ message: 'User update failed', error });
    }
}));
const deleteUser = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield userService_1.userService.deleteUser(parseInt(id));
        logger_1.logger.info(`User deleted: ${id}`);
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        logger_1.logger.error('Error deleting user', error);
        res.status(400).json({ message: 'User deletion failed', error });
    }
}));
const getUserBorrows = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const borrows = yield borrowService_1.borrowService.getBorrowHistory(userId);
        res.json(borrows);
    }
    catch (error) {
        logger_1.logger.error('Error fetching user borrows', error);
        res.status(500).json({ message: 'Failed to fetch borrows', error });
    }
}));
exports.userController = {
    getUsers,
    updateUser,
    deleteUser,
    getUserBorrows,
};
