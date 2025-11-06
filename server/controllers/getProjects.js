const projectModel = require("../model/project.model");
const getProjects = async (req,res) => {
  try {
    const project = await projectModel.find({}); // Match with `user` field in your schema
    if (!project) {
      return res.status(404).send({ message: "No Project found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = getProjects;
