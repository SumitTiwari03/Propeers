const multer = require("multer");
const cloudinary = require("../config/cloudinary.config");
const User = require("../model/User.model");
const Profile = require("../model/profile.model"); // ✅ use Profile model

const PostProfile = async (req, res) => {
  const { userId, personalInfo, socialLinks, technicalSkill } = req.body;

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imgUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Propeers",
      });
      imgUrl = result.secure_url;
    }

    // ✅ Create new Profile, not User
    console.log(user)
    const newProfile = new Profile({
      user: userId,
      personalInfo: {
        imgUrl: imgUrl,
        name: personalInfo.username, // or user.fullname depending on your schema
        location: personalInfo?.location || "",
        email: user.email,
        college: personalInfo?.college || "",
      },
      socialLinks: {
        github: socialLinks?.github || "",
        linkedIn: socialLinks?.linkedIn || "",
        Twitter: socialLinks?.Twitter || "",
        others: socialLinks?.others || "",
      },
      technicalSkill: technicalSkill || [],
    });

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
