const userModel = require("../model/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const mailer=require('./mailverify')
dotenv.config();

//======================================================= registeration=============================================

exports.register = async (req, res) => {
  const { username, fullname, email, password } = req.body;

  // checking for uniqueness of  the email and username or they already existing or not

  let existingUserEmail, existingUsername;
  try {
    existingUserEmail = await userModel.findOne({ email: email });
    existingUsername = await userModel.findOne({ username: username });
  } catch (err) {
    console.log(err);
  }
  if (existingUserEmail) return res.send({ Message: "Email already exists" });
  if (existingUsername)  return res.send({ Message: "Username already exists" });
 
  // hashing the password 
  try {
    await bcrypt.hash(password, 10, async (err, hash) => {
      if (err) res.send("Something went wrong");
      const user = new userModel({
        fullname,
        username,
        email,
        password: hash,
      });
      const JWT_SECRET=process.env.JWT_SECRETE
      await user.save();
      const token=jwt.sign({email},JWT_SECRET, { expiresIn: "1h" })
      const verificationLink = `http://localhost:8080/api/auth/verifyemail?token=${token}`;
    const emailResponse = await mailer(username, email, verificationLink);

    if (!emailResponse.success) {
      return res.status(500).send({
        message: "User registered, but email could not be sent",
        error: emailResponse.error,
      });
    }

      res.send({ Message: "Registered successfully", User: user,userId: user._id});
    });
  } catch (err) {
    res.send({ Error: err });
  }
};

// ================================================login code===========================================


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email or username
    const userLogin = await userModel.findOne({
      $or: [{ email: email }, { username: email }],
    });

    // If user not found
    if (!userLogin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // If email is not verified
    if (!userLogin.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, userLogin.password);

    // If password is invalid
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: userLogin.email,
        username: userLogin.username,
        userId: userLogin._id,
      },
      process.env.JWT_SECRETE,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Set the token in a cookie
    res.cookie("usertoken", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
      httpOnly: true,
      sameSite: "lax",
    });

    // Send success response
    res.status(200).json({
      message: `Welcome ${userLogin.username}`,
      userToken: token,
      userLogin: userLogin,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "An error occurred during login" });
  }
};

// ================================================logout code===========================================
exports.logout = async (req, res) => {
  try {
    // Clear the usertoken cookie
    res.cookie("usertoken", "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(0), // Expire the cookie immediately
    });

    // Send success response
    res.status(200).send({ message: "success" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
