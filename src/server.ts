/* eslint-disable no-unused-vars */

import './_globals';

import { Logger } from 'winston';

import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config({ path: './src/libs/config/config.env' });

import CONFIG from '@libs/config';


interface customLogger extends Logger {
    exception: (name: Error) => Logger;

    rejection: (name: Error) => Logger;
}

declare let _logger: customLogger;

// end of requiring core  and 3rd party modules

const {
    config: { ENV, database },
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

// connecting to database

const DB_PROD = database.DB!.replace('<dbname>', database.NAME!)
    .replace('<password>', database.PASSWORD!);

const PORT = ENV.PORT;

const DB_DEV = database.LOCAL;

const DATABASE = ENV.NODE_ENV === 'development' ? DB_DEV : DB_PROD;

mongoose
    .connect(DATABASE!, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {
        _logger.log('info', '✅✅✅ ➡ DATABASE CONNECTION IS SUCCESSFUL!');
    })
    .catch((err: Error) => {
        // log to console
        err.message += " Incorrect/Invalid Database string or Invalid Mongoose options.\nPlease make sure your mongodb connection string '`${DATABASE}`' is correct and your mongoose options are correct."
        
        _logger.log('error', err.message);
        console.log(err);
        // save to error log file
        _logger.error(err);
    });

// importing express app
import app from './app';

//listening to app
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
