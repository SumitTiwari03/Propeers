const jwt = require("jsonwebtoken");
const userModel = require("../model/User.model");

const verify = async (req, res) => {
  const { token } = req.query;
  const JWT_SECRET = process.env.JWT_SECRETE;

  try {
    const { email } = jwt.verify(token, JWT_SECRET);

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send("Invalid token");

    if (user.isVerified) return res.send("Email is already verified!");

    user.isVerified = true;
    await user.save();

    res.redirect("http://localhost:5173/login");
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(400).send({ Message: "Invalid or expired token", Error: error });
  }
};

module.exports = verify;
