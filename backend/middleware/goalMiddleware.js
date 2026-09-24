const {transportationGoalSchema,electricityGoalSchema,wasteGoalSchema,carbonEmissionGoalSchema,carbonSaveGoalSchema,
     updateTransportationGoalSchema,updateElectricityGoalSchema,updateWasteGoalSchema,updateCarbonEmissionGoalSchema,updateCarbonSaveGoalSchema
} = require("../devSchema");

module.exports.validateTransportationGoal = (req,res,next)=>{
   const {error} = transportationGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

module.exports.validateElectricityGoal = (req,res,next)=>{
   const {error} = electricityGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

module.exports.validateWasteGoal = (req,res,next)=>{
   const {error} = wasteGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

module.exports.validateCarbonEmissionGoal = (req,res,next)=>{
   const {error} = carbonEmissionGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};


module.exports.validateCarbonSaveGoal = (req,res,next)=>{
   const {error} = carbonSaveGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

module.exports.validateUpdateTransportationGoal = (req,res,next)=>{
   const {error} = updateTransportationGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

module.exports.validateUpdateElectricityGoal = (req,res,next)=>{
   const {error} = updateElectricityGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

module.exports.validateUpdateWasteGoal = (req,res,next)=>{
   const {error} = updateWasteGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

module.exports.validateUpdateCarbonEmissionGoal = (req,res,next)=>{
   const {error} = updateCarbonEmissionGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

module.exports.validateUpdateCarbonSaveGoal = (req,res,next)=>{
   const {error} = updateCarbonSaveGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

module.exports.validateGoal = (req,res,next)=>{
     try{
          if(req.body.category === "transportation"){
               validateTransportationGoal;
          }else if(req.body.category === "electricity"){
               validateElectricityGoal;
          }else if(req.body.category === "waste_management"){
               validateWasteGoal;
          }else if(req.body.category === "carbon_emission"){
               validateCarbonEmissionGoal;
          }else if(req.body.category === "carbon_save"){
               validateCarbonSaveGoal;
          }else{
               res.status(400).json({success : false, message : "not a valid category"});
          }
          next();
     }catch(error){
          res.status(400).json({success : false, message : "not validate data"});
     }
}