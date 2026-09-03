const express = require('express');
const router = express.Router();
const {register,login,verifyEmail,resendOtp,logOut,resetPassword} = require('../controller/user');
const {validateLogin,validateRegister,validateVerifyEmail,validateResendOtp,validateResetPassword,userCheck} = require("../middleware");

router.route('/register')
      .post(validateRegister,register);

router.route("/login")
       .post(validateLogin,login);

router.route("/verifyEmail")
       .post(validateVerifyEmail,verifyEmail);

router.route("/resendOtp")
       .post(validateResendOtp,resendOtp);

router.use(userCheck);

router.route("/logout")
       .get(logOut);

router.route("/resetPassword")
      .patch(validateResetPassword,resetPassword);

module.exports = router;
