const nodemailer = require("nodemailer");

const auth = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (payload) => {
  const receiver = {
    from: process.env.sender_email,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
  };

  try {
    const res = await auth.sendMail(receiver);
    return res.messageId;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = sendMail;
