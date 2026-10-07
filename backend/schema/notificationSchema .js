const mongoose = require("mongoose");
const {Schema} = mongoose;

const notificationSchema = new Schema({
      type : {
         type: String,
         enum: [
                "profile complition",
                "goal suggestion",
                "challenge suggestion",
                "goal reminder",
                "challenge reminder",
                "challenge information"
         ],
         required: true,
         trim: true,
         lowercase: true
      },

      title: {
          type: String,
          required: true,
          trim: true
      },

      message: {
          type: String,
          required: true,
          trim: true
      },

      relatedId: {
          type: Schema.Types.ObjectId,
          default: null
      },

      action: {
          type: String,
          enum : [
                   "complete profile",
                   "create goal",
                   "join challenge",
                   "entry activity",
                   "informational notification"
          ],
          trim: true,
          required : true
      }
    },{ timestamps: true });

notificationSchema.pre("deleteMany", async function() {
    const filter = this.getFilter();
    
    // Internal deletion se middleware ko skip karo
    if (this.getOptions().skipCascade) {
        return;
    }

    const notifications = await this.model.find(filter).select("_id");
    const notificationIds = notifications.map(
        item => item._id
    );
      
    if(notificationIds.length > 0){
        const userNotificationModel = mongoose.model("UserNotification");
        await userNotificationModel.deleteMany({
            notificationId: { $in: notificationIds }
        },
        {
            skipCascade: true
        }
    );
    }
});

module.exports = {notificationSchema};

