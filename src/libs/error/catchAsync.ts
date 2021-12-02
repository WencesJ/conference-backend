import { Request, Response, NextFunction, RequestHandler } from 'express';

declare let _logger: any;

const catchAsync = (fn: Function): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch((err: Error) => {
            _logger.error(err.stack);
            next(err);
        });
    };
};

export default catchAsync;
