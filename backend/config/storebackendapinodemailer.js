const nodemailer = require('nodemailer');

const host = process.env.BACKEND_HOST;
const user = process.env.BACKEND_USER;
const pass = process.env.BACKEND_PASSWORD;

const backendMail = nodemailer.createTransport({
    host: host,
    port: 587,
    secure: false,
    auth: {
        user: user,
        pass: pass
    }
});

module.exports = backendMail;
