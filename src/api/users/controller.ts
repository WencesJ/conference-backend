// NODE MODULES

// USER MODULES
import userService from './service';

import { CustomRequest } from '@libs/interfaces/user';

import { Response, NextFunction, RequestHandler, Request } from 'express';

import { AppError, catchAsync } from '@libs/error';

import CONSTANTS from '@libs/shared/constants';

import { Authentication } from '@api/auth';

const { STATUS, MSG } = CONSTANTS;

// end of requiring the modules

// USER AUTHENTICATION CONTROLLERS
/**
 * User Controller class
 * @class
 */

class UserController extends Authentication {
    /**
     * @description Creates user controller
     * @param {Object} [userService = userServiceInstance] - same as userServiceInstance Object
     *
     */

    constructor(public UserService = userService) {
        super(UserService);
        /**
         * @type {Object}
         * @borrows userService
         */
    }

    /**
     * Creates a User
     * @async
     * @access public
     */
    createUser: RequestHandler = catchAsync(
        async (req: Request, res: Response) => {
            /**
             * @type {Object} - An Object of fields required for creating a User.
             */
            const userDetails = { ...req.body };

            /**
             * @type {Object} - Holds the created data object.
             */
            const { value: { data: user = {} } = {} } =
                await this.UserService.create(userDetails);

            // Returns a json response
            res.status(STATUS.CREATED).json({
                message: MSG.SUCCESS,
                user,
            });
        }
    );

    /**
     * Gets one User Data
     * @async
     * @route {GET} /:_id
     * @access protected
     */
    getUser: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */

            const queryFields = req.params;

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description Use Either a mongodbUniqueId Or _id to Search
             */

            const { error, value: { data: user = {} } = {} } =
                await this.UserService.get({ _id: req.user._id });

            // Checks if data returned is null
            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.OK).json({
                message: MSG.SUCCESS,
                user,
            });
        }
    );

    /**
     * Gets All User Datas
     * @async
     * @route {GET} /
     * @access public
     */
    getAllUsers = catchAsync(async (req: Request, res: Response) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         *
         * @empty - Returns Whole Data In Users Collection
         */
        const queryFields: any = { ...req.query };

        /**
         * @type {Object|null} - Holds either the returned data object or null.
         */
        const { value: { data: users = {} } = {} } =
            await this.UserService.getAll(queryFields);

        // Returns a json response
        res.status(STATUS.OK).json({
            message: MSG.SUCCESS,
            users,
        });
    });

    /**
     * Deletes one User Data
     * @async
     * @access protected
    */
    deleteUser = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryFields = req.params;
            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description deletes a user
             */

            await this.UserService.delete(queryFields);

            // Returns a json response
            res.status(STATUS.NO_CONTENT).json({
                message: MSG.SUCCESS,
            });
        }
    );

    /**
     * Updates one User Data
     * @async
     * @access protected
    */

    updateUser = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryParams = { _id: req.user._id };

            const queryFields = { ...req.body };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description Updates a user
             */

            const { error, value: { data: user = {} } = {} } =
                await this.UserService.update(queryParams, queryFields);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                message: MSG.SUCCESS,
                user,
            });
        }
    );
}

const userCntrl = new UserController();

export default userCntrl;
