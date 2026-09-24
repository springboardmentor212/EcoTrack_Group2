const joi = require("joi");

module.exports.loginSchema = joi.object({
      email : joi.string().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
      password : joi.string().required().min(8).pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/),
}).required(); 

module.exports.registerSchema = joi.object({
    name : joi.string().required().min(3).pattern(/^(?=.{3,}$)[A-Za-z]+(?: [A-Za-z]+)?$/),
    email : joi.string().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
    password : joi.string().required().min(8).pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/),
    location : joi.string().required().min(3),
}).required();

module.exports.verifyEmailSchema = joi.object({
    email : joi.string().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
    code : joi.number().integer().min(100000).max(999999).required(),
}).required();

module.exports.resendOtpSchema = joi.object({
    email : joi.string().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
}).required();

module.exports.resentPasswordSchema = joi.object({
    email : joi.string().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
    password : joi.string().required().min(8).pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/),
    confirmPassword : joi.string().required().min(8).pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/),
}).required();

module.exports.profileSchema = joi.object({
     name : joi.string().required().min(3).pattern(/^(?=.{3,}$)[A-Za-z]+(?: [A-Za-z]+)?$/),
     email : joi.string().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
     profilePhoto: joi.string().allow("",null),
     sustainabilityPreferences : joi.array().items(
      joi.string().valid(
         "small daily changes",
         "weekly challenges",
         "reduce emissions",
         "reduce wastes",
         "sustainable waste disposal",
         "sustainable travel",
         "sustainable efficient electricity",
         "carbon footprints"
      )).unique().max(8).required(),

     environmentalInterests : joi.array().items(
        joi.string().valid(
             "transportation",
             "electricity",
             "waste management",
             "build sustainable habits"
      )).unique().max(4).required(),

     personalGoalPreferences :  joi.array().items(
        joi.string().valid(
               "short term goals",
               "long term goals",
               "measurable progress",
               "habit-based goals",
               "emission reduction goals",
               "resource-saving goals"
      )).unique().max(6).required(),
     location : joi.string().required().min(3),
}).required();

module.exports.transportationSchema = joi.object({
     category: joi.string().valid("transportation").required(),
     date: joi.date().max("now").required(),
     transportation: joi.object({
          transportMode : joi.string().valid("2 wheeler","4 wheeler","auto rickshaw","bus","train").required(),
          distance : joi.number().min(0).required(),
          fuelType : joi.string().valid("petrol","diesel","cng","electric").required(),
          from : joi.string().required().min(3),
          to : joi.string().required().min(3),
     }).required(),
}).required();

module.exports.updateTransportationSchema = joi.object({
     id : joi.string().required(),
     category: joi.string().valid("transportation").required(),
     date: joi.date().max("now").required(),
     transportation: joi.object({
          transportMode : joi.string().valid("2 wheeler","4 wheeler","auto rickshaw","bus","train").required(),
          distance : joi.number().min(0).required(),
          fuelType : joi.string().valid("petrol","diesel","cng","electric").required(),
          from : joi.string().required().min(3),
          to : joi.string().required().min(3),
     }).required(),
}).required();

module.exports.electricitySchema = joi.object({
     category: joi.string().valid("electricity").required(),
     electricity: joi.object({
          month : joi.string().valid("jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec").required(),
          year : joi.number().min(2000).max(new Date().getFullYear()),
          consumption : joi.number().min(0).required(),
          usageType : joi.string().valid("home","business").required()
     }).required(),
}).required();

module.exports.updateElectricitySchema = joi.object({
     id : joi.string().required(),
     category: joi.string().valid("electricity").required(),
     electricity: joi.object({
          month : joi.string().valid("jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec").required(),
          year : joi.number().min(2000).max(new Date().getFullYear()),
          consumption : joi.number().min(0).required(),
          usageType : joi.string().valid("home","business").required()
     }).required(),
}).required();

module.exports.wasteSchema = joi.object({
     category: joi.string().valid("waste").required(),
     date: joi.date().max("now").required(),
     waste : joi.object({
          wasteType : joi.string().valid(
             "wet waste",
             "dry waste",
             "e waste",).required(),
          wasteAmount : joi.number().min(0).required(),
          disposalMethod : joi.string().valid(
            "recycled",
            "burned",
            "landfill",
            "composting").required()
            
     }).required(),
}).required();

module.exports.updateWasteSchema = joi.object({
     id : joi.string().required(),
     category: joi.string().valid("waste").required(),
     date: joi.date().max("now").required(),
     waste : joi.object({
          wasteType : joi.string().valid(
             "wet waste",
             "dry waste",
             "e waste",).required(),
          wasteAmount : joi.number().min(0).required(),
          disposalMethod : joi.string().valid(
            "recycled",
            "burned",
            "landfill",
            "composting").required()
            
     }).required(),
}).required();

