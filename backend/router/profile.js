const express = require("express");
const router = express.Router();
const multer  = require('multer');
const {storage} = require("../cloundConfig.js");
const upload = multer({storage});

const {getProfile,updateProfile} = require("../controller/profile");
const {userCheck} = require("../middleware/userMiddleware");
const {validateProfile} = require("../middleware/profileMiddleware");

router.use(userCheck);

router.route("/")
      .get(getProfile)
      .patch(validateProfile,
             upload.single('profilePhoto'),
             updateProfile);

module.exports = router;