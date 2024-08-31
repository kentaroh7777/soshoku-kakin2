import nodemailer from 'nodemailer';
import nextConfig from '../../next.config.mjs'

const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        // SMTPサーバーの設定
        console.log(`nextConfig.env.SMTP_HOST: ${nextConfig.env.SMTP_HOST}`);
        console.log(`process.env.SMTP_PORT: ${process.env.SMTP_PORT}`);
        console.log(`process.env.SMTP_USER: ${process.env.SMTP_USER}`);
        console.log(`process.env.SMTP_PASS: ${process.env.SMTP_PASS}`);
        const transporter = nodemailer.createTransport({
            host: nextConfig.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // メールの内容
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: to,
            subject: subject,
            text: text,
        };

        // メール送信
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendEmail;
