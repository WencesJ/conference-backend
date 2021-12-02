import mongoose from 'mongoose';
import mongoConnect from 'connect-mongo';

import CONFIG from '../../config';

const rateLimit = require('express-rate-limit');

const {
    config: { session, ENV },
} = CONFIG;

export const rateLimiter = (max: number) =>
    rateLimit({
        max,
        windowMs: 60 * 60 * 1000,
        message: 'Too many requests! Please try again in one hour time',
    });

export const selectProps = <T, U extends keyof T>(obj: T, props: U[]) => {
    let newObj: any;

    props.forEach((el) => {
        if (obj[el]) newObj[el] = obj[el];
    });

    return newObj;
};

// exports.fieldplugout = <T, U extends keyof T>(obj: T, props: U[]) => {
//     const keys = Object.keys(obj);

//     keys.forEach((el) => {
//         if (props.includes(el)) delete obj[el];
//     });

//     return obj;
// };

export const corsOptions = {
    origin: true,

    credentials: true,

    allowHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'Authorization',
    ],

    exposedHeaders: ['Content-Range', 'X-Content-Range', 'Set-Cookie'],
};

export const sessionParams = (expressSession: any) => {
    const MongoStore = mongoConnect(expressSession);

    const mongoStoreInstance = new MongoStore({
        mongooseConnection: mongoose.connection,
        secret: session.STORE_SECRET,
        ttl: session.STORE_TTL ? +session.STORE_TTL : undefined,
    });

    const environment = ENV.NODE_ENV === ENV.PROD;

    return {
        secret: session.SECRET!,
        name: session.NAME,
        cookie: {
            httpOnly: true,
            secure: environment,
            // sameSite: environment ? 'none' : 'lax',
            maxAge: session.COOKIE_MAX_AGE
                ? +session.COOKIE_MAX_AGE * 60 * 24
                : Date.now() * 60 * 24, // Time in milliseconds
        },
        saveUninitialized: false,

        resave: false,
        proxy: true,
        store: mongoStoreInstance,
        unset: 'destroy' as 'destroy',
    };
};
