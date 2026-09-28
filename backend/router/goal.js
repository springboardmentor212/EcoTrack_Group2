const express = require("express");
const router = express.Router();
const {userCheck} = require("../middleware/userMiddleware");
const {validateGoal,validateUpdateGoal} = require("../middleware/goalMiddleware");
const {getGoals,getGoal,cancelGoal,deleteGoal,createGoal,updateGoal} = require("../controller/goal");

router.use(userCheck);

router.route("/")
      .get(getGoals)
      .post(validateGoal,createGoal)
      .patch(validateUpdateGoal,updateGoal);

router.route("/:id")
      .get(getGoal)
      .patch(cancelGoal)
      .delete(deleteGoal);

module.exports = router;