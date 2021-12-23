
const { env } = process;

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

export const ENV: envEnv = {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
    PROD: env.PROD,
};

export const database: DatabaseEnv = {
    DB: env.DATABASE,
    LOCAL: env.DB_LOCAL,
    NAME: env.DB_NAME,
    PASSWORD: env.DB_PASSWORD,
};
