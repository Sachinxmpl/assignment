"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.get('/', categoryController_1.categoryController.getCategories);
router.post('/', authMiddleware_1.protected_route, (0, roleMiddleware_1.restrictTo)('ADMIN'), categoryController_1.categoryController.createCategory);
router.put('/:id', authMiddleware_1.protected_route, (0, roleMiddleware_1.restrictTo)('ADMIN'), categoryController_1.categoryController.updateCategory);
router.delete('/:id', authMiddleware_1.protected_route, (0, roleMiddleware_1.restrictTo)('ADMIN'), categoryController_1.categoryController.deleteCategory);
exports.default = router;
