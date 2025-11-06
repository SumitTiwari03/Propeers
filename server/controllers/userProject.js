const projectModel = require("../model/project.model");

const userProject = async (req, res) => {
  try {
    const { userId } = req.query; // Correctly destructure userId
    const project = await projectModel.find({ user: userId }); // Match with `user` field in your schema

    if (!project) {
      return res.status(404).send({ message: "No Project found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching Projects:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Export the function
module.exports = userProject;
