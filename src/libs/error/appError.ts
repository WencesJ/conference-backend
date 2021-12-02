class AppError extends Error {
    status: string;
    isOperational: boolean;
    constructor(public message: string, public statusCode: number) {
        super(message);

        this.message = message;

        this.statusCode = statusCode;

        this.status = `${this.statusCode}`.startsWith('4') ? 'Fail' : 'Error';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
