// importing the modules

import { Schema, model, Document, connection } from 'mongoose';

import { hash, compare } from 'bcrypt';
import { removeProps } from '@libs/models/modelUtils';
import validator from 'validator';

export interface UserDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;

    // STATICS
    findByEmail: (email: string) => UserDocument;

    //METHODS
    validPassword: (password: string) => boolean;
}

const userSchema: Schema<UserDocument> = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'User Must Have A First Name!'],
            trim: true,
            lowercase: true,
        },

        lastName: {
            type: String,
            required: [true, 'User Must Have A Last Name!'],
            trim: true,
            lowercase: true,
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

userSchema.index({ email: 1 });

// initiating the pre and post hooks
userSchema.pre<UserDocument>('save', async function (next) {
    if (this.isNew || this.isModified('password')) this.password = await hash(this.password, 12);
    next();
});

// USER STATICS
userSchema.statics.findByEmail = async function (email: string) {
    return await this.findOne({ email });
};

// USER METHODS
userSchema.methods.validPassword = async function (password: string) {
    return await compare(password, this.password);
};

const User = model('User', userSchema);

export default User;
