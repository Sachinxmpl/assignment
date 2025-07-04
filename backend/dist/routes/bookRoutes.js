"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const multer_1 = __importDefault(require("multer"));
const bookController_1 = require("../controllers/bookController");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.get('/', bookController_1.bookController.getBooks);
router.get('/:id', bookController_1.bookController.getBookById);
router.post('/', authMiddleware_1.protected_route, (0, roleMiddleware_1.restrictTo)('ADMIN'), upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'ebookFile', maxCount: 1 }]), bookController_1.bookController.createBook);
router.put('/:id', authMiddleware_1.protected_route, (0, roleMiddleware_1.restrictTo)('ADMIN'), upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'ebookFile', maxCount: 1 }]), bookController_1.bookController.updateBook);
router.delete('/:id', authMiddleware_1.protected_route, (0, roleMiddleware_1.restrictTo)('ADMIN'), bookController_1.bookController.deleteBook);
exports.default = router;
