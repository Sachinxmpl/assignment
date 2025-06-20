"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const borrowController_1 = require("../controllers/borrowController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protected_route, borrowController_1.borrowController.borrowBook);
router.post('/return/:id', authMiddleware_1.protected_route, borrowController_1.borrowController.returnBook);
router.get('/history', authMiddleware_1.protected_route, borrowController_1.borrowController.getBorrowHistory);
router.get('/export', authMiddleware_1.protected_route, (0, roleMiddleware_1.restrictTo)('ADMIN'), borrowController_1.borrowController.exportBorrowHistory);
router.get('/borrow-id', authMiddleware_1.protected_route, borrowController_1.borrowController.getBorrowId);
exports.default = router;
