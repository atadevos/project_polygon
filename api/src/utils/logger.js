import winston from 'winston';
import fs from 'fs';
import path from 'path';

let _logger = null;

export function logger() {

    if(_logger) {
        return _logger;
    }

    const logsDir = process.env.LOG_DIR || './var/logs';

    try {
        fs.mkdirSync(logsDir, { recursive: true });
    } catch (err) {
        console.error('Error creating logs directory:', err);
        process.exit(1);
    }

    console.log(`Logs  : ${logsDir}`);

    _logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.colorize(),
                    winston.format.printf(({ level, message, timestamp }) => {
                        return `${timestamp} ${level}: ${message}`;
                    })
                )
            }),
            new winston.transports.File({
                filename: path.join(logsDir, 'error.log'),
                level: 'error',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                )
            }),
            new winston.transports.File({
                filename: path.join(logsDir, 'combined.log'),
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                )
            })
        ]
    });

    return _logger;

}

export default logger;