// const dotenv = require('dotenv');

// dotenv.config({ path: './src/libraries/config/config.env' });

interface ProcessEnv {
    [unit: string]: string | undefined;
}

const { env } = process;

export const database: ProcessEnv = {
    DB: env.DATABASE,
    LOCAL: env.DB_LOCAL,
    NAME: env.DB_NAME,
    PASSWORD: env.DB_PASSWORD,
};

export const email: ProcessEnv = {
    FROM: env.EMAIL_FROM,
    USER: env.EMAIL_USERNAME,
    PASS: env.EMAIL_PASSWORD,
};

export const session: ProcessEnv = {
    SECRET: env.SESSION_SECRET,
    NAME: env.SESSION_NAME,
    COOKIE_MAX_AGE: env.SESSION_COOKIE_MAX_AGE,
    STORE_SECRET: env.SESSION_STORE_SECRET,
    STORE_TTL: env.SESSION_STORE_TTL,
    ABSOLUTE_TIMEOUT: env.SESSION_ABSOLUTE_TIMEOUT,
};

export const ENV: ProcessEnv = {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
    PROD: env.PROD,
};
