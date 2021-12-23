import mongoose from 'mongoose';
import { Logger } from 'winston';

declare let _logger: Logger;

interface DatabaseEnv {
    DB: string | undefined,
    LOCAL: string | undefined,
    NAME: string | undefined,
    PASSWORD: string | undefined
}

interface envEnv {
    NODE_ENV: string | undefined,
    PORT: string | undefined,
    PROD: string | undefined
}

export async function connectDB(database: DatabaseEnv, ENV: envEnv) {
    const DB_PROD = database.DB!.replace('<dbname>', database.NAME!)
    .replace('<password>', database.PASSWORD!);

    const DB_DEV = database.LOCAL;

    const DATABASE = ENV.NODE_ENV === 'development' ? DB_DEV : DB_PROD;

    try {
        await mongoose.connect(DATABASE!, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })

        _logger.log('info', '✅✅✅ ➡ DATABASE CONNECTION IS SUCCESSFUL!');

    } catch (err: any) {
        // log to console
        err.message += " Incorrect/Invalid Database string or Invalid Mongoose options.\nPlease make sure your mongodb connection string '`${DATABASE}`' is correct and your mongoose options are correct."
            
        _logger.log('error', err.message);
        console.log(err);
        // save to error log file
        _logger.error(err);
    }
}