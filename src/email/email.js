const nodemailer = require('nodemailer')
require('dotenv').config();
const nodemailMailgun = require('nodemailer-mailgun-transport');

const auth = {
    auth : {
        api_key : process.env.API,
        domain : process.env.DOMAIN
    }
}

let transporter = nodemailer.createTransport(nodemailMailgun(auth));
// const mailOption = {
//     from : "test@test.com",
//     to  : "pankaj.lanet@gmail.com",
//     subject : "Sending a mail online",
//     text : 'another test'

// }

// transporter.sendMail(mailOption, (err, data) => {
//     if(err)
//     {
//         console.log("You have an error " ,err)
//     }
//     else
//     {
//         console.log(data)
//     }
// }
// )


module.exports = {transporter}