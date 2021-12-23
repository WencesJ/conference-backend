class AppError extends Error {
    status: string;
    isOperational: boolean;
    time: string;
    constructor(public message: string, public statusCode: number, public user?: string, name?: string) {
        super(message);

        if (name) {
            this.name = name;
        }

        this.message = message;

        this.statusCode = statusCode;

        this.status = `${this.statusCode}`.startsWith('4') ? 'Fail' : 'Error';

        this.isOperational = true;

        this.time = new Date().toLocaleString();

        if (user) {
            this.user = user;
        }

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
