require("dotenv").config();
const nodemailer = require("nodemailer");
const Verification_Email_Template = require("./emailTemplate");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sender = process.env.SMTP_USER;
 
const sendVerificationMail = async(email,code) =>{
  try {
    const info = await transporter.sendMail({
    from: `"EcoTrack Team" <${sender}>`, // sender address
    to: email, // list of recipients
    subject: "Verify your email", // subject line
    text: "Verify your email", // plain text body
    html: Verification_Email_Template.replace('{verificationCode}',code), // HTML body
  });
} catch (err) {
  console.error("Error while sending mail:", err);
}
};
module.exports = sendVerificationMail;