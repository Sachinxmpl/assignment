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
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const error_1 = require("./middlewares/error");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const borrowRoutes_1 = __importDefault(require("./routes/borrowRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
require("./config/passport");
const passport_1 = __importDefault(require("passport"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/auth', authRoutes_1.default);
app.use('/books', bookRoutes_1.default);
app.use('/borrows', borrowRoutes_1.default);
app.use('/categories', categoryRoutes_1.default);
app.use('/reviews', reviewRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use(error_1.errorMiddleware);
const port = process.env.PORT || 3000;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_1.default.$connect();
            console.log("Connected to dataabse");
            app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });
        }
        catch (error) {
            console.log("Failed database connection");
            process.exit(1);
        }
    });
}
startServer();
