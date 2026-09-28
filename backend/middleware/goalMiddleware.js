const {transportationGoalSchema,electricityGoalSchema,wasteGoalSchema,carbonEmissionGoalSchema,carbonSaveGoalSchema,
     updateTransportationGoalSchema,updateElectricityGoalSchema,updateWasteGoalSchema,updateCarbonEmissionGoalSchema,updateCarbonSaveGoalSchema
} = require("../devSchema");

const validateTransportationGoal = (req,res,next)=>{
   const {error} = transportationGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

const validateElectricityGoal = (req,res,next)=>{
   const {error} = electricityGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

const validateWasteGoal = (req,res,next)=>{
   const {error} = wasteGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

const validateCarbonEmissionGoal = (req,res,next)=>{
   const {error} = carbonEmissionGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};


const validateCarbonSaveGoal = (req,res,next)=>{
   const {error} = carbonSaveGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

const validateUpdateTransportationGoal = (req,res,next)=>{
   const {error} = updateTransportationGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

const validateUpdateElectricityGoal = (req,res,next)=>{
   const {error} = updateElectricityGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

const validateUpdateWasteGoal = (req,res,next)=>{
   const {error} = updateWasteGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

const validateUpdateCarbonEmissionGoal = (req,res,next)=>{
   const {error} = updateCarbonEmissionGoalSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

const validateUpdateCarbonSaveGoal = (req,res,next)=>{
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
               validateTransportationGoal(req,res,next);
          }else if(req.body.category === "electricity"){
               validateElectricityGoal(req,res,next);
          }else if(req.body.category === "waste management"){
               validateWasteGoal(req,res,next);
          }else if(req.body.category === "carbon emission"){
               validateCarbonEmissionGoal(req,res,next);
          }else if(req.body.category === "carbon save"){
               validateCarbonSaveGoal(req,res,next);
          }else{
               res.status(400).json({success : false, message : "not a valid category"});
          }
     }catch(error){
          res.status(400).json({success : false, message : "not validate data"});
     }
};

module.exports.validateUpdateGoal = (req,res,next)=>{
     try{
          if(req.body.category === "transportation"){
               validateUpdateTransportationGoal(req,res,next);
          }else if(req.body.category === "electricity"){
               validateUpdateElectricityGoal(req,res,next);
          }else if(req.body.category === "waste management"){
               validateUpdateWasteGoal(req,res,next);
          }else if(req.body.category === "carbon emission"){
               validateUpdateCarbonEmissionGoal(req,res,next);
          }else if(req.body.category === "carbon save"){
               validateUpdateCarbonSaveGoal(req,res,next);
          }else{
               res.status(400).json({success : false, message : "not a valid category"});
          }
     }catch(error){
          res.status(400).json({success : false, message : "not validate data"});
     }
};