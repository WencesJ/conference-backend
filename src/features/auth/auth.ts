/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */

import { Request, Response, NextFunction, RequestHandler } from 'express';

import { Logger } from 'winston';

import { catchAsync, AppError } from '@libs/error';

import CONSTANTS from '@libs/shared/constants';

const { STATUS } = CONSTANTS;

import { Session } from 'express-session';

interface RequestWithCustomPrpos extends Request {
    user?: { [unit: string]: any };
}

export type SessionWithCustomPrpos = Session & {
    email?: string;
    password?: string | number;
    token?: number;
    tokenExpires?: number;
    passwordTimer?: number;
};

export type CustomRequest = RequestWithCustomPrpos &
    SessionWithCustomPrpos & {
        session?: SessionWithCustomPrpos;
    };

declare let _logger: Logger;

interface UserServiceType {
    [unit: string]: any;
}

// end requiring the modules
class Authentication {
    public Service: UserServiceType;

    constructor(ComponentService: UserServiceType) {
        this.Service = ComponentService;
    }

    authorizedUser = catchAsync(
        async (req: CustomRequest, _: Response, next: NextFunction) => {
        const active_user = req.user;
        
        req.params = active_user
          ? {
              _id: active_user._id,
              ...req.params,
            }
          : {
              ...req.params,
            };
    
        req.query =
          active_user
            ? {
                _id: active_user._id,
                ...req.query,
              }
            : {
                ...req.query,
              };
    
        next();
      });

    authorization: RequestHandler = catchAsync(
        async (req: CustomRequest, _: Response, next: NextFunction) => {
            const { email, password }: { [x: string]: any } = req.session
                ? req.session
                : {};

            const { value } = await this.Service.logIn({ email, password });

            if (value !== undefined) {
                req.user = value.data;

                return next();
            }

            next(
                new AppError(
                    'Authentication Failed. Please Log In!',
                    STATUS.UNAUTHORIZED
                )
            );
        }
    );

    signUp: RequestHandler = catchAsync(async (req: Request, res: Response) => {
        const contestantDetails = { ...req.body };

        const { value: { data: user = {} } = {} } = await this.Service.create(
            contestantDetails
        );

        res.status(STATUS.OK).json({
            status: 'SUCCESS',
            message: 'User Registered Successfully!',
            user,
        });
    });

    logIn: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            const { error, value: { data: user = {} } = {} } =
                await this.Service.logIn(req.body);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            req.session.email = user.email;
            req.session.password = req.body.password;

            setTimeout(
                (session) => {
                    session.destroy();
                },
                +req.session.cookie.maxAge! - 100,
                req.session
            );

            res.status(STATUS.OK).json({
                status: 'SUCCESS',
                message: 'Logged In Successfully!',
                user
            });
        }
    );

    logOut: RequestHandler = (req: Request, res: Response) => {
        req.session.destroy((err) => {
            _logger.log('error', err);
        });

        res.status(STATUS.OK).json({
            status: 'SUCCESS',
            message: 'LOGGED OUT SUCCESSFULLY!',
        });
    };

    changeEmail: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            const { email } = req.session;

            const newEmail = req.body.email;

            if (newEmail === email) {
                return res.status(STATUS.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'EMAIL IS IDENTICAL TO CURRENT EMAIL!',
                });
            }

            const { error } = await this.Service.changeEmail({
                email,
                newEmail
            });

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            req.session.destroy((err) => {
                _logger.log('error', err);
            });

            return res.status(STATUS.OK).json({
                status: 'SUCCESS',
                message: 'Email Changed Successfully. Please Log In!',
            });
        }
    );

    changePassword: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            const { email } = req.session;

            const { currentPassword, password } = req.body;

            const { error } = await this.Service.changePassword({
                email,
                currentPassword,
                password,
            });

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            req.session.destroy((err) => {
                _logger.log('error', err);
            });

            res.status(STATUS.OK).json({
                status: 'SUCCESS',
                message: 'Password Changed Successfully. Please Log In!',
            });
        }
    );
}

export default Authentication;
