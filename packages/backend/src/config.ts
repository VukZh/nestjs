import * as dotenv from 'dotenv';

dotenv.config();

export const isLoggingEnabled = process.env.LOG_DEBUG === 'true' || false;
