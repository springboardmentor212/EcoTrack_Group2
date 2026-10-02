const express = require("express");
const router = express.Router();
const {getNotification,readNotification,deleteNotifications,deleteAllNotification} 
       = require("../controller/notification");
const {userCheck} = require("../middleware/userMiddleware");

router.use(userCheck);

router.route("/")
      .get(getNotification)
      .delete(deleteAllNotification);

router.route("/read/:id")
      .patch(readNotification);

router.route("/delete")
      .patch(deleteNotifications);

module.exports = router;