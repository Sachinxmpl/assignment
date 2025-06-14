"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const logPath = (0, path_1.join)(__dirname, '../../logs/app.log');
const logDir = (0, path_1.dirname)(logPath);
//  Create logs directory if it doesn't exist
if (!(0, fs_1.existsSync)(logDir)) {
    (0, fs_1.mkdirSync)(logDir, { recursive: true });
}
const logStream = (0, fs_1.createWriteStream)(logPath, { flags: 'a' });
exports.logger = {
    info: (message) => {
        const log = `[${new Date().toISOString()}] INFO: ${message}\n`;
        logStream.write(log);
        console.log(log);
    },
    error: (message, error) => {
        const log = `[${new Date().toISOString()}] ERROR: ${message}${error ? ` - ${error}` : ''}\n`;
        logStream.write(log);
        console.error(log);
    },
};
