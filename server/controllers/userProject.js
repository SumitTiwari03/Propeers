const projectModel = require("../model/project.model");

const userProject = async (req, res) => {
  try {
    const { userId } = req.query;
    const project = await projectModel.find({
      $or: [{ createdBy: userId }, { user: userId }],
    });

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching Projects:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Export the function
module.exports = userProject;
