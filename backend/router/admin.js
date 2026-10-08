const express = require("express");
const router = express.Router();
const multer  = require('multer');
const {storage} = require("../cloundConfig.js");
const upload = multer({storage})

const {userCheck,validateLogin} = require("../middleware/userMiddleware");
const {validateAdminProfile} = require("../middleware/adminMiddleware");
const {adminLogin,getAdminProfile,updateAdminProfile,users,block,unBlock,reports} = require("../controller/admin");

router.route("/login")
      .post(validateLogin,adminLogin);

router.use(userCheck);

router.route("/profile")
      .get(getAdminProfile)
      .patch(upload.single('profilePhoto'),
              validateAdminProfile,
              updateAdminProfile);

router.route("/user")
      .get(users);

router.route("/block")
      .patch(block);

router.route("/unblock")
      .patch(unBlock);


router.route("/report")
      .get(reports);

module.exports = router;