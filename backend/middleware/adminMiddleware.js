const {adminProfileSchema} = require("../devSchema");

const validateAdminProfile = (req,res,next) => {
   const {error} = adminProfileSchema.validate(req.body);
   if(error){
        const errMsg = error.details.map(el => el.message).join(",");
        res.json({success : false , message : errMsg});
   }else{
        next();
   }
};

module.exports = {validateAdminProfile};