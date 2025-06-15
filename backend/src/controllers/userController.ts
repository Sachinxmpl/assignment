import { Request, Response, RequestHandler } from 'express';
import { userService } from '../services/userService';
import { borrowService } from '../services/borrowService';
import { logger } from '../utils/logger';
import { CustomRequest } from '../types/type';

const getUsers = (async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    logger.error('Error fetching users', error);
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
}) as RequestHandler;

const updateUser = (async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const user = await userService.updateUser(parseInt(id), data);
    logger.info(`User updated: ${id}`);
    res.json(user);
  } catch (error) {
    logger.error('Error updating user', error);
    res.status(400).json({ message: 'User update failed', error });
  }
}) as RequestHandler;

const deleteUser = (async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(parseInt(id));
    logger.info(`User deleted: ${id}`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Error deleting user', error);
    res.status(400).json({ message: 'User deletion failed', error });
  }
}) as RequestHandler;

const getUserBorrows = (async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const borrows = await borrowService.getBorrowHistory(userId);
    res.json(borrows);
  } catch (error) {
    logger.error('Error fetching user borrows', error);
    res.status(500).json({ message: 'Failed to fetch borrows', error });
  }
}) as RequestHandler;

export const userController = {
  getUsers,
  updateUser,
  deleteUser,
  getUserBorrows,
};
