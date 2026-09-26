const {profileSchema} = require("../devSchema");

module.exports.validateProfile = ((req,res,next) => {
    const {error} = profileSchema.validate(req.body);
    if(error){
        const errMsg = error.details.map(el => el.message).join(",");
        res.json({success : false , message : errMsg});
    }else{
        next();
    }
});