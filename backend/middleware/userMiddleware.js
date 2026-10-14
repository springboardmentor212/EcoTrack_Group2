const jwt = require("jsonwebtoken");
const {userModel} = require("../model/userModel");
const {loginSchema,registerSchema,verifyEmailSchema,resendOtpSchema,resentPasswordSchema,
      notificationSettingSchema,deleteAccountSchema} = require("../devSchema");

module.exports.validateLogin = ((req,res,next) => {
   const {error} = loginSchema.validate(req.body);
   if(error){
        let errMsg = error.details.map(el => el.message).join(",");
        res.json({success : false,message : errMsg});
    }else{
        next();
    }
});

module.exports.validateRegister = ((req,res,next)=>{
   const {error} = registerSchema.validate(req.body);
   if(error){
        let errMsg = error.details.map(el => el.message).join(",");
        res.json({success : false, message : errMsg});
   }else{
        next();
   }
});

module.exports.validateVerifyEmail = ((req,res,next) => {
    const {error} = verifyEmailSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(",");
        res.json({success : false,message : errMsg});
    }else{
        next();
    }
});

module.exports.validateResendOtp = ((req,res,next) => {
   const {error} = resendOtpSchema.validate(req.body);
   if(error){
        let errMsg = error.details.map(el => el.message).join(",");
        res.json({success : false , message : errMsg});
   }else{
        next();
   }
});

module.exports.validateResetPassword = ((req,res,next)=>{
   const {error} = resentPasswordSchema.validate(req.body);
   if(error){
       let errMsg = error.details.map(el => el.message).join(",");
       res.json({success : false , message : errMsg});
   }else{
      next();
   }
});

module.exports.validateNotificationSetting = ((req,res,next)=>{
   const {error} = notificationSettingSchema.validate(req.body);
   if(error){
       let errMsg = error.details.map(el => el.message).join(",");
       res.json({success : false , message : errMsg});
   }else{
      next();
   }
});

module.exports.validateDeleteAccount = ((req,res,next)=>{
   const {error} = deleteAccountSchema.validate(req.body);
   if(error){
       let errMsg = error.details.map(el => el.message).join(",");
       res.json({success : false , message : errMsg});
   }else{
      next();
   }
});

module.exports.userCheck = async(req,res,next) => {
 try{
      if(!req.cookies.token) {
        return res.status(200).json({ success: false ,  message : "please login first"});
      }
      const token = req.cookies.token;
      const data = jwt.verify(token, process.env.token_key); 
      const user = await userModel.findById(data.id);
      if(!user) {
         return res.status(200).json({ success: false , message : "please login first"});
      }
      req.currUser = user._id;
      req.userRole = user.role;
      req.isBlocked = user.isBlocked;
    next();
  }catch(err){
     res.status(500).json({success : false , message : "internal server error"});
  }
};
