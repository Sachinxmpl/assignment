import { createWriteStream } from 'fs';
import { join } from 'path';

const logStream = createWriteStream(join(__dirname, '../../logs/app.log'), { flags: 'a' });

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