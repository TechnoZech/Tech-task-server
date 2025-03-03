const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = (email, token) => {
    const url = `http://localhost:5000/api/auth/verify-email/${token}`;
    transporter.sendMail({
        to: email,
        subject: 'Verify your Email',
        html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
    });
};

module.exports = { sendVerificationEmail };
