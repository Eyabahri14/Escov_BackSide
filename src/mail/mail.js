require('dotenv').config()
var nodemailer = require('nodemailer');
function sendEmail(to,otp) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'eya.bahri@esprit.tn',
            pass: "191JFT4899"
        }
    });
    // var cc = ["shekhjeel@gmail.com","shekhutsav1111@gmail.com"]
    var str = "your otp = ";
    var a =otp;
    str+=a;
    str += "\notp valid till 2min"
    var mailOptions = {
        from: 'eya.bahri@esprit.tn',
        to: to,
        // cc:cc,
        subject: 'Reset Password Les délices de fatma!!',
        text: str,
        html:require('./otpEmailView')({otp:otp})
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = sendEmail