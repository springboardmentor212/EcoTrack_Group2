const express = require("express");
const router = express.Router();
const multer  = require('multer');
const {storage} = require("../cloundConfig.js");
const upload = multer({storage})

const {userCheck,validateLogin} = require("../middleware/userMiddleware");
const {validateAdminProfile} = require("../middleware/adminMiddleware");
const {adminLogin,getAdminProfile,updateAdminProfile,adminDashboard,users,block,unBlock,userReport,
       completeChallengesReport,challengeReport} = require("../controller/admin");

router.route("/login")
      .post(validateLogin,adminLogin);

router.use(userCheck);

router.route("/")
      .get(adminDashboard);
      
router.route("/profile")
      .get(getAdminProfile)
      .patch(upload.single('profilePhoto'),
              validateAdminProfile,
              updateAdminProfile);

router.route("/user")
      .get(users);

router.route("/block/:id")
      .patch(block);

router.route("/unblock/:id")
      .patch(unBlock);

router.route("/report/user")
      .get(userReport);

router.route("/report/challenge")
       .get(completeChallengesReport);
     
router.route("/report/challenge/:id")
       .get(challengeReport);
       
module.exports = router;