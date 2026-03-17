import winston from 'winston';
import { join } from 'path';
import __dirname from '../utils/dirname.js';

const { combine, timestamp, printf, errors, json } = winston.format;

const fileFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true })
  ),
  transports: [
    new winston.transports.File({
      filename: join(__dirname, '../logs/combined.log'),
      format: combine(fileFormat)
    }),
    new winston.transports.File({
      filename: join(__dirname, '../logs/error.log'),
      level: 'error',
      format: combine(fileFormat)
    }),
    new winston.transports.Console({
      format: combine(
        winston.format.colorize(),
        fileFormat
      )
    })
  ]
});

export default logger;
