const nodemailer = require("nodemailer");

require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail=async(receiptent,verification_code)=>{
try{
      // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"TreasureTracker 👻" <treasuretracker8@gmail.com>`, 
    to: receiptent,
    subject: "Verification OTP",
    text: "Verification OTP",
    html: verification_code,
  });

  console.log("Message sent: %s", info.messageId);
}
catch(error){
    console.log(error);
}
}

module.exports={sendEmail}

