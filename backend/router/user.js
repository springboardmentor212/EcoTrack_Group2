const express = require('express');
const router = express.Router();
const {register,login,verifyEmail,resendOtp,logOut,resetPassword,verifyEmailForResetPassword,deleteAccount} = require('../controller/user');
const {validateLogin,validateRegister,validateVerifyEmail,validateResendOtp,validateResetPassword,userCheck} = require("../middleware/userMiddleware");

router.route('/register')
      .post(validateRegister,register);

router.route("/login")
       .post(validateLogin,login);

router.route("/verifyEmail")
       .post(validateVerifyEmail,verifyEmail);

router.route("/verifyEmailForResetPassword")
       .post(validateVerifyEmail,verifyEmailForResetPassword);

router.route("/resendOtp")
       .post(validateResendOtp,resendOtp);
      
router.route("/resetPassword")
      .patch(validateResetPassword,resetPassword);

router.use(userCheck);

router.route("/")
       .delete(deleteAccount);
       
router.route("/logout")
       .get(logOut);

module.exports = router;
