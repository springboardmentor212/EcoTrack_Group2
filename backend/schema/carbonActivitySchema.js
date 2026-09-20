const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const transportationSchema = new Schema({
    transportMode: {
        type: String,
        enum : ["2 wheeler","4 wheeler","auto rickshaw","bus","train"],
        required: true,
        lowercase :true,
        trim : true,
    },

    distance: {
        type: Number,
        required: true
    },

    tripPurpose: {
        type: String,
        minLength : "3",
        lowercase :true,
        trim : true,
    },

    fuelType: {
        type: String,
        enum : ["petrol","diesel","cng","electric"],
        required: true,
        lowercase :true,
        trim : true,
    }
}, { _id: false });


const electricitySchema = new Schema({
    month : {
        type : String,
        enum : ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"],
        lowercase : true,
        trim : true,
        required : true,
    },
    year : {
        type : Number,
        min : 2000,
        required : true,
        validate: {
          validator: function(value) {
           return value <= new Date().getFullYear();
         }
        }
    },
    consumption: {
        type: Number,
        min : 0,
        required: true
    },

    usageType: {
        type: String,
        enum: ["home","business"],
        required: true,
        lowercase :true,
        trim : true,
    }
}, { _id: false });


const wasteSchema = new Schema({
    wasteType: {
        type: String,
        enum: [
             "wet waste",
             "dry waste",
             "e waste",
        ],
        required: true,
        lowercase : true,
        trim : true,
    },

    wasteAmount: {
        type: Number,
        required: true
    },

    disposalMethod: {
        type: String,
        enum: [
            "recycled",
            "burned",
            "landfill",
            "composting"
        ],
        required: true,
        lowercase : true,
        trim : true,
    }
}, { _id: false });


const carbonActivitySchema = new Schema({

    userId: {
        type: mongoose.ObjectId,
        ref: "User",
        required: true
    },

    category: {
        type: String,
        enum: [ "transportation","electricity","waste"],
        required: true,
        lowercase : true,
        trim : true,
    },

    date: {
        type: Date,
        required: true
    },

    emission: {
        type: Number,
        required: true
    },

    transportation: {
        type: transportationSchema
    },

    electricity: {
        type: electricitySchema
    },

    waste: {
        type: wasteSchema
    }

}, { timestamps: true });

module.exports = {carbonActivitySchema};