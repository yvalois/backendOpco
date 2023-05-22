const nodemailer = require('nodemailer');

const host = process.env.AOEX_HOST;
const user = process.env.AOEX_USER;
const pass = process.env.AOEX_PASSWORD;

const aoexMail = nodemailer.createTransport({
    host: host,
    port: 465,
    secure: true,
    auth: {
        user: user,
        pass: pass
    }
});

module.exports = aoexMail;
