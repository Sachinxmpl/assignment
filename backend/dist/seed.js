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
const db_1 = __importDefault(require("../src/config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield bcryptjs_1.default.hash('adminlogin', 10);
        yield db_1.default.user.upsert({
            where: { email: 'admin@example.com' },
            update: {},
            create: {
                email: 'admin@gmail.com',
                password: hashedPassword,
                name: 'Admin',
                role: 'ADMIN',
            },
        });
        // Create categories
        const categories = [
            { name: 'Fiction' },
            { name: 'Non-Fiction' },
            { name: 'Science' },
            { name: 'History' },
        ];
        for (const category of categories) {
            yield db_1.default.category.upsert({
                where: { name: category.name },
                update: {},
                create: category,
            });
        }
        console.log('Database seeded successfully');
    });
}
main()
    .catch((e) => {
    console.error('Seeding failed:', e);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.$disconnect();
}));
