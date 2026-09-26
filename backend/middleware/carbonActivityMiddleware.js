const {transportationSchema,electricitySchema,wasteSchema} = require("../devSchema");

module.exports.validateTransportation = ((req,res,next) => {
  const {error} = transportationSchema.validate(req.body);
  if(error){
     const errMsg = error.details.map(el=>el.message).join(",");
     res.json({success : false ,message : errMsg});
  }else{
     next();
  }
});

module.exports.validateElectricity = ((req,res,next)=>{
   const {error} = electricitySchema.validate(req.body);
   if(error){
      const errMsg = error.details.map(el=>el.message).join(",");
      res.json({success : false , message : errMsg});
   }else{
      next();
   }
});

module.exports.validateWaste = ((req,res,next)=>{
   const {error} = wasteSchema.validate(req.body);
   if(error){
      const errMsg = error.details.map(el=>el.message).join(",");
      res.json({success : false , message : errMsg});
   }else{
      next();
   }
});