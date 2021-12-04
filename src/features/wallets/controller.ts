// NODE MODULES

// WALLET MODULES
import walletService from './service';

import { CustomRequest } from '@libs/interfaces/user';

import { Response, NextFunction, RequestHandler, Request } from 'express';

import { AppError, catchAsync } from '@libs/error';

import CONSTANTS from '@libs/shared/constants';

import Authentication from '../auth/auth';

const { STATUS, MSG } = CONSTANTS;

// end of requiring the modules

// WALLET AUTHENTICATION CONTROLLERS
/**
 * Wallet Controller class
 * @class
 */

class WalletController extends Authentication {
    /**
     * @description Creates wallet controller
     * @param {Object} [walletService = walletServiceInstance] - same as walletServiceInstance Object
     *
     */

    constructor(public WalletService = walletService) {
        super(WalletService);
        /**
         * @type {Object}
         * @borrows walletService
         */
    }

    /**
     * Creates a Wallet
     * @async
     * @access public
     */
    createWallet: RequestHandler = catchAsync(
        async (req: Request, res: Response) => {
            /**
             * @type {Object} - An Object of fields required for creating a Wallet.
             */
            const walletDetails = { ...req.body };

            /**
             * @type {Object} - Holds the created data object.
             */
            const { value: { data: wallet = {} } = {} } =
                await this.WalletService.create(walletDetails);

            // Returns a json response
            res.status(STATUS.CREATED).json({
                message: MSG.SUCCESS,
                wallet,
            });
        }
    );

    /**
     * Gets one Wallet Data
     * @async
     * @route {GET} /:company
     * @access protected
     */
    getWallet: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */

            const queryFields = req.params;

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description Use Either a mongodbUniqueId Or company to Search
             */

            const { error, value: { data: wallet = {} } = {} } =
                await this.WalletService.get({ _id: queryFields._id, company: queryFields.company });

            // Checks if data returned is null
            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.OK).json({
                message: MSG.SUCCESS,
                wallet,
            });
        }
    );

    /**
     * Gets All Wallet Datas
     * @async
     * @route {GET} /
     * @access public
     */
    getAllWallets = catchAsync(async (req: Request, res: Response) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         *
         * @empty - Returns Whole Data In Wallets Collection
         */
        const queryFields: any = { ...req.query };

        /**
         * @type {Object|null} - Holds either the returned data object or null.
         */
        const { value: { data: wallets = {} } = {} } =
            await this.WalletService.getAll(queryFields);

        // Returns a json response
        res.status(STATUS.OK).json({
            message: MSG.SUCCESS,
            wallets,
        });
    });

    /**
     * Deletes one Wallet Data
     * @async
     * @access protected
    */
    deleteWallet = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryFields = req.params;
            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description deletes a wallet
             */

            await this.WalletService.delete(queryFields);

            // Returns a json response
            res.status(STATUS.NO_CONTENT).json({
                message: MSG.SUCCESS,
            });
        }
    );

    /**
     * Updates one Wallet Data
     * @async
     * @access protected
    */

    updateWallet = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryParams = { ...req.params };

            const queryFields = { ...req.body };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description Updates a wallet
             */

            const { error, value: { data: wallet = {} } = {} } =
                await this.WalletService.update(queryParams, queryFields);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                message: MSG.SUCCESS,
                wallet,
            });
        }
    );

    /**
     * Transfers funds from one Wallet to another
     * @async
     * @access protected
    */

    transferFunds = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryParams = { ...req.params };

            const queryFields = { ...req.body };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @description Updates a wallet
             */

            const { error, value: { data: wallet = {} } = {} } =
                await this.WalletService.transferFunds(queryParams, queryFields);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                message: MSG.SUCCESS,
                wallet,
            });
        }
    );
}

const walletCntrl = new WalletController();

export default walletCntrl;
