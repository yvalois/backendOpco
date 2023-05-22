const nodemailer = require('nodemailer');

const host = process.env.OPCO_HOST;
const user = process.env.OPCO_USER;
const pass = process.env.OPCO_PASSWORD;


const opcoMail = nodemailer.createTransport({
    host: host,
    port: 465,
    secure: true,
    auth: {
        user: user,
        pass: pass
    }
});

module.exports = opcoMail;


    
        