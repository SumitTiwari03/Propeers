const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const mailer = async (username, email, verificationLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDEREMAIL,
        pass: process.env.PASSEMAIL,
      },
    });

    const mailOptions = {
      from: process.env.SENDEREMAIL,
      to: email,
      subject: "Propeers: Verify Your Email",
      html: `<div style="font-family: sans-serif; font-size: 16px; line-height: 1.5; color: #333;">
  <h2>Welcome, ${username}!</h2>
  <p>Thank you for joining us!</p>
  <p>To complete your registration and gain full access to our platform, please click the button below to verify your email address:</p>
  <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 3px;">Verify Email</a>

  <p>This link will expire in 24 hours.</p>

  <p>If you did not request this email, please ignore it.</p>

  <p>Sincerely,</p>
  <p>The Propeers Team</p>
</div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true };
  } catch (error) {
    console.error("Error while sending email: ", error);
    return { success: false, error };
  }
};

module.exports = mailer;
