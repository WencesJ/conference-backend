import nodemailer from 'nodemailer';
import pug from 'pug';
// const htmlToText = require('html_to_text');

/**
 * @params - {user} - Object containg sender's details
 * 
 * @description - user Object Example = {
            from: 'mail@exmple.com,
            name: 'username',
            keyMessage: 'message to be sent',
        },
 */

interface User {
    [unit: string]: string;
}

class Email {
    private to: string;
    private from: string;
    private phone: string;
    private name: string;
    private keyMessage: string;
    private category: string;
    private service: string;

    constructor(public user: User) {
        this.to = `Sample <${process.env.EMAIL}>`;
        this.from = user.email;
        this.name = user.name;
        this.phone = user.phone;
        this.service = user.service;
        this.keyMessage = user.keyMessage;
        this.category = user.category;
    }

    // eslint-disable-next-line class-methods-use-this
    async newTransport() {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    /**
     *
     * @param {*} subject subject of mail to be sent
     */

    async send(subject: string) {
        const html = pug.renderFile(`${__dirname}/../../views/contact.pug`, {
            name: this.name,
            email: this.from,
            phone: this.phone,
            category: this.category,
            service: this.category,
            keyMessage: this.keyMessage,
        });

        const mailOptions = {
            to: this.to,
            from: this.from,
            subject,
            html,
            text: this.keyMessage,
        };

        return (await this.newTransport()).sendMail(mailOptions);
    }
}

export default Email;
