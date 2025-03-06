const express=require('express')
const router=express.Router()

const authenticate=require('../controllers/authControllers')
const verify=require('../controllers/verify')
 
router.post('/register',authenticate.register)
router.post('/login',authenticate.login) 
router.get('/verifyemail',verify)  
router.post('/logout',authenticate.logout)
 
module.exports = router
  