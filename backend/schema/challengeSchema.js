const {Schema} = require("mongoose");
const {userModel} = require("../model/userModel");
const {notificationModel} = require("../model/notificationModel");

const challengeSchema = new Schema({
    title : {
        type : String,
        required : true,
        lowerCase : true,
        trim : true
    },
    
    category : {
        type: String,
        enum: ["transportation","electricity","waste management","carbon emission","carbon save"],
        lowerCase : true,
        required: true,
        trim : true
    },

    challengeType : {
        type : String,
        enum : [
                "distance limit challenge",
                "ev travel challenge",
                "cng commute challenge",
                "power saving month",
                "waste reduction week",
                "zero waste day",
                "recycle and save",
                "carbon control challenge",
                "carbon saving challenge"
               ],
        lowerCase : true,
        required:true,
        trim : true
    },

    trackingType : {
        type : String,
        enum : ["all","transportation","electricity","waste management"],
        lowerCase : true,
        trim : true
    },

    target: {
        type: Number,
        min : 0,
        required: true
    },

    unit: {
        type: String,
        enum : ["km","kg","kwh","kgco2","trips"],
        required: true,
        trim : true,
        lowerCase : true
    },

    period: {
        type: String,
        enum: ["daily","weekly","monthly"],
        required: true,
        trim : true,
        lowerCase : true
    },

    startDate: {
        type: Date,
        required : true
    },

    endDate: {
        type: Date,
        required : true
    },

    status: {
        type: String,
        enum: ["not start","continue","close"],
        default: "not start",
        required : true,
        trim : true,
        lowerCase : true
    },

    direction: {
       type: String,
       enum: ["maximum", "minimum"],
       required: true,
       trim : true,
       lowerCase : true       
  },
}, { timestamps: true });

challengeSchema.pre("findOneAndDelete",async function(){
    const challengeId = this.getQuery()._id; 
     if (!challengeId) return;

    await userModel.updateMany(
        { "joinChallenges.challengeId": challengeId },
        { $pull: { joinChallenges: {challengeId }} }
    );

    await notificationModel.deleteMany({ relatedId : challengeId });
});
module.exports = {challengeSchema};