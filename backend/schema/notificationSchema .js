const {Schema} = require("mongoose");

const notificationSchema = new Schema({
      type : {
         type: String,
         enum: [
                "profile complition",
                "goal suggestion",
                "challenge suggestion",
                "goal reminder",
                "challenge reminder"
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
                   "entry activity"
          ],
          trim: true,
          required : true
      }
    },{ timestamps: true });

module.exports = {notificationSchema};

