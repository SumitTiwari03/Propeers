const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

/**
 * Get mail transporter based on environment
 */
const getTransporter = () => {
  if (process.env.NODE_ENV === "development") {
    console.log("📧 Using Gmail for local email sending...");
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.SENDEREMAIL,
        pass: process.env.PASSEMAIL,
      },
    });
  } else {
    console.log("📨 Using Brevo (Sendinblue) for production email sending...");
    return nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });
  }
};

/**
 * Send verification email
 */
const verificationMailer = async (username, email, verificationLink) => {
  const transporter = getTransporter();
  try {
    await transporter.verify(); // optional: test connection

    const mailOptions = {
      from: `"ProPeers Team" <${process.env.SENDEREMAIL}>`,
      to: email,
      subject: "ProPeers: Verify Your Email",
      html: `
        <h2>Welcome, ${username}!</h2>
        <p>Click below to verify your email:</p>
        <a href="${verificationLink}" style="background:#ea580c;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Verify Email</a>
        <p>If the button doesn't work, use this link: ${verificationLink}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    return { success: false, error };
  }
};

/**
 * Send password reset email
 */
const resetPasswordMailer = async (username, email, resetLink) => {
  const transporter = getTransporter();
  try {
    await transporter.verify();

    const mailOptions = {
      from: `"ProPeers Team" <${process.env.SENDEREMAIL}>`,
      to: email,
      subject: "ProPeers: Reset Your Password",
      html: `
        <h2>Password Reset Request</h2>
        <p>Hi ${username},</p>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}" style="background:#ea580c;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Reset Password</a>
        <p>If the button doesn't work, use this link: ${resetLink}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    return { success: false, error };
  }
};

module.exports = { verificationMailer, resetPasswordMailer };
