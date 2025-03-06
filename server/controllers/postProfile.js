const multer = require("multer");
const cloudinary = require("../config/cloudinary.config");
const User = require("../model/User.model");
 
const PostProfile = async (req, res) => {
  const { userId, personalInfo, socialLinks, tecnicalSkill } = req.body;

  let imgUrl;
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "Propeers",
    });
    imgUrl = result.secure_url;
  }
  try {
    // Check if a profile already exists for the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // const existingProfile = await Profile.findOne({ user: userId });
    // Create a new profile
    const newProfile = new Profile({
      user: userId, // Reference to the user ObjectId
      personalInfo: {
        imgUrl: imgUrl,
        username: user.username,
        location: personalInfo.location,
        email: user.email,
        college: personalInfo.college,
      },
      socialLinks: {
        github: socialLinks.github,
        linkedIn: socialLinks.linkedIn,
        Twitter: socialLinks.Twitter,
        others: socialLinks.others, // This should be an array of { platform, url }
      },
      tecnicalSkill, // Array of technical skills
    });

    // Save the profile to the database
    const savedProfile = await newProfile.save();

    res.status(201).json({
      message: "Profile created successfully!",
      profile: savedProfile,
    });
  } catch (err) {
    console.error("Error saving profile:", err);
    res.status(500).json({
      message: "Server error while creating profile.",
      error: err.message,
    });
  }
};

module.exports = PostProfile;
