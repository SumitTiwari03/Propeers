const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const DBpassword = process.env.MONGODB_PASSWORD;

const Connect = mongoose.connect(
  `mongodb+srv://Sumit0309:${DBpassword}@cluster0.puuiszq.mongodb.net/Propeers?retryWrites=true&w=majority&appName=Cluster0`
);

module.exports = Connect;
  