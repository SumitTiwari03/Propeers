const projectModel = require("../model/project.model");
const userModel = require("../model/User.model");
const jwt = require("jsonwebtoken");

const getProjects = async (req,res) => {
  try {
    let project = await projectModel.find({});
    project = await projectModel
      .find({})
      .populate({ path: "createdBy", select: "username", model: "user" });

    let favoriteIds = new Set();
    const token = req.cookies?.usertoken;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETE);
        const loggedInUser = await userModel.findById(decoded.userId).select("favorites");
        favoriteIds = new Set((loggedInUser?.favorites || []).map((id) => String(id)));
      } catch (err) {
        // Ignore invalid/expired token for public projects listing
      }
    }

    const formattedProjects = project.map((item) => {
      const obj = item.toObject();
      return {
        ...obj,
        createdById: obj.createdBy?._id || null,
        createdByUsername: obj.createdBy?.username || "Unknown",
        isFavorite: favoriteIds.has(String(obj._id)),
      };
    });

    if (!project) {
      return res.status(404).send({ message: "No Project found" });
    }
    res.status(200).json(formattedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = getProjects;
