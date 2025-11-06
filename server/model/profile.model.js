const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", 
    required: true,
  },
  personalInfo: {
    username: { type: String },
    imgUrl: { type: String },
    name: { type: String },
    location: { type: String },
    email: { type: String, required: true, unique: true },
    college: { type: String },
  },
  socialLinks: {
    github: { type: String },
    linkedIn: { type: String },
    Twitter: { type: String },
    others: [
      {
        platform: { type: String },
        url: { type: String },
      },
    ],
  },
  technicalSkill: { 
    type: [String],
  },
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
