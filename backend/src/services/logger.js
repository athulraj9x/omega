// utils/logger.js
const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');

// Ensure logs folder exists
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = createLogger({
    level: 'info', // or 'debug' during development
    format: format?.combine(
        format?.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format?.errors({ stack: true }),
        format?.json()
    ),
    defaultMeta: { service: 'backend' },
    transports: [
        new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        new transports.File({ filename: path.join(logDir, 'combined.log') }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format?.combine(
            format?.colorize(),
            format?.printf(({ level, message, timestamp, stack }) => {
                return `${timestamp} [${level}]: ${stack || message}`;
            })
        ),
    }));
}

module.exports = logger;
