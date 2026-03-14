const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authenticate = (req, res, next) => {
  const cookies = req.headers.cookie;

  if (!cookies) {
    return res.status(401).send({ Message: "No Login found. Please Login again" });
  }

  // Safely parse the specific "usertoken" cookie from the cookie header
  const tokenCookie = cookies.split(";").find((c) => c.trim().startsWith("usertoken="));
  if (!tokenCookie) {
    return res.status(401).send({ Message: "No Login found. Please Login again" });
  }
  const token = tokenCookie.trim().split("=").slice(1).join("=");

  jwt.verify(token, process.env.JWT_SECRETE, (err, user) => {
    if (err) return res.status(401).send({ Message: "Invalid token" });
    if (user) {
      return res.send({ user });
    }
  });
};

module.exports = authenticate;
