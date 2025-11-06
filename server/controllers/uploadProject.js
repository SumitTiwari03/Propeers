const multer = require("multer");
const cloudinary = require("../config/cloudinary.config");
const Project = require("../model/project.model");

// Configure multer storage 
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  },
}); 
const upload = multer({ storage: storage });
 
// Upload project controller 
const uploadProject = async (req, res) => {
  try {
    const { title, projectUrl, description, techStack, createdBy } = req.body;

    if (!createdBy) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User not authenticated." });
    }

    if (!title || !projectUrl || !description) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    let imgUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Propeers",
      });
      imgUrl = result.secure_url;
    } else {
      imgUrl = req.body.imgUrl; // Use URL if provided
    }

    const newProject = new Project({
      title,
      imgUrl,
      projectUrl,
      description,
      techStack,
      createdBy,
    });

    const savedProject = await newProject.save();

    res.status(201).json({
      message: "Project created successfully!",
      project: savedProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      message: "Internal server error. Could not create project.",
      error: error.message,
    });
  }
};

// Middleware to handle multipart form-data
module.exports = [upload.single("file"), uploadProject];
