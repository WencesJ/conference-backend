// importing the modules

import { Schema, model, Document } from 'mongoose';

import { hash, compare } from 'bcrypt';
import { removeProps } from '@libs/models/modelUtils';

export interface TalkDocument extends Document {
    subject: string;
    description: string;
    creator: string;
    locked: boolean;
    password: string;
    createdAt: Date;
    updateAt: Date;
    attendees: string[];

    // STATICS
    findBySubject: (subject: string) => TalkDocument;
    findByCreator: (creator: string) => TalkDocument;
    findByAttendee: (attendee: string) => TalkDocument;

    //METHODS
    validPassword: (password: string) => boolean;
}

const talkSchema: Schema<TalkDocument> = new Schema(
    {
        subject: {
            type: String,
            required: [true, 'Talk Must Have A Subject!'],
            trim: true,
            lowercase: true,
            unique: [true, '']
        },

        creator: {
            type: String,
            ref: 'User',
            required: [true, 'Talk Must Have A Creator!'],
        },

        description: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        locked: {
            type: Boolean,
            required: true,
            default: false
        },

        password: {
            type: String,
            trim: true,
        },

        attendees: {
            type: [{
                type: String,
                ref: 'User'
            }],
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
talkSchema.index({ subject: 1 });

// initiating the pre and post hooks
talkSchema.pre<TalkDocument>('save', async function (next) {
    next();
});

// TALK STATICS
talkSchema.statics.findBySubject = async function (subject: string) {
    return await this.findOne({ subject });
};
talkSchema.statics.findByCreator = async function (creator: string) {
    return await this.findOne({ creator });
};
talkSchema.statics.findByAttendee = async function (attendee: string) {
    return await this.findOne({ attendee });
};

// TALK METHODS
talkSchema.methods.validPassword = async function (password: string) {
    return password === this.password;
};

const Talk = model('Talk', talkSchema);

export default Talk;
