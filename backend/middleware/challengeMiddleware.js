const {transportationChallengeSchema,electricityChallengeSchema,wasteChallengeSchema,
       carbonEmissionChallengeSchema,carbonSaveChallengeSchema,

       updateTransportationChallengeSchema,updateElectricityChallengeSchema,
       updateWasteChallengeSchema,updateCarbonEmissionChallengeSchema,
       updateCarbonSaveChallengeSchema       
} = require("../devSchema");

module.exports.validateChallenge = (req,res,next) => {
    let err;
    if(req.body.category === "transportation"){
       const {error} = transportationChallengeSchema.validate(req.body);
       err = error;
    }else if(req.body.category === "electricity"){
       const {error} = electricityChallengeSchema.validate(req.body);
       err = error;
    }else if(req.body.category === "waste management"){
       const {error} = wasteChallengeSchema.validate(req.body);
       err = error;
    }else if(req.body.category === "carbon emission"){
       const {error} = carbonEmissionChallengeSchema.validate(req.body);
       err = error;
    }else if(req.body.category === "carbon save"){
       const {error} = carbonSaveChallengeSchema.validate(req.body);
       err = error;
    }else{
       res.status(400).json({success : false, message : "not a valid category"});
    } 

    if(err){
        const errMsg = err.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
    }else{
        next();
    }
};

module.exports.validateUpdateChallenge = (req,res,next) => {
    let err;
    if(req.body.category === "transportation"){
       const {error} = updateTransportationChallengeSchema.validate(req.body);
       err = error;
    }else if(req.body.category === "electricity"){
       const {error} = updateElectricityChallengeSchema.validate(req.body);
       err = error;
    }else if(req.body.category === "waste management"){
       const {error} = updateWasteChallengeSchema.validate(req.body);
       err = error;
    }else if(req.body.category === "carbon emission"){
       const {error} = updateCarbonEmissionChallengeSchema.validate(req.body);
       err = error;
    }else if(req.body.category === "carbon save"){
       const {error} = updateCarbonSaveChallengeSchema.validate(req.body);
       err = error;
    }else{
       res.status(400).json({success : false, message : "not a valid category"});
    } 

    if(err){
        const errMsg = err.details.map(el=>el.message).join(",");
        return res.json({success : false , message : errMsg});
    }else{
        next();
    }
};