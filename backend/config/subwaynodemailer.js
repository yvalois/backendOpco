const nodemailer = require('nodemailer');

const host = process.env.SUBWAY_HOST;
const user = process.env.SUBWAY_USER;
const pass = process.env.SUBWAY_PASSWORD;


const subwayMail = nodemailer.createTransport({
    host: host,
    port: 465,
    secure: true,
    auth: {
        user: user,
        pass: pass
    }
});

module.exports = subwayMail;
