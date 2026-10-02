const {model} = require("mongoose");
const {notificationSchema} = require("../schema/notificationSchema ");

const notificationModel = model("Notification",notificationSchema);

module.exports = {notificationModel};
