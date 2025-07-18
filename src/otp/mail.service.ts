import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
    private readonly senderEmail: string;

    constructor() {
        const apiKey = process.env.SENDGRID_API_KEY;
        const sender = process.env.SENDGRID_SENDER_EMAIL;

        if (!apiKey || !sender) {
        throw new Error('SendGrid API key or sender email not configured');
        }

        sgMail.setApiKey(apiKey);
        this.senderEmail = sender;
    }

    async sendOtpEmail(to: string, otp: string): Promise<void> {
        const msg = {
        to,
        from: this.senderEmail,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
        html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
        };

        await sgMail.send(msg);
    }
}