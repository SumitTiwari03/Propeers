const express = require("express");
const dotenv = require("dotenv");
const connect = require("./config/connection");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const app = express();

// app.use(cors())
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173", // For local development
  "https://propeers-07w5.onrender.com", // Replace with your deployed frontend domain
]; 

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));  // Increase JSON payload limit
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Increase URL-encoded payload limit

// home page
app.get("/", (req, res) => {
  res.send("Welcome to home page");
});

// all routers

// authentication routers
const auth_router = require("./route/auth.route");
app.use("/api/auth", auth_router);

// others routes
const profile_router = require("./route/other.routes");
app.use("/api", profile_router);

// connection to DB and listen function
const port = process.env.PORT || 8080;
app.listen(port, async () => {
  try {
    await connect;
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }
  console.log(`Server is running on port http://localhost:${port}`);
});
 