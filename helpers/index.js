const nodeMailer = require("nodemailer");

const defaultEmailData = { from: "noreply@node-react.com" };

exports.sendEmail = emailData => {
    const transporter = nodeMailer.createTransport({
        host: "Golden.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "GoldenIndigo@gmail.com",
            pass: "lobtneykblrjzmfc"
        }
    });
    return (
        transporter
            .sendMail(emailData)
            .then(info => console.log(`Message sent: ${info.response}`))
            .catch(err => console.log(`Problem sending email: ${err}`))
    );
};