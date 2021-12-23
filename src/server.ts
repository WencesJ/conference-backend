/* eslint-disable no-unused-vars */
require('dotenv').config({ path: './src/libs/config/config.env' });

import './_globals';

import { Logger } from 'winston';

import CONFIG from '@libs/config';

import { DBConnection } from 'api/database';

// importing express app
import { app_init } from './app';

interface customLogger extends Logger {
    exception: (name: Error) => Logger;

    rejection: (name: Error) => Logger;
}

declare let _logger: customLogger;

// end of requiring core  and 3rd party modules

const {
    config: { ENV },
} = CONFIG;

// HANDLING uncaughtException event
process.on('uncaughtException', (err) => {
    _logger.log(
        'error',
        '❌❌❌ ➡ ⬇⬇⬇ An Error occured -> UNCAUGHT EXCEPTION ERROR ⬇⬇⬇'
    );
    const error = {
        name: err.name,
        message: err.message,
        stack: err.stack,
    };

    // log error to console
    _logger.log('error', error.stack);

    // send error to log file
    _logger.exception(error);

    setTimeout(() => {
        process.exit(1);
    }, 100);
});

// connecting database
DBConnection();

const PORT = ENV.PORT;

//listening to app
const app = app_init();
const server = app.listen(PORT, async () => {
    _logger.log(
        'info',
        `ℹℹℹ LISTENING TO SERVER http://127.0.0.1:${PORT}/api/v1 ON PORT ${PORT} ℹℹℹ`
    );
});

// HANDLING unhandledRejection events
process.on('unhandledRejection', async (err: Error) => {
    _logger.log(
        'error',
        '❌❌❌ ➡ ⬇⬇⬇ An Error occured -> UNHANDLED REJECTION ERROR ⬇⬇⬇'
    );
    const error = {
        name: err.name,
        message: err.message,
        stack: err.stack,
    };

    // log error to console
    _logger.log('error', error);

    // send error to log file
    _logger.rejection(error);

    server.close(() => {
        process.exit(1);
    });
});

module.exports = server;
