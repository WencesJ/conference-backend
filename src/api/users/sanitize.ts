import { registerSanitizeSchema } from '@libs/validations/joiSchema';
import Joi from 'joi';

const defaultStringValidate = Joi.string().lowercase().trim();

interface UserSanitizeInterface {
    createUser: string,
    getUser: string,
    updateUser: string,
    loginUser: string,
    changeUserEmail: string,
    changeUserPassword: string,
}

/**
 * @description Joi Schema Validation For User Feature
 */

const UserSanitize = {
    createUser: {
        params: {},
    
        body: {
            firstName: defaultStringValidate
                .required()
                .min(3)
                .max(50),
            
            lastName: defaultStringValidate
                .required()
                .min(3)
                .max(50),
            
            email: defaultStringValidate.email().required(),
    
            password: defaultStringValidate.required().min(6).max(30),
        },
    },
    
    getUser: {
        params: {
            
        },
    
        body: {},
    },

    updateUser: {
        params: {
            _id: defaultStringValidate.required(),
        },
    
        body: {
            firstName: defaultStringValidate
                .min(3)
                .max(50),
            
            lastName: defaultStringValidate
                .min(3)
                .max(50),
            
            // other user details like description, etc.
        },
    },
    
    deleteUser: {
        params: {
            _id: defaultStringValidate.required(),
        },
    
        body: {},
    },
    
    loginUser: {
        params: {},
    
        body: {
            email: defaultStringValidate.required(),
    
            password: defaultStringValidate.required().min(6).max(30),
        },
    },
    
    changeUserPassword: {
        params: {},
    
        body: {
            currentPassword: defaultStringValidate.required().min(6).max(30),
    
            password: defaultStringValidate.required().min(6).max(30),
        },
    },

    changeUserEmail: {
        params: {},
    
        body: {
            email: defaultStringValidate.email().required(),
        },
    },
    
}
export default registerSanitizeSchema(UserSanitize) as unknown as UserSanitizeInterface;