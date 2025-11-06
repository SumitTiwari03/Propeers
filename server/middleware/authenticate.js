const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authenticate = (req, res, next) => {
  const cookies = req.headers.cookie;

  if (!cookies) {
    res.send({ Message: "No Login found. Please Login again" });
  } else {
    const token = cookies.split("=")[1];
    jwt.verify(token, process.env.JWT_SECRETE, (err, user) => {
      if (err) res.send({ Message: "Invalid token" });
      if (user) {
        req.body = user;
        res.send({ user });
      }
    });
  }

  next();
};

module.exports = authenticate;
