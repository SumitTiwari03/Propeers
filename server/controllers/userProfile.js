const Profile = require("../model/profile.model");
const userProfile = async (req, res) => {
  const { userId } = req.query; // Extract userId from query parameters
console.log(req.query)
  try {
      const details = await Profile.findOne({ user: userId });
      console.log("log from the api :- ",details)

      if (!details) {
          return res.status(404).send({ message: "Profile not found" }); 
      }  

      res.status(200).send(details);
  } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = userProfile;