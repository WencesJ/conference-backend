/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */

import { Request, Response, NextFunction, RequestHandler } from 'express';

import { Logger } from 'winston';

import { Session } from 'express-session';

import { catchAsync, AppError } from '@libs/error';

import CONSTANTS from '@libs/shared/constants';

import { verifyToken, createToken } from './jwt';

const { STATUS } = CONSTANTS;

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

    constructor(public Service: UserServiceType) {}

    private setAuthHeader = (res: Response, token: string) => {
        res.setHeader('authorization', `${token}`);
    }

    private validateAuthorizationHeader = (req: CustomRequest) => {
        
        const { authorization } = req.headers;
    
        if (!authorization) {
            throw new AppError(
                'Authentication Failed. Please Log In!',
                STATUS.UNAUTHORIZED
            );
        }    
    
        const getToken = authorization.substring('bearer'.length).trim();
    
        const { data, error } = verifyToken(getToken);
    
        if (error) {
            throw new AppError(
                error, STATUS.UNAUTHORIZED
            )
        }
        
        return data as object;
    };

    authorization: RequestHandler = catchAsync(
        async (req: CustomRequest, _: Response, next: NextFunction) => {
            try {
                const { email, password }: { [x: string]: any } = this.validateAuthorizationHeader(req);

                const { value } = await this.Service.get({ email });

                if (value !== undefined && value.password !== password) {
                    req.user = value.data;

                    return next();
                }

                throw new AppError(
                    'Authentication Failed. Please Log In!',
                    STATUS.UNAUTHORIZED
                );
            }
            catch(err:any) {
                return next(err);
            }

            
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

            const token = createToken({
                _id: user.id,
                email: user.email,
                password: user.password,
            });

            this.setAuthHeader(res, token);

            res.status(STATUS.OK).json({
                status: 'SUCCESS',
                message: 'Logged In Successfully!',
                user
            });
        }
    );

    logOut: RequestHandler = (req: Request, res: Response) => {
        
        //CLIENT SIDE HAS TO DELETE TOKEN FROM COOKIES
        res.status(STATUS.OK).json({
            status: 'SUCCESS',
            message: 'LOGGED OUT SUCCESSFULLY!',
        });
    };

    changeEmail: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            if (!req.user) {
                return next(new AppError('Authentication Failed. Please Log In!', STATUS.UNAUTHORIZED));
            }

            const newEmail = req.body.email;

            if (newEmail === req.user.email) {
                return res.status(STATUS.BAD_REQUEST).json({
                    status: 'FAILED',
                    message: 'EMAIL IS IDENTICAL TO CURRENT EMAIL!',
                });
            }

            const { error } = await this.Service.changeEmail({
                email: req.user.email,
                newEmail
            });

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            return res.status(STATUS.OK).json({
                status: 'SUCCESS',
                message: 'Email Changed Successfully. Please Log In!',
            });
        }
    );

    changePassword: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {

            if (!req.user) {
                return next(new AppError('Authentication Failed. Please Log In!', STATUS.UNAUTHORIZED));
            }

            const { currentPassword, password } = req.body;

            const { error } = await this.Service.changePassword({
                email: req.user.email,
                currentPassword,
                password,
            });

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            res.status(STATUS.OK).json({
                status: 'SUCCESS',
                message: 'Password Changed Successfully. Please Log In!',
            });
        }
    );
}

export default Authentication;
