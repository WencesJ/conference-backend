// importing the modules

import { Schema, model, Document, connection } from 'mongoose';

import { hash, compare } from 'bcrypt';
import { removeProps } from '@libs/models/modelUtils';
import validator from 'validator';

export interface WalletDocument extends Document {
    company: string;
    email: string;
    password: string;
    amount: number;

    // STATICS
    findByCompany: (company: string) => WalletDocument;
    findByEmail: (email: string) => WalletDocument;

    //METHODS
    transferFunds: (amount: number, recipient: WalletDocument) => void;
    validPassword: (password: string) => boolean;
}

const walletSchema: Schema<WalletDocument> = new Schema(
    {
        company: {
            type: String,
            required: [true, 'Wallet Must Belong To A Company!'],
            trim: true,
            lowercase: true,
            unique: [true, 'Company already exists!']
        },

        email: {
            type: String,
            required: true,
            validate: [
                validator.isEmail,
                'User Must Have A alid Email Address!',
            ],
            unique: [true, 'Email Address already exists!'],
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            trim: true,
        },

        amount: {
            type: Number,
            default: 0
        }
    },

    {
        toJSON: { 
            virtuals: true, 
            versionKey: false,
            //remove sensitive fields
            transform: removeProps(['password'])
        },

        toObject: { virtuals: true, versionKey: false },

        timestamps: true, //Responsible for adding creation date and update date
    }
);

// indexing the doc for quick fetch

walletSchema.index({ company: 1 });
walletSchema.index({ email: 1 });

// initiating the pre and post hooks
walletSchema.pre<WalletDocument>('save', async function (next) {
    if (this.isNew || this.isModified('password')) this.password = await hash(this.password, 12);
    next();
});

// WALLET STATICS
walletSchema.statics.findByCompany = async function (company: string) {
    return await this.findOne({ company });
};
walletSchema.statics.findByEmail = async function (email: string) {
    return await this.findOne({ email });
};

// WALLET METHODS
walletSchema.methods.transferFunds = async function (amount: number, recipient: WalletDocument) {

    const session = await connection.startSession();

    try {
        session.startTransaction();                    
        
        this.amount -= amount;
        recipient.amount += amount;

        await this.save({ validateBeforeSave: false, validateModifiedOnly: true });
        await recipient.save({ validateBeforeSave: false, validateModifiedOnly: true });

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();

        throw error;
    }
    session.endSession();
};
walletSchema.methods.validPassword = async function (password: string) {
    return await compare(password, this.password);
};

const Wallet = model('Wallet', walletSchema);

export default Wallet;
