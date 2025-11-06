const express = require("express");
const router = express.Router();

const auth = require("../middleware/authenticate");
const gemini = require("../controllers/Gemini");
const editProfile = require("../controllers/editProfile");
const PostProfile = require("../controllers/postProfile");
const uploadProject = require("../controllers/uploadProject");
const userProfile =require('../controllers/userProfile')
const ContactMail =require('../controllers/ContactMail')
const userProject=require('../controllers/userProject')
const editProject=require('../controllers/editProject')
const deleteProject=require('../controllers/deleteProject')
const getProjects=require('../controllers/getProjects')

// profiles securing routes
router.get("/profile", auth);
router.get("/profile/edit", auth);
router.get("/profile/details",userProfile ); 
router.get("/profile/upload", auth);


router.get("/projects", getProjects);


router.get("/profile/project", userProject);

router.patch("/profile/edit", editProfile);
router.delete("/profile/deleteproject", deleteProject); 
router.patch("/profile/editproject", editProject);

router.post("/profile/post", PostProfile);
router.post("/maildata", ContactMail);
router.post('/profile/upload',uploadProject)

// other api routes
router.post("/propeers", gemini);
module.exports = router;