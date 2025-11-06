const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imgUrl: { type: String, required: true },
  projectUrl: { type: String, required: true },
  description: { type: String, required: true },
  techStack: {
    type: [String],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the developer who created the project
    required: true,
  },
  createdAt: {
    type: Date, 
    default: Date.now,
  },
});

const projectModel = mongoose.model("project", projectSchema);

module.exports = projectModel;
