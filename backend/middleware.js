const {loginSchema,registerSchema,verifyEmailSchema,resendOtpSchema,resentPasswordSchema} = require("./devSchema");

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

module.exports.userCheck = async(req,res,next) => {
    try{
      if (!req.cookies.token) {
        return res.json({ success: false ,  message : "your want permission"});
      }
      const token = req.cookies.token;
      const data = jwt.verify(token, process.env.token_key); 
      const user = await UserModel.findById(data.id);
      if(!user) {
         return res.json({ success: false , message : "your want permission"});
      }
      req.currUser = user._id;
    next();
  }catch(err){
     res.status(500).json({success : false , message : "internal server error"});
  }
};
