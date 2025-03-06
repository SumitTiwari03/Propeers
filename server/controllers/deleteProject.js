const projectModel = require("../model/project.model");

const deleteproject = async (req, res) => {
  const id = req.body._id;
  try {
    const updateProject = await projectModel.findByIdAndDelete(id);
    console.log("deleted:- ", updateProject);
    res.send({
      Message: "Deleted project successfully",
      details: updateProject,
    });
  } catch (err) {
    res.send({
      Message: "An error occured while deleting the project",
      ERROR: err,
    }); 
  }
};

module.exports = deleteproject;
