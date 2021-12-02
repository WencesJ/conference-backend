// NODE MODULES
import { Model } from 'mongoose';
import { Request } from 'express';

// WALLET MODULES
import WalletsModel, { WalletDocument } from './Model';
import ApiFeatures from '@libs/shared/utils/ApiFeatures';
import CONSTANTS from '@libs/shared/constants';

const { STATUS } = CONSTANTS;

// end requiring the modules

interface DataTemplate {
    [unit: string]: string;
}

type CustomModel = Model<WalletDocument> & WalletDocument;

class WalletService extends ApiFeatures {
    /**
     * Creates wallet controller
     * @param {Object} [walletModel = WalletModel] - Instance of a Mongoose Schema of Wallet Model
     * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
     *
     */

    constructor(
        protected WalletModel = WalletsModel as CustomModel,
    ) {
        super();
    }

    /**
     * Creates an Wallet.
     * @async
     * @param {Object} details - Details required to create a Wallet.
     * @returns {Object} Returns the created Wallet
     * @throws Mongoose Error
     */

    async create(details: Request) {
        /**
         * @type {Object} - Holds the created data object.
         */
        const wallet = await this.WalletModel.create({
            ...details,
        });

        return {
            value: {
                data: wallet,
            },
        };
    };

    /**
     * Finds one Wallet Data by it's id or Company.
     * @async
     * @param {string} id/company - unique id or company of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async get(query: object, populateOptions = undefined) {
        let walletQuery = this.WalletModel.findOne({ ...query });

        // TODO: Populate populateOptions
        if (populateOptions !== undefined)
            walletQuery = walletQuery.populate(populateOptions);
        // else walletQuery = walletQuery.lean();

        const wallet = await walletQuery;

        if (!wallet) {
            return {
                error: {
                    msg: 'Invalid Wallet. Wallet Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: wallet,
            },
        };
    };

    /**
     * Finds one All Data matching a specified query but returns all if object is empty.
     * @async
     * @param {Object} query - finds data based on queries.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async getAll(query: Request) {
        const walletsQuery = this.api(this.WalletModel, query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const wallets = await walletsQuery.query.lean();

        return {
            value: {
                data: wallets,
            },
        };
    };

    /**
     * Deletes one Wallet Data by it's id or Company name.
     * @async
     * @param {string} id/company - unique id or company of the requested data.
     * @returns {} Returns null
     * @throws Mongoose Error
     */
    async delete(query: object) {
        const wallet = await this.WalletModel.findOneAndDelete({ ...query });

        return {
            value: {
                data: wallet,
            },
        };
    };

    /**
     * Updates one Wallet Data by it's id or company name.
     * @async
     * @param {string} id/company - unique id or company of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async update(query: object, details: Request) {
        const wallet = await this.WalletModel.findOneAndUpdate(
            query,
            { ...details },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!wallet) {
            return {
                error: {
                    msg: 'Invalid Wallet. Wallet Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: wallet,
            },
        };
    };

    /**
     * Transfer funds one Wallet Data by it's id.
     * @async
     * @param {string} id/company - unique id or company of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async transferFunds(query: object, details: { amount: number, recipientWallet: string}) {
        const wallet = await this.WalletModel.findOne({ ...query });

        const recipient = await this.WalletModel.findOne({ _id: details.recipientWallet });

        if (!wallet) {
            return {
                error: {
                    msg: 'Invalid Wallet. Wallet Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        if (!recipient) {
            return {
                error: {
                    msg: 'Invalid Wallet! The wallet you want to transfer funds to does not exist.',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        if (wallet.id === recipient.id) {
            return {
                error: {
                    msg: 'Invalid Transfer! You cannot transfer funds to yourself.',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        if (wallet.amount < details.amount) {
            return {
                error: {
                    msg: 'Insufficient Balance. Fund your wallet!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        await wallet.transferFunds(details.amount, recipient);

        return {
            value: {
                data: wallet,
            },
        };
    };

    // AUTHENTICATION METHODS

    async logIn({ email, password }: DataTemplate) {
        const wallet = await this.WalletModel.findByEmail(email);

        if (!wallet || !(await wallet.validPassword(password))) {
            return {
                error: {
                    msg: 'Invalid email or Password!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: wallet,
            },
        };
    };

    async changeEmail({
        email,
        newEmail
    }: DataTemplate) {
        const wallet = await this.WalletModel.findByEmail(email);

        if (wallet === undefined) {
            return {
                error: {
                    msg: 'Invalid email!',
                    code: STATUS.BAD_REQUEST
                },
            }
        }

        wallet.email = newEmail;

        await wallet.save({ validateBeforeSave: false });

        return {
            value: {
                data: wallet,
            },
        };
    }

    async changePassword({
        email,
        currentPassword,
        password,
    }: DataTemplate) {
        const { error, value: { data: wallet } = {} } = await this.logIn({email, password: currentPassword});

        if (error !== undefined || wallet === undefined) {
            return {
                error: {
                    ...error,
                    msg: 'Current password is incorrect!'
                },
            }
        }

        wallet.password = password;

        await wallet.save({ validateBeforeSave: true });

        return {
            value: {
                data: wallet,
            },
        };
    }
}

export default new WalletService();
