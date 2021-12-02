import { registerSanitizeSchema } from '@libs/validations/joiSchema';
import Joi from 'joi';

const defaultStringValidate = Joi.string().lowercase().trim();


/**
 * @description Joi Schema Validation For Wallet Feature
 */

const WalletSanitize = {
    createWallet: {
        params: {},
    
        body: {
            company: defaultStringValidate
                .required()
                .min(3)
                .max(50),
            
            email: defaultStringValidate.email().required(),
    
            password: defaultStringValidate.required().min(6).max(30),
        },
    },
    
    getWallet: {
        params: {
            company: defaultStringValidate.required(),
        },
    
        body: {},
    },

    updateWallet: {
        params: {
            company: defaultStringValidate.required(),
        },
    
        body: {
            company: defaultStringValidate,
            amount: Joi.number()
            // other wallet details like description, etc.
        },
    },
    
    deleteWallet: {
        params: {
            company: defaultStringValidate.required(),
        },
    
        body: {},
    },
    
    walletTransferFunds: {
        params: {
            company: defaultStringValidate.required(),
        },
    
        body: {
            amount: Joi.number().required().min(100),
            recipientWallet: defaultStringValidate.required(),
        },
    },

    loginWallet: {
        params: {},
    
        body: {
            email: defaultStringValidate.required(),
    
            password: defaultStringValidate.required().min(6).max(30),
        },
    },
    
    changeWalletPassword: {
        params: {
            company: defaultStringValidate.required(),
        },
    
        body: {
            currentPassword: defaultStringValidate.required().min(6).max(30),
    
            password: defaultStringValidate.required().min(6).max(30),
        },
    },

    changeWalletEmail: {
        params: {
            company: defaultStringValidate.required(),
        },
    
        body: {
            email: defaultStringValidate.email().required(),
        },
    },
    
}

registerSanitizeSchema(WalletSanitize);

export default WalletSanitize;
