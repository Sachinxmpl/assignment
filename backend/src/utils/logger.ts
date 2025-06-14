import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const logPath = join(__dirname, '../../logs/app.log');
const logDir = dirname(logPath);

//  Create logs directory if it doesn't exist
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

const logStream = createWriteStream(logPath, { flags: 'a' });

export const logger = {
  info: (message: string) => {
    const log = `[${new Date().toISOString()}] INFO: ${message}\n`;
    logStream.write(log);
    console.log(log);
  },
  error: (message: string, error?: any) => {
    const log = `[${new Date().toISOString()}] ERROR: ${message}${error ? ` - ${error}` : ''}\n`;
    logStream.write(log);
    console.error(log);
  },
};
