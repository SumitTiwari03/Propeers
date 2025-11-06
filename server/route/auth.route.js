const express=require('express')
const router=express.Router()

const authenticate=require('../controllers/authControllers')
 

// In your routes file
router.post('/register', authenticate.register);
router.get('/verify-email', authenticate.verifyEmail);
router.post('/login', authenticate.login);
router.post('/forgot-password', authenticate.forgotPassword);
router.post('/reset-password', authenticate.resetPassword);
router.post('/resend-verification', authenticate.resendVerification);
router.post('/logout', authenticate.logout);


module.exports = router
