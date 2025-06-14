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
exports.userService = void 0;
const db_1 = __importDefault(require("../config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.userService = {
    register: (email, password, name) => __awaiter(void 0, void 0, void 0, function* () {
        const hashedpassword = yield bcryptjs_1.default.hash(password, 10);
        return db_1.default.user.create({
            data: {
                email,
                password: hashedpassword,
                name,
                role: 'USER'
            }
        });
    }),
    login: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield db_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (!user || !user.password) {
            throw new Error('Invalid Credentials');
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid Credentials');
        }
        return user;
    }),
    getUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        return db_1.default.user.findMany({
            select: {
                id: true, email: true, name: true, role: true
            }
        });
    }),
    updateUser: (id, data) => __awaiter(void 0, void 0, void 0, function* () {
        return db_1.default.user.update({
            where: { id },
            data
        });
    }),
    deleteUser: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return db_1.default.user.delete({
            where: {
                id
            }
        });
    })
};
