const projectModel = require("../model/project.model");

const editproject = async (req, res) => {
  const id = req.body._id;
  console.log(id);
  const data=req.body
  console.log(data);
//   const { img, title, description, techStack, projectUrl } = req.body;
  try {
    const updateProject = await projectModel.findByIdAndUpdate(id, data);
    res.send({ Message: "Project Updated", details: updateProject });
  } catch (err) {
    res.send({ Message: "Error occured while updating the Project",error:err });
  }
};

module.exports = editproject; 