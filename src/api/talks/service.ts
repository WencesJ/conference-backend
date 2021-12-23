// NODE MODULES
import { Model } from 'mongoose';
import { Request } from 'express';

// TALK MODULES
import TalksModel, { TalkDocument } from './Model';
import ApiFeatures from '@libs/shared/utils/ApiFeatures';
import CONSTANTS from '@libs/shared/constants';

const { STATUS } = CONSTANTS;

// end requiring the modules

interface DataTemplate {
    [unit: string]: string;
}

type CustomModel = Model<TalkDocument> & TalkDocument;

class TalkService extends ApiFeatures {
    /**
     * Creates talk controller
     * @param {Object} [talkModel = TalkModel] - Instance of a Mongoose Schema of Talk Model
     * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
     *
     */

    constructor(
        protected TalkModel = TalksModel as CustomModel,
    ) {
        super();
    }

    /**
     * Creates an Talk.
     * @async
     * @param {Object} details - Details required to create a Talk.
     * @returns {Object} Returns the created Talk
     * @throws Mongoose Error
     */

    async create(details: Request) {
        /**
         * @type {Object} - Holds the created data object.
         */
        const talk = await this.TalkModel.create({
            ...details,
        });

        return {
            value: {
                data: talk,
            },
        };
    };

    /**
     * Finds one Talk Data by it's id or Company.
     * @async
     * @param {string} id/company - unique id or company of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async get(query: object, populateOptions = undefined) {
        let talkQuery = this.TalkModel.findOne({ ...query });

        // TODO: Populate populateOptions
        if (populateOptions !== undefined)
            talkQuery = talkQuery.populate(populateOptions);
        // else talkQuery = talkQuery.lean();

        const talk = await talkQuery;

        if (!talk) {
            return {
                error: {
                    msg: 'Invalid Talk. Talk Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: talk,
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
        const talksQuery = this.api(this.TalkModel, query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const talks = await talksQuery.query.lean();

        return {
            value: {
                data: talks,
            },
        };
    };

    /**
     * Deletes one Talk Data by it's id or Company name.
     * @async
     * @param {string} id/company - unique id or company of the requested data.
     * @returns {} Returns null
     * @throws Mongoose Error
     */
    async delete(query: object) {
        const talk = await this.TalkModel.findOneAndDelete({ ...query });

        return {
            value: {
                data: talk,
            },
        };
    };

    /**
     * Updates one Talk Data by it's id or company name.
     * @async
     * @param {string} id/company - unique id or company of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async update(query: object, details: object) {
        const talk = await this.TalkModel.findOneAndUpdate(
            query,
            { ...details },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!talk) {
            return {
                error: {
                    msg: 'Invalid Talk. Talk Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: talk,
            },
        };
    };
}

export default new TalkService();
