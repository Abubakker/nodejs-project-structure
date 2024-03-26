const nodemailer = require('nodemailer');
const mail_user = process.env.MAIL_USER;
const mail_password = process.env.MAIL_PASSWORD;
const mail_host = process.env.MAIL_HOST;
const mail_port = process.env.MAIL_PORT || 587;
const mail_sender = process.env.MAIL_SENDER;
class Mailer {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: mail_host,
            port: mail_port,
            secure: false,
            requireTLS: true,
            auth: {
                user: mail_user,
                pass: mail_password
            }
        });
    }
    async verify() {
        return new Promise((resolve, reject) => {
            this.transporter.verify(function (err, success) {
                if (err) {
                    return reject(error);
                } else {
                    return resolve("Server is ready to send mail");
                }
            });
        })
    }

    async send({ subject, html, to }) {
        let mailOptions = { subject, html, from: mail_sender, to }
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject(error);
                } else {
                    resolve({ status: 'success', message: 'Email sent to:' + mailOptions.to });
                }
            });
        })
    }

}
module.exports = new Mailer();
