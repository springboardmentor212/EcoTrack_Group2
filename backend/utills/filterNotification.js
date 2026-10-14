const {notificationModel} = require("../model/notificationModel");

const getNotificationIds = async (types) => {

    const notifications = await notificationModel.find({
        type: {
            $in: types
        }
    }).select("_id");

    return notifications.map(
        notification => notification._id
    );
};

module.exports = {getNotificationIds};