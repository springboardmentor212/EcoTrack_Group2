const express = require('express');
const router = express.Router();
const {register,login,verifyEmail,resendOtp,logOut,resetPassword,verifyEmailForResetPassword,
       deleteAccount,checkUser,getNotificationPreference,updateNotificationPreference,changePassword} = require('../controller/user');
const {validateLogin,validateRegister,validateVerifyEmail,validateResendOtp,validateResetPassword,userCheck,
       validateNotificationSetting,validateDeleteAccount} = require("../middleware/userMiddleware");

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
       .delete(validateDeleteAccount,deleteAccount);
 
router.route("/changePassword")
       .get(changePassword);

router.route("/notification")
      .get(getNotificationPreference)
      .patch(validateNotificationSetting,updateNotificationPreference);

router.route("/logout")
       .get(logOut);

router.route("/checkUser")
        .get(checkUser);

module.exports = router;
