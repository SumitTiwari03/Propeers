const jwt = require("jsonwebtoken");
const userModel = require("../model/User.model");
const projectModel = require("../model/project.model");

const toggleFavoriteProject = async (req, res) => {
  try {
    const token = req.cookies?.usertoken;
    if (!token) {
      return res.status(401).json({ message: "Please login to favorite projects." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    const userId = decoded.userId;
    const { projectId } = req.params;

    const project = await projectModel.findById(projectId).select("_id");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = await userModel.findById(userId).select("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exists = user.favorites.some((fav) => String(fav) === String(projectId));
    if (exists) {
      user.favorites = user.favorites.filter((fav) => String(fav) !== String(projectId));
    } else {
      user.favorites.push(projectId);
    }

    await user.save();

    res.status(200).json({
      message: exists ? "Removed from favorites" : "Added to favorites",
      isFavorite: !exists,
      favorites: user.favorites,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = toggleFavoriteProject;
