// NODE MODULES

// TALK MODULES
import talkService from './service';

import { CustomRequest } from '@libs/interfaces/user';

import { Response, NextFunction, RequestHandler, Request } from 'express';

import { AppError, catchAsync } from '@libs/error';

import CONSTANTS from '@libs/shared/constants';

import { Authentication } from '@api/auth';

const { STATUS, MSG } = CONSTANTS;

// end of requiring the modules

// TALK AUTHENTICATION CONTROLLERS
/**
 * Talk Controller class
 * @class
 */

class TalkController {
    /**
     * @description Creates talk controller
     * @param {Object} [talkService = talkServiceInstance] - same as talkServiceInstance Object
     *
     */

    constructor(public TalkService = talkService) {
        /**
         * @type {Object}
         * @borrows talkService
         */
    }

    /**
     * Creates a Talk
     * @async
     * @access public
     */
    createTalk: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response) => {
            /**
             * @type {Object} - An Object of fields required for creating a Talk.
             */
            const talkDetails = { ...req.body, creator: req.user._id, attendees: [req.user._id] };

            /**
             * @type {Object} - Holds the created data object.
             */
            const { value: { data: talk = {} } = {} } =
                await this.TalkService.create(talkDetails);

            // Returns a json response
            res.status(STATUS.CREATED).json({
                message: MSG.SUCCESS,
                talk,
            });
        }
    );

    /**
     * Gets one Talk Data
     * @async
     * @route {GET} /:_id
     * @access protected
     */
    getTalk: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */

            const queryFields = req.params;

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description Use Either a mongodbUniqueId to Search
             */

            const { error, value: { data: talk = {} } = {} } =
                await this.TalkService.get({ _id: queryFields._id });

            // Checks if data returned is null
            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.OK).json({
                message: MSG.SUCCESS,
                talk,
            });
        }
    );

    /**
     * Gets All Talk Datas
     * @async
     * @route {GET} /
     * @access public
     */
    getAllTalks = catchAsync(async (req: CustomRequest, res: Response) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         *
         * @empty - Returns Whole Data In Talks Collection
         */
         const queryFields: any = { ...req.query, attendees: { $nin: [req.user._id] } };

        /**
         * @type {Object|null} - Holds either the returned data object or null.
         */
        const { value: { data: talks = {} } = {} } =
            await this.TalkService.getAll(queryFields);

        // Returns a json response
        res.status(STATUS.OK).json({
            message: MSG.SUCCESS,
            talks,
        });
    });

    /**
     * Gets All Talk Datas That User Is Included In
     * @async
     * @route {GET} /
     * @access public
     */
    getMyTalks = catchAsync(async (req: CustomRequest, res: Response) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         *
         * @empty - Returns Whole Data In Talks Collection
         */
        const queryFields: any = { ...req.query, attendees: { $in: [req.user._id] } };

        /**
         * @type {Object|null} - Holds either the returned data object or null.
         */
        const { value: { data: talks = {} } = {} } =
            await this.TalkService.getAll(queryFields);

        // Returns a json response
        res.status(STATUS.OK).json({
            message: MSG.SUCCESS,
            talks,
        });
    });

    /**
     * Deletes one Talk Data
     * @async
     * @access protected
    */
    deleteTalk = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryFields = req.params;
            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description deletes a talk
             */

            await this.TalkService.delete(queryFields);

            // Returns a json response
            res.status(STATUS.NO_CONTENT).json({
                message: MSG.SUCCESS,
            });
        }
    );

    /**
     * Updates one Talk Data
     * @async
     * @access protected
    */

    updateTalk = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryParams = { ...req.params };

            const queryFields = { ...req.body };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description Updates a talk
             */

            const { error, value: { data: talk = {} } = {} } =
                await this.TalkService.update(queryParams, queryFields);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                message: MSG.SUCCESS,
                talk,
            });
        }
    );

    /**
     * Adds an Attendee to Talk Data
     * @async
     * @access protected
    */
    addAttendeeToTalk = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryParams = { ...req.params };

            const queryFields = { 
                $addToSet: { attendees: req.user._id }
             };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description Updates a talk
             */

            const { error, value: { data: talk = {} } = {} } =
                await this.TalkService.update(queryParams, queryFields);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                message: MSG.SUCCESS,
                talk,
            });
        }
    );
    /**
     * Remove an Attendee from Talk Data
     * @async
     * @access protected
    */
    removeAttendeeFromTalk = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryParams = { ...req.params };

            const queryFields = { 
                $pull: { attendees: req.user._id }
             };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description Updates a talk
             */

            const { error, value: { data: talk = {} } = {} } =
                await this.TalkService.update(queryParams, queryFields);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                message: MSG.SUCCESS,
                talk,
            });
        }
    );

}

const talkCntrl = new TalkController();

export default talkCntrl;
