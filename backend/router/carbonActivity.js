const express =  require("express");
const router = express.Router();

const {userCheck} = require("../middleware/userMiddleware");
const {validateTransportation,validateElectricity,validateWaste} = require("../middleware/carbonActivityMiddleware");
const {createTransporatationActivity,createElectricityActivity,createWasteActivity,
       getTransporatationActivity,getElectricityActivity,getWasteActivity,getActivity,
       updateTransporatationActivity,updateElectricityActivity,updateWasteActivity,
       deleteActivity
      } = require("../controller/carbonActivity")

router.use(userCheck);

router.route("/transportation")
      .get(getTransporatationActivity)
      .post(validateTransportation,createTransporatationActivity)
      .patch(validateTransportation,updateTransporatationActivity);

router.route("/electricity")
      .get(getElectricityActivity)
      .post(validateElectricity,createElectricityActivity)
      .patch(validateElectricity,updateElectricityActivity);

router.route("/waste")
      .get(getWasteActivity)
      .post(validateWaste,createWasteActivity)
      .patch(validateWaste,updateWasteActivity);

router.route("/:id")
      .get(getActivity)
      .delete(deleteActivity);

module.exports = router;