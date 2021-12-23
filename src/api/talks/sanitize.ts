import { registerSanitizeSchema } from '@libs/validations/joiSchema';
import Joi from 'joi';

const defaultStringValidate = Joi.string().lowercase().trim();


/**
 * @description Joi Schema Validation For Talk Feature
 */

interface TalkSanitizeInterface {
    createTalk: string,
    getTalk: string,
    updateTalk: string,
    deleteTalk: string,
    addOrRemoveAttendee: string,
}

const TalkSanitize = {
    createTalk: {
        params: {},
    
        body: {
            subject: defaultStringValidate
                .required()
                .min(3)
                .max(100),
            
            description: defaultStringValidate.min(10).max(250).required(),

            locked: Joi.boolean(),

            password: Joi.when('locked', { is: true, then: defaultStringValidate.min(6).max(30).required(), otherwise: Joi.optional() }),
        },
    },
    
    getTalk: {
        params: {
            _id: defaultStringValidate.required(),
        },
    
        body: {},
    },

    updateTalk: {
        params: {
            _id: defaultStringValidate.required(),
        },
    
        body: {
            description: defaultStringValidate.min(10).max(250),

            locked: Joi.boolean(),

            password: Joi.when('locked', { is: true, then: defaultStringValidate.min(6).max(30).required(), otherwise: Joi.optional() }),
            // other talk details like description, etc.
        },
    },
    
    deleteTalk: {
        params: {
            _id: defaultStringValidate.required(),
        },
    
        body: {},
    },
    
    addOrRemoveAttendee: {
        params: {
            _id: defaultStringValidate.required(),
        },
    
        body: {
            
        },
    },
    
}


export default registerSanitizeSchema(TalkSanitize) as unknown as TalkSanitizeInterface;
