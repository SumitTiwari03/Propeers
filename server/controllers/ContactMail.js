const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const ContactMail = async (req, res) => {
  const { username, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDEREMAIL,
        pass: process.env.PASSEMAIL,
      },
    });

    // Email to Yourself
    const adminMailOptions = {
      from: process.env.SENDEREMAIL,
      to: process.env.SENDEREMAIL, // Sending to yourself
      subject: `ProPeers: New Query from ${username}`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333;">
          <h2>New User Query</h2>
          <p><strong>Name:</strong> ${username}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 4px solid #ddd; padding-left: 10px; color: #555;">
            ${message}
          </blockquote>
          <hr>
          <p style="font-size: 14px; color: #777;">This email is automatically generated for record-keeping purposes.</p>
        </div>
      `,
    };

    // Confirmation Email to the User
    const userMailOptions = {
      from: process.env.SENDEREMAIL,
      to: email,
      subject: `Thank You for Contacting ProPeers`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333;">
          <h2>Thank You, ${username}!</h2>
          <p>We have received your query and will get back to you as soon as possible.</p>
          <p><strong>Your Message:</strong></p>
          <blockquote style="border-left: 4px solid #ddd; padding-left: 10px; color: #555;">
            ${message}
          </blockquote>
          <p>If you need immediate assistance, feel free to reply to this email.</p>
          <hr>
          <p style="font-size: 14px; color: #777;">Best regards, <br> The ProPeers Team</p>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    console.log("Emails sent successfully.");
    res.send({ Message: "Thank you for contacting ProPeers. We have received your message and will respond soon." });

    return { success: true };
  } catch (error) {
    console.error("Error while sending email: ", error);
    res.status(500).send({ Message: "Failed to send email. Please try again later." });
    return { success: false, error };
  }
};

module.exports = ContactMail;
