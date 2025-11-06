const multer = require("multer");
const cloudinary = require("../config/cloudinary.config");
const Profile = require("../model/profile.model");
const User = require("../model/User.model");

// Configure memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const Edit = async (req, res) => {
  try {
    const { userId, personalInfo, socialLinks, technicalSkill } = req.body;
    let imgUrl;

    // Handle file upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`, 
        { folder: "Propeers" }
      );
      imgUrl = result.secure_url;
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        message: "Profile not found. Create one first.",
      });
    }

    // Update profile fields
    profile.personalInfo = {
      ...profile.personalInfo,
      ...JSON.parse(personalInfo),
      ...(imgUrl && { imgUrl }) // Update image only if new one uploaded
    };

    profile.socialLinks = {
      ...profile.socialLinks,
      ...JSON.parse(socialLinks)
    };

    profile.technicalSkill = technicalSkill ? JSON.parse(technicalSkill) : profile.technicalSkill;

    const updatedProfile = await profile.save();
    res.status(200).json({
      message: "Profile updated!",
      profile: updatedProfile
    });

  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({
      message: "Server error during update",
      error: err.message
    });
  } 
};

module.exports = [upload.single("imgUrl"), Edit];