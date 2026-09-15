const joi = require("joi");

module.exports.loginSchema = joi.object({
      email : joi.string().lowercase().trim().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
      password : joi.string().required().min(8).pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/),
}).required(); 

module.exports.registerSchema = joi.object({
    name : joi.string().lowercase().trim().required().min(3).pattern(/^(?=.{3,}$)[A-Za-z]+(?: [A-Za-z]+)?$/),
    email : joi.string().lowercase().trim().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
    password : joi.string().required().min(8).pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/),
    location : joi.string().lowercase().trim().required().min(3),
}).required();

module.exports.verifyEmailSchema = joi.object({
    email : joi.string().lowercase().trim().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
    code : joi.number().integer().min(100000).max(999999).required(),
}).required();

module.exports.resendOtpSchema = joi.object({
    email : joi.string().lowercase().trim().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
}).required();

module.exports.resentPasswordSchema = joi.object({
    email : joi.string().lowercase().trim().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
    password : joi.string().required().min(8).pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/),
    confirmPassword : joi.string().required().min(8).pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/),
}).required();

module.exports.profileSchema = joi.object({
     name : joi.string().lowercase().trim().required().min(3).pattern(/^(?=.{3,}$)[A-Za-z]+(?: [A-Za-z]+)?$/),
     email : joi.string().lowercase().trim().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
     profilePhoto: joi.string().allow("",null),
     sustainabilityPreferences : joi.array().items(
      joi.string().lowercase().trim().valid(
          "renewable energy",
          "recycling",
          "waste reduction",
          "sustainable living",
          "green transportation"
      )).unique().max(5).required(),

     environmentalInterests : joi.array().items(
        joi.string().lowercase().trim().valid(
             "renewable energy",
             "recycling",
             "waste reduction"
      )).unique().max(3).required(),

     personalGoalPreferences :  joi.array().items(
        joi.string().lowercase().trim().valid(
             "reduce carbon",
             "reduce electricity",
             "increase recycling",
             "reduce plastic",
             "use public transport",
             "plant trees"
      )).unique().max(6).required(),
     location : joi.string().required().min(3),
}).required();

module.exports.transportationSchema = joi.object({
     id : joi.string(),
     category: joi.string().lowercase().trim().valid("transportation").required(),
     date: joi.date().max("now").required(),
     transportation: joi.object({
          transportMode : joi.string().lowercase().trim().valid("car","bike","public transport").required(),
          distance : joi.number().min(0).required(),
          tripPurpose : joi.string(),
          fuelType : joi.string().lowercase().trim().valid("petrol","diesel","cng","electric").required()
     }).required(),
}).required();

module.exports.electricitySchema = joi.object({
      id : joi.string(),
     category: joi.string().lowercase().trim().valid("electricity").required(),
     date: joi.date().max("now").required(),
     electricity: joi.object({
          usagePeriod : joi.string().lowercase().trim().valid("day").required(),
          consumption : joi.number().min(0).required(),
          usageType : joi.string().lowercase().trim().valid("home","business").required()
     }).required(),
}).required();

module.exports.wasteSchema = joi.object({
     id : joi.string(),
     category: joi.string().lowercase().trim().valid("waste").required(),
     date: joi.date().max("now").required(),
     waste : joi.object({
          wasteType : joi.string().lowercase().trim().valid("organic",
             "plastic",
             "paper",
             "glass",
             "metal",
             "e_waste",
             "other").required(),
          wasteAmount : joi.number().min(0).required(),
          unit : joi.string().lowercase().trim().valid("kg"),
          disposalMethod : joi.string().lowercase().trim().valid( "recycling",
            "composting",
            "reuser",
            "landfill",
            "incineration",
            "other").required()
     }).required(),
}).required();