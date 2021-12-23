// NODE MODULES
import { Model } from 'mongoose';
import { Request } from 'express';

// USER MODULES
import UsersModel, { UserDocument } from './Model';
import ApiFeatures from '@libs/shared/utils/ApiFeatures';
import CONSTANTS from '@libs/shared/constants';

const { STATUS } = CONSTANTS;

// end requiring the modules

interface DataTemplate {
    [unit: string]: string;
}

type CustomModel = Model<UserDocument> & UserDocument;

class UserService extends ApiFeatures {
    /**
     * Creates user controller
     * @param {Object} [userModel = UserModel] - Instance of a Mongoose Schema of User Model
     * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
     *
     */

    constructor(
        protected UserModel = UsersModel as CustomModel,
    ) {
        super();
    }

    /**
     * Creates an User.
     * @async
     * @param {Object} details - Details required to create a User.
     * @returns {Object} Returns the created User
     * @throws Mongoose Error
     */

    async create(details: Request) {
        /**
         * @type {Object} - Holds the created data object.
         */
        const user = await this.UserModel.create({
            ...details,
        });

        return {
            value: {
                data: user,
            },
        };
    };

    /**
     * Finds one User Data by it's id.
     * @async
     * @param {string} id - unique id of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async get(query: object, populateOptions = undefined) {
        let userQuery = this.UserModel.findOne({ ...query });

        // TODO: Populate populateOptions
        if (populateOptions !== undefined)
            userQuery = userQuery.populate(populateOptions);
        // else userQuery = userQuery.lean();

        const user = await userQuery;

        if (!user) {
            return {
                error: {
                    msg: 'Invalid User. User Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: user,
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
        const usersQuery = this.api(this.UserModel, query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const users = await usersQuery.query.lean();

        return {
            value: {
                data: users,
            },
        };
    };

    /**
     * Deletes one User Data by it's id.
     * @async
     * @param {string} id - unique id of the requested data.
     * @returns {} Returns null
     * @throws Mongoose Error
     */
    async delete(query: object) {
        const user = await this.UserModel.findOneAndDelete({ ...query });

        return {
            value: {
                data: user,
            },
        };
    };

    /**
     * Updates one User Data by it's id.
     * @async
     * @param {string} id- unique id of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async update(query: object, details: Request) {
        const user = await this.UserModel.findOneAndUpdate(
            query,
            { ...details },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            return {
                error: {
                    msg: 'Invalid User. User Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: user,
            },
        };
    };


    // AUTHENTICATION METHODS

    async logIn({ email, password }: DataTemplate) {
        const user = await this.UserModel.findByEmail(email);

        if (!user || !(await user.validPassword(password))) {
            return {
                error: {
                    msg: 'Invalid email or Password!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: user,
            },
        };
    };

    async changeEmail({
        email,
        newEmail
    }: DataTemplate) {
        const user = await this.UserModel.findByEmail(email);

        if (user === undefined) {
            return {
                error: {
                    msg: 'Invalid email!',
                    code: STATUS.BAD_REQUEST
                },
            }
        }

        user.email = newEmail;

        await user.save({ validateBeforeSave: false });

        return {
            value: {
                data: user,
            },
        };
    }

    async changePassword({
        email,
        currentPassword,
        password,
    }: DataTemplate) {
        const { error, value: { data: user } = {} } = await this.logIn({email, password: currentPassword});

        if (error !== undefined || user === undefined) {
            return {
                error: {
                    ...error,
                    msg: 'Current password is incorrect!'
                },
            }
        }

        user.password = password;

        await user.save({ validateBeforeSave: true });

        return {
            value: {
                data: user,
            },
        };
    }
}

export default new UserService();
