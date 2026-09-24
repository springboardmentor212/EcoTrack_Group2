const express = require("express");
const router = express.Router();
const {userCheck} = require("../middleware/userMiddleware");
const {validateGoal,validateTransportationGoal,validateElectricityGoal,validateWasteGoal,validateCarbonEmissionGoal,validateCarbonSaveGoal,
      validateUpdateTransportationGoal,validateUpdateElectricityGoal,validateUpdateWasteGoal,
      validateUpdateCarbonEmissionGoal,validateUpdateCarbonSaveGoal
} = require("../middleware/goalMiddleware");
const {getGoals,getGoal,cancelGoal,deleteGoal,
createTransportationGoal,createElectricityGoal,createWastemanagementGoal,createCarbonEmissionGoal,createCarbonSaveGoal,
updateTransportationGoal,updateElectricityGoal,updateWastemanagementGoal,updateCarbonEmissionGoal,updateCarbonSaveGoal
} = require("../controller/goal");

router.use(userCheck);

router.route("/")
      .get(getGoals);

router.route("/transportation")
      .post(validateGoal,createTransportationGoal)
      .patch(validateUpdateTransportationGoal,updateTransportationGoal);

router.route("/electricity")
      .post(validateElectricityGoal,createElectricityGoal)
      .patch(validateUpdateElectricityGoal,updateElectricityGoal);

router.route("/waste_management")
      .post(validateWasteGoal,createWastemanagementGoal)
      .patch(validateUpdateWasteGoal,updateWastemanagementGoal);

router.route("/carbon_emission")
      .post(validateCarbonEmissionGoal,createCarbonEmissionGoal)
      .patch(validateUpdateCarbonEmissionGoal,updateCarbonEmissionGoal);

router.route("/carbon_save")
      .post(validateCarbonSaveGoal,createCarbonSaveGoal)
      .patch(validateUpdateCarbonSaveGoal,updateCarbonSaveGoal);

router.route("/:id")
      .get(getGoal)
      .patch(cancelGoal)
      .delete(deleteGoal);

module.exports = router;