const userModel = require("../model/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { verificationMailer, resetPasswordMailer } = require("./mailverify");
dotenv.config();

const baseUrl = process.env.REACT_APP_URL;
const pageUrl = process.env.REACT_APP_Page;

//======================================================= Registration =============================================

exports.register = async (req, res) => {
  const { username, fullname, email, password } = req.body;

  // Checking for uniqueness of email and username
  let existingUserEmail, existingUsername;
  try {
    existingUserEmail = await userModel.findOne({ email: email });
    existingUsername = await userModel.findOne({ username: username });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Database error", error: err });
  }

  if (existingUserEmail) 
    return res.status(409).json({ message: "Email already exists" });
  if (existingUsername) 
    return res.status(409).json({ message: "Username already exists" });

  // Hashing the password
  try {
    const hash = await bcrypt.hash(password, 10);
    
    const user = new userModel({
      fullname,
      username,
      email,
      password: hash,
      isVerified: false, // User starts as unverified
    });

    const JWT_SECRET = process.env.JWT_SECRETE;
    await user.save();
    

    // Generate verification token
    const token = jwt.sign({ email, userId: user._id }, JWT_SECRET, { 
      expiresIn: "24h" 
    });
    
    const verificationLink = `https://propeers.onrender.com/api/auth/verifyemail?token=${token}`;
    
    // Send verification email
    const emailResponse = await verificationMailer(
      username,
      email,
      verificationLink
    );

    if (!emailResponse.success) {
      return res.status(500).json({
        message: "User registered, but verification email could not be sent",
        error: emailResponse.error,
      });
    }

    res.status(201).json({
      message: "Registered successfully. Please check your email to verify your account.",
      userId: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed", error: err });
  }
};

//================================================ Email Verification ==========================================

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Verification token is required" });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRETE;
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Update user verification status
    user.isVerified = true;
    await user.save();

    // Redirect to frontend success page
    res.redirect(`${pageUrl}/login`);
  } catch (err) {
    console.error("Email verification error:", err);
    
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ 
        message: "Verification link has expired. Please request a new one." 
      });
    }
    
    res.status(400).json({ 
      message: "Invalid verification token",
      error: err 
    });
  }
};

//================================================ Login ==========================================

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find the user by email or username
    const userLogin = await userModel.findOne({
      $or: [{ email: email }, { username: email }],
    });
    console.log("log from login api:- ",userLogin)
    // If user not found
    if (!userLogin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // If email is not verified
    if (!userLogin.isVerified) {
      return res.status(403).json({ 
        message: "Please verify your email first. Check your inbox for the verification link." 
      });
    }
    
    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, userLogin.password);
    
    // If password is invalid
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      {
        email: userLogin.email,
        username: userLogin.username,
        userId: userLogin._id,
      },
      process.env.JWT_SECRETE,
      { expiresIn: "24h" } // Token expires in 24 hours
    );

    // Set the token in a cookie
    res.cookie("usertoken", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      httpOnly: true,
      sameSite: "lax",
      secure:"true"
      // sameSite: "none",
    }); 

    // Send success response
    res.status(200).json({
      message: `Welcome back, ${userLogin.username}!`,
      userToken: token,
      user: {
        id: userLogin._id,
        username: userLogin.username,
        email: userLogin.email,
        fullname: userLogin.fullname,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "An error occurred during login", error: err });
  }
};

//================================================ Forgot Password ==========================================

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if user exists
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email address" });
    }

    // Generate password reset token
    const JWT_SECRET = process.env.JWT_SECRETE;
    const token = jwt.sign(
      { email: user.email, userId: user._id }, 
      JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // Create reset link (frontend route)
    const resetLink = `${pageUrl}/reset-password/${token}`;

    // Send password reset email
    const emailResponse = await resetPasswordMailer(
      user.username,
      user.email,
      resetLink
    );

    if (!emailResponse.success) {
      return res.status(500).json({
        message: "Failed to send password reset email",
        error: emailResponse.error,
      });
    }

    res.status(200).json({
      message: "Password reset link has been sent to your email",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ 
      message: "Something went wrong", 
      error: err 
    });
  }
};

//================================================ Reset Password ==========================================

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ 
      message: "Token and new password are required" 
    });
  }

  try {
    // Verify the token
    const JWT_SECRET = process.env.JWT_SECRETE;
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user by email from token
    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ 
      message: "Password has been reset successfully. You can now login with your new password." 
    });
  } catch (err) {
    console.error("Reset password error:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ 
        message: "Reset link has expired. Please request a new password reset." 
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ 
        message: "Invalid reset token" 
      });
    }

    res.status(500).json({ 
      message: "Error occurred while resetting the password", 
      error: err 
    });
  }
};

//================================================ Resend Verification Email ==========================================

exports.resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const JWT_SECRET = process.env.JWT_SECRETE;
    const token = jwt.sign(
      { email: user.email, userId: user._id }, 
      JWT_SECRET, 
      { expiresIn: "24h" }
    );

    const verificationLink = `${baseUrl}/api/auth/verify-email?token=${token}`;

    // Send verification email
    const emailResponse = await verificationMailer(
      user.username,
      user.email,
      verificationLink
    );

    if (!emailResponse.success) {
      return res.status(500).json({
        message: "Failed to send verification email",
        error: emailResponse.error,
      });
    }

    res.status(200).json({
      message: "Verification email has been resent. Please check your inbox.",
    });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ 
      message: "Something went wrong", 
      error: err 
    });
  }
};

//================================================ Logout ==========================================

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
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
