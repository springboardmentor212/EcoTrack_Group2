const {model} = require("mongoose");
const {userNotificationSchema} = require("../schema/userNotificationSchema");

const userNotificationModel = model("UserNotification",userNotificationSchema);

module.exports = {userNotificationModel};