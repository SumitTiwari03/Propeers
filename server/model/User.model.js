const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, unique: true, required: true }, 
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean,default:false},
  role: {
    type: String,
    enum: ["user", "developer"],
    default: "user", // developer or regular user
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project", // Reference to the Project model
    },
  ],
});
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
