const express = require("express");
const router = express.Router();
const {userCheck} = require("../middleware/userMiddleware");
const {validateChallenge,validateUpdateChallenge} = require("../middleware/challengeMiddleware");
const {createChallenge,getChallengesByUser,getChallengesByAdmin,getChallenge,updateChallenge,deleteChallenge,joinChallenge,cancelChallenge} 
       = require("../controller/challenge");

router.use(userCheck);

router.route("/user")
      .get(getChallengesByUser);

router.route("/admin")
      .get(getChallengesByAdmin);

router.route("/")
      .post(validateChallenge,createChallenge)
      .patch(validateUpdateChallenge,updateChallenge);

router.route("/:id")
      .get(getChallenge)
      .delete(deleteChallenge);

router.route("/join/:id")
       .patch(joinChallenge);

router.route("/cancel/:id")
       .patch(cancelChallenge);

module.exports = router;