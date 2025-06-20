import { Request, Response } from 'express';
import dbclient from '../config/db';
import { logger } from '../utils/logger';

export const categoryController = {
    createCategory: async (req: Request, res: Response) => {
        try {
            const { name } = req.body;
            const category = await dbclient.category.create({ data: { name } });
            logger.info(`Category created: ${name}`);
            res.status(201).json(category);
        } catch (error) {
            logger.error('Error creating category', error);
            res.status(400).json({ message: 'Category creation failed', error });
        }
    },

    getCategories: async (req: Request, res: Response) => {
        try {
            const categories = await dbclient.category.findMany();
            console.log(categories)
            res.json(categories);
        } catch (error) {
            logger.error('Error fetching categories', error);
            res.status(500).json({ message: 'Failed to fetch categories', error });
        }
    },

    updateCategory: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const category = await dbclient.category.update({
                where: { id: parseInt(id) },
                data: { name },
            });
            logger.info(`Category updated: ${id}`);
            res.json(category);
        } catch (error) {
            logger.error('Error updating category', error);
            res.status(400).json({ message: 'Category update failed', error });
        }
    },

    deleteCategory: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await dbclient.category.delete({ where: { id: parseInt(id) } });
            logger.info(`Category deleted: ${id}`);
            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            logger.error('Error deleting category', error);
            res.status(400).json({ message: 'Category deletion failed', error });
        }
    },
};