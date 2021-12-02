import winston from 'winston';

import path from 'path';

// const terminalColors = winston.format.cli({ colors: { info: 'blue' } });

const myFormat = winston.format.combine(
    winston.format.colorize({
        colors: { info: 'blue', error: 'red', warn: 'yellow' },
    }),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
        (info) => `${info.timestamp}:${info.level}:${info.message}`
    )
);

const jsonFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
);

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: myFormat,
        }),

        new winston.transports.File({
            filename: `${path.join(__dirname, '/logs/error.log')}`,
            level: 'error',
            maxsize: Infinity,
            format: jsonFormat,
        }),
    ],
});

const logMessage = (level: string, message: string) =>
    logger.log(level, message);

export default logMessage;
