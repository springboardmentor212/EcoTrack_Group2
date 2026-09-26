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
      .patch(
            upload.single('profilePhoto'),
                (req, res, next) => {
            try {
                if (req.body.sustainabilityPreferences) {
                    req.body.sustainabilityPreferences =
                        JSON.parse(req.body.sustainabilityPreferences);
                }

                if (req.body.environmentalInterests) {
                    req.body.environmentalInterests =
                        JSON.parse(req.body.environmentalInterests);
                }

                if (req.body.personalGoalPreferences) {
                    req.body.personalGoalPreferences =
                        JSON.parse(req.body.personalGoalPreferences);
                }

                next();
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid array data"
                });
            }
        },
             validateProfile,
             updateProfile);

module.exports = router;