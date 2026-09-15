const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const transportationSchema = new Schema({
    transportMode: {
        type: String,
        enum : ["car","bike","public transport"],
        required: true
    },

    distance: {
        type: Number,
        required: true
    },

    tripPurpose: {
        type: String,
        minLength : "3",
    },

    fuelType: {
        type: String,
        enum : ["petrol","diesel","cng","electric"],
        required: true
    }
}, { _id: false });


const electricitySchema = new Schema({
    usagePeriod: {
        type: String,
        enum : ["day"],
        required: true
    },

    consumption: {
        type: Number,
        required: true
    },

    usageType: {
        type: String,
        enum: ["home","business"],
        required: true
    }
}, { _id: false });


const wasteSchema = new Schema({
    wasteType: {
        type: String,
        enum: [
             "organic",
             "plastic",
             "paper",
             "glass",
             "metal",
             "e_waste",
             "other"
        ],
        required: true
    },

    wasteAmount: {
        type: Number,
        required: true
    },

    unit: {
        type: String,
        enum: ["kg"],
        required: true
    },

    disposalMethod: {
        type: String,
        enum: [
            "recycling",
            "composting",
            "reuser",
            "landfill",
            "incineration",
            "other"
        ],
        required: true
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
        required: true
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