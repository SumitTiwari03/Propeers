const multer = require("multer");
const cloudinary = require("../config/cloudinary.config");
const projectModel = require("../model/project.model");

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const editproject = async (req, res) => {
  const id = req.body._id;
  try {
    const updateData = { ...req.body };
    delete updateData._id;

    // techStack may arrive as a JSON string when sent via FormData
    if (typeof updateData.techStack === "string") {
      try { updateData.techStack = JSON.parse(updateData.techStack); } catch (_) {}
    }

    // Upload new image to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "Propeers" }
      );
      updateData.imgUrl = result.secure_url;
    }

    const updateProject = await projectModel.findByIdAndUpdate(id, updateData, { new: true });
    res.send({ Message: "Project Updated", details: updateProject });
  } catch (err) {
    res.status(500).send({ Message: "Error occurred while updating the Project", error: err.message });
  }
};

module.exports = [upload.single("imgUrl"), editproject];
