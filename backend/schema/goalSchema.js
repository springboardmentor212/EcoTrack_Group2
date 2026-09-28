const {Schema} = require("mongoose");

const goalSchema = new Schema({
   userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title : {
        type : String,
        required : true,
        lowerCase : true,
    },
    
    category : {
        type: String,
        enum: ["transportation","electricity","waste management","carbon emission","carbon save"],
        lowerCase : true,
        required: true
    },

    goalType : {
        type : String,
        enum : ["reduce travelling distance",
                "keep travelling distance within limit",
                "use only electric vehicle",
                "use only cng vehicle",
                "reduce electricity consumption",
                "keep electricity consumption within limit",
                "reduce waste generated",
                "keep waste generation within limit",
                "reduce carbon emissions",
                "keep carbon emissions within limit",
                "increase carbon saved"
               ],
        lowerCase : true,
        required:true
    },

    trackingType : {
        type : String,
        enum : ["all","transportation","electricity","waste management"],
        lowerCase : true
    },

    target: {
        type: Number,
        min : 0,
        required: true
    },

    unit: {
        type: String,
        enum : ["km","kg","kwh","kgco2","%","trips"],
        required: true
    },

    period: {
        type: String,
        enum: ["daily","weekly","monthly"],
        required: true
    },

    startDate: {
        type: Date,
        default : () => new Date(Date.now()),
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["active","completed","failed","cancelled","not have entry"],
        default: "active",
        required : true
    },

    goalDirection: {
       type: String,
       enum: ["maximum", "minimum"],
       required: true
       
  },

  baseValue : {
       type : Number,
       min : 0,
       default : 0
  }

}, { timestamps: true });

module.exports = {goalSchema};