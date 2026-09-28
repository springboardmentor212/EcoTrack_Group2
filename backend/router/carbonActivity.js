const express =  require("express");
const router = express.Router();

const {userCheck} = require("../middleware/userMiddleware");
const {validateTransportation,validateElectricity,validateWaste,
       validateUpdateTransportation,validateUpdateElectricity,validateUpdateWaste
} = require("../middleware/carbonActivityMiddleware");
const {createTransporatationActivity,createElectricityActivity,createWasteActivity,
       getTransporatationActivity,getElectricityActivity,getWasteActivity,getActivity,
       updateTransporatationActivity,updateElectricityActivity,updateWasteActivity,
       deleteActivity,summaryActivity
      } = require("../controller/carbonActivity")

router.use(userCheck);

router.route("/summary")
      .get(summaryActivity);

router.route("/transportation")
      .get(getTransporatationActivity)
      .post(validateTransportation,createTransporatationActivity)
      .patch(validateUpdateTransportation,updateTransporatationActivity);

router.route("/electricity")
      .get(getElectricityActivity)
      .post(validateElectricity,createElectricityActivity)
      .patch(validateUpdateElectricity,updateElectricityActivity);

router.route("/waste")
      .get(getWasteActivity)
      .post(validateWaste,createWasteActivity)
      .patch(validateUpdateWaste,updateWasteActivity);

router.route("/:id")
      .get(getActivity)
      .delete(deleteActivity);

module.exports = router;