module.exports.transportationGoalSchema = joi.object({
     category : joi.string().valid("transportation").required(),
     goalType : joi.string().valid(
                "reduce travelling distance",
                "keep travelling distance within limit",
                "use only electric vehicle",
                "use only cng vehicle",
      ).required(),
     target : joi.number().min(0).required(),
     unit : joi.string().valid("km","%","trips").required(),
     period : joi.string().valid("daily","weekly","monthly").required(),
     endDate : joi.date().min("now").required(),
}).required();

module.exports.updateTransportationGoalSchema = joi.object({
     id : joi.string().required(),
     goalType : joi.string().valid(
                "reduce travelling distance",
                "keep travelling distance within limit",
                "use only electric vehicle",
                "use only cng vehicle",
      ).required(),
     target : joi.number().min(0).required(),
     unit : joi.string().valid("km","%","trips").required(),
     period : joi.string().valid("daily","weekly","monthly").required(),
     startDate : joi.date().required(),
     endDate : joi.date().min("now").required(),
}).required();

module.exports.electricityGoalSchema = joi.object({
     category : joi.string().valid("electricity").required(),
     goalType : joi.string().valid(
                "reduce electricity consumption",
                "keep electricity consumption within limit"
      ).required(),
     target : joi.number().min(0).required(),
     unit : joi.string().valid("kwh","%",).required(),
     period : joi.string().valid("monthly").required(),
     endDate : joi.date().min("now").required(),
}).required();

module.exports.updateElectricityGoalSchema = joi.object({
     id : joi.string().required(),
     category : joi.string().valid("electricity").required(),
     goalType : joi.string().valid(
                "reduce electricity consumption",
                "keep electricity consumption within limit"
      ).required(),
     target : joi.number().min(0).required(),
     unit : joi.string().valid("kwh","%",).required(),
     period : joi.string().valid("monthly").required(),
     startDate : joi.date().required(),
     endDate : joi.date().min("now").required(),
}).required();

module.exports.wasteGoalSchema = joi.object({
     category : joi.string().valid("waste_management").required(),
     goalType : joi.string().valid(
                "reduce waste generated",
                "keep waste generation within limit"
      ).required(),
     target : joi.number().min(0).required(),
     unit : joi.string().valid("kg","%",).required(),
     period : joi.string().valid("daily","weekly","monthly").required(),
     endDate : joi.date().min("now").required(),
}).required();

module.exports.updateWasteGoalSchema = joi.object({
     id : joi.string().required(),
     category : joi.string().valid("waste_management").required(),
     goalType : joi.string().valid(
                "reduce waste generated",
                "keep waste generation within limit"
      ).required(),
     target : joi.number().min(0).required(),
     unit : joi.string().valid("kg","%",).required(),
     period : joi.string().valid("daily","weekly","monthly").required(),
     startDate : joi.date().required(),
     endDate : joi.date().min("now").required(),
}).required();

module.exports.carbonEmissionGoalSchema = joi.object({
     category : joi.string().valid("carbon_emission").required(),
     goalType : joi.string().valid(
                "reduce carbon emissions",
                "keep carbon emissions within limit"
      ).required(),
     trackingType : joi.string().valid(
                  "all","transportation","electricity","waste management"
     ).required(),
     target : joi.number().min(0).required(),
     unit : joi.string().valid("kgco2","%",).required(),
     period : joi.string().valid("daily","weekly","monthly").required(),
     endDate : joi.date().min("now").required(),
}).required();

module.exports.updateCarbonEmissionGoalSchema = joi.object({
     id : joi.string().required(),
     category : joi.string().valid("carbon_emission").required(),
     goalType : joi.string().valid(
                "reduce carbon emissions",
                "keep carbon emissions within limit"
      ).required(),
     trackingType : joi.string().valid(
                  "all","transportation","electricity","waste management"
     ).required(),
     target : joi.number().min(0).required(),
     unit : joi.string().valid("kgco2","%",).required(),
     period : joi.string().valid("daily","weekly","monthly").required(),
     startDate : joi.date().required(),
     endDate : joi.date().min("now").required(),
}).required();

module.exports.carbonSaveGoalSchema = joi.object({
     category : joi.string().valid("carbon_save").required(),
     goalType : joi.string().valid(
                "increase carbon saved"
      ).required(),
     target : joi.number().min(0).required(),
     unit : joi.string().valid("kgco2").required(),
     period : joi.string().valid("daily","weekly","monthly").required(),
     endDate : joi.date().min("now").required(),
}).required();

module.exports.updateCarbonSaveGoalSchema = joi.object({
     id : joi.string().required(),
     category : joi.string().valid("carbon_save").required(),
     goalType : joi.string().valid(
                "increase carbon saved"
      ).required(),
     target : joi.number().min(0).required(),
     unit : joi.string().valid("kgco2").required(),
     period : joi.string().valid("daily","weekly","monthly").required(),
     startDate : joi.date().required(),
     endDate : joi.date().min("now").required(),
}).required();