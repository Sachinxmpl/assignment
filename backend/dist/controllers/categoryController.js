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
exports.categoryController = void 0;
const db_1 = __importDefault(require("../config/db"));
const logger_1 = require("../utils/logger");
exports.categoryController = {
    createCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            const category = yield db_1.default.category.create({ data: { name } });
            logger_1.logger.info(`Category created: ${name}`);
            res.status(201).json(category);
        }
        catch (error) {
            logger_1.logger.error('Error creating category', error);
            res.status(400).json({ message: 'Category creation failed', error });
        }
    }),
    getCategories: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categories = yield db_1.default.category.findMany();
            res.json(categories);
        }
        catch (error) {
            logger_1.logger.error('Error fetching categories', error);
            res.status(500).json({ message: 'Failed to fetch categories', error });
        }
    }),
    updateCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const category = yield db_1.default.category.update({
                where: { id: parseInt(id) },
                data: { name },
            });
            logger_1.logger.info(`Category updated: ${id}`);
            res.json(category);
        }
        catch (error) {
            logger_1.logger.error('Error updating category', error);
            res.status(400).json({ message: 'Category update failed', error });
        }
    }),
    deleteCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield db_1.default.category.delete({ where: { id: parseInt(id) } });
            logger_1.logger.info(`Category deleted: ${id}`);
            res.json({ message: 'Category deleted successfully' });
        }
        catch (error) {
            logger_1.logger.error('Error deleting category', error);
            res.status(400).json({ message: 'Category deletion failed', error });
        }
    }),
};
