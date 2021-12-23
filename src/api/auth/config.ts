// const dotenv = require('dotenv');

// dotenv.config({ path: './src/libraries/config/config.env' });

interface envEnv {
    NODE_ENV: string | undefined,
    PORT: string | undefined,
    PROD: string | undefined
}

interface JwtEnv {
    SECRET: string | undefined,
    EXPIRES: string | undefined
}

const { env } = process;

export const jwt: JwtEnv = {
    SECRET: env.JWT_SECRET,
    EXPIRES: env.JWT_EXPIRES
}

export const ENV: envEnv = {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
    PROD: env.PROD,
};
