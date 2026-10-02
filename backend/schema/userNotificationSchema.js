const {Schema} = require("mongoose");
const {notificationModel} = require("../model/notificationModel");

const userNotificationSchema = new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        notificationId: {
            type: Schema.Types.ObjectId,
            ref: "Notification",
            required: true
        },

        isRead: {
            type: Boolean,
            default: false
        },

        readAt: {
            type: Date,
            default: null
        }
    },{ timestamps: true });

userNotificationSchema.index(
    {
        userId: 1,
        notificationId: 1
    },
    {
        unique: true
    }
);


userNotificationSchema.pre("deleteMany", async function() {
   const filter = this.getFilter();
   const userNotifications = await this.model.find(filter).select("notificationId -_id");

   const notificationIds = userNotifications.map(
        item => item.notificationId
    );

    if (notificationIds.length > 0) {
       await notificationModel.deleteMany({
                _id: { $in: notificationIds },
                type: {
                    $in: ["goal reminder", "challenge reminder"]
                }
            });
    }
});

module.exports = {userNotificationSchema};
