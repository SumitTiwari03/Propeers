const jwt = require("jsonwebtoken");
const userModel = require("../model/User.model");

const getFavoriteProjects = async (req, res) => {
  try {
    const token = req.cookies?.usertoken;
    if (!token) {
      return res.status(401).json({ message: "Please login to view favorites." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    const user = await userModel
      .findById(decoded.userId)
      .populate({ path: "favorites", populate: { path: "createdBy", select: "username", model: "user" } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const favorites = (user.favorites || []).map((project) => {
      const obj = project.toObject();
      return {
        ...obj,
        createdById: obj.createdBy?._id || null,
        createdByUsername: obj.createdBy?.username || "Unknown",
        isFavorite: true,
      };
    });

    res.status(200).json(favorites);
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }
    console.error("Error fetching favorite projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getFavoriteProjects;
