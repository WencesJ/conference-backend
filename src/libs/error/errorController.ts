import AppError from './appError';
import { NextFunction, Request, Response } from 'express';
import { CastError, Error } from 'mongoose';
import CONSTANTS from '../shared/constants';

type GeneralError = AppError & CastError & Error;

type CustomErrorFunc = (error?: GeneralError) => typeof AppError;

type CustomErrorHandler = { [unit: string]: GeneralError } | CustomErrorFunc;

const {
    MSG,
    STATUS,
    MONGOOSE_ERROR,
    ENV: { PRODUCTION, DEVELOPMENT },
} = CONSTANTS;

// CAST ERROR (INVALID VALUE)
const handleCastErrorDB = (err: CastError) => {
    const message = `Invalid ${err.path} - ${err.value}`;
    return new AppError(message, STATUS.BAD_REQUEST);
};

// DUPLICATE ERROR (MORE THAN ONE VALUE)
const handleDuplicateErrorDB = (err: { [unit: string]: any }) => {
    const errorKeys = Object.keys(err.keyValue);
    const message = `Duplicate field value: ${
        err.keyValue[errorKeys[0]]
    } already exist. Please use another value`;

    return new AppError(message, STATUS.CONFLICT);
};

// VALIDATION ERROR (VALUE DOESN'T MATCH EXPECTED VALUE)
const handleValidationErrorDB = (err: Error.ValidationError) => {
    const errors = Object.values(err.errors).map((el) => el.message);

    const message = `Invalid Input Data: ${errors
        .join('. ')
        .replace(/"/g, `'`)}`;

    return new AppError(message, STATUS.BAD_REQUEST);
};

// JSON INVALID TOKEN
const handleJWTError = () =>
    new AppError('Invalid Token. Please Log In.', STATUS.UNAUTHORIZED);

// JSON EXPIRED TOKEN
const handleTokenExpiredError = () =>
    new AppError(
        'Token has expired!. Please Log In Again',
        STATUS.UNAUTHORIZED
    );

// Error Controllers

// DEVELOPMENT ENVIRONMENT ERROR HANDLER
const sendErrDev = (err: AppError, req: Request, res: Response) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err,
        });
    }

    return res.status(err.statusCode).render('error', {
        title: 'Something Went Wrong!',
        message: err.message,
    });
};

// PRODUCTION ENVIRONMENT ERROR HANDLER
const sendErrProd = (err: AppError, req: Request, res: Response) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }

        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: MSG.ERROR,
            message: 'Something went wrong',
        });
    }

    const message = err.isOperational ? err.message : 'Please Try Again Later!';

    return res.status(err.statusCode).render('error', {
        title: 'Something Went Wrong!',
        message,
    });
};

const errorController = (
    err: GeneralError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || STATUS.INTERNAL_SERVER_ERROR;
    err.status = err.status || MSG.ERROR;

    if (process.env.NODE_ENV !== DEVELOPMENT) {
        // send error response
        sendErrDev(err, req, res);
    } else if (process.env.NODE_ENV !== PRODUCTION) {
        let error: CustomErrorHandler | any = { ...err, name: err.name, message: err.message };
        // eslint-disable-next-line no-proto
        // error.__proto__ = err;
        if (error.name === MONGOOSE_ERROR.CAST_ERROR)
            error = handleCastErrorDB(error);

        if (error.name === MONGOOSE_ERROR.VALIDATION_ERROR)
            error = handleValidationErrorDB(error);

        if (error.code === 11000) error = handleDuplicateErrorDB(error);

        if (error.name === MONGOOSE_ERROR.JSON_WEB_TOKEN_ERROR)
            error = handleJWTError();

        if (error.name === MONGOOSE_ERROR.TOKEN_EXPIRED_ERROR)
            error = handleTokenExpiredError();

        sendErrProd(error, req, res);

        next();
    }
};

export default errorController;
