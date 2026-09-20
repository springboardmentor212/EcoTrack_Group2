const bcrypt = require("bcrypt");
const {secreatToken} = require("../utills/secreatToken");
const {userModel} = require("../model/userModel");
const {verificationCodeModel } =  require("../model/verificationCodeModel");
const {generateOtp} = require("../utills/generateOtp"); 
const sendVerificationMail = require("../utills/sendVerificationMail");

module.exports.register = async(req,res) => {
  try{
    const {name,password,email,location} = req.body;

    if(!name || !password || !email || !location){
        return res.status(400).json({success : false , message : "all field are required"});
    }

    const existUser = await userModel.findOne({email});
    if(existUser){
        return res.status(400).json({success : false , message : "your is already existing please login"});
    }

    const user = new userModel({name,email,password,location,verified : false,role : "user"});
    await user.save();

    await verificationCodeModel.deleteMany({email});
    let otp = generateOtp();
    sendVerificationMail(user.email,otp);
   
    const verificationCode = new verificationCodeModel({email : user.email,code : otp});
    await verificationCode.save();
    return res.status(200).json({success : true , message : "user register successfully please Enter OTP send on your email to verify"});
 }catch(err){
     return res.status(500).json({success : false , message : "internal server error"});
 }
};

module.exports.login = async(req,res) => {
  try{
   const {email,password} = req.body;

   if(!email || !password){
        return res.status(400).json({success : "false", message : "Email and password are required"});
   }

   const user = await userModel.findOne({email});
   if(!user){
        return res.status(400).json({success : "false", message : "please Enter your registered email"});
   }
   const isMatch = await bcrypt.compare(password,user.password);
   if(!isMatch){
        return res.status(400).json({success : "false", message : "Email or password is wrong"}); 
   }

   if(user.verified){
        const token = secreatToken(user._id,email);
        res.cookie("token",token,{
            httpOnly: false,
            secure: true,                 
            sameSite: "none",             
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({success : "true", message : "Log in successfully"});
   }else{
        await verificationCodeModel.deleteMany({email});
        let otp = generateOtp();
        sendVerificationMail(user.email,otp);
        
       await verificationCodeModel.deleteMany({email});
       const verificationCode = new verificationCodeModel({email : user.email,code : otp});
       await verificationCode.save();
       return res.status(200).json({success : "unverifed" , message : "please Enter OTP send on your email to verify"});
   }
 }catch(err){
        return res.status(500).json({success : false , message : "internal server error"});
 }
};

module.exports.verifyEmail = async(req,res) => { 
  try{
    const {email,code} = req.body;
    const verificationCode = await verificationCodeModel.findOne({email});

     if (!verificationCode) {
            return res.status(400).json({
                success: false,
                message: "Verification code not found or expired"
            });
        }

    const isMatch = await bcrypt.compare(code,verificationCode.code);
    
    if(!isMatch){
        return res.status(400).json({success : false , message : "please Enter valid code"});
    }

    if(verificationCode.expries.getTime() > Date.now()){
        await verificationCodeModel.deleteMany({email});
        const user = await userModel.findOne({email});
        const token = secreatToken(user._id,email);
        res.cookie("token",token,{
            httpOnly: false,
            secure: true,                 
            sameSite: "none",             
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        await userModel.findByIdAndUpdate(user._id,{verified : true});
        return res.status(200).json({success : true, message : "Email verifiy successfully"});
    }else{
        await verificationCodeModel.deleteMany({email});
        return res.status(400).json({success : false, message : "Verification code is Expried"});
    } 
  }catch(error){
    return res.status(500).json({success : false , message : "internal server error"}); 
  }
};

module.exports.verifyEmailForResetPassword = async(req,res) => { 
  try{
    const {email,code} = req.body;
    const verificationCode = await verificationCodeModel.findOne({email});

     if (!verificationCode) {
            return res.status(400).json({
                success: false,
                message: "Verification code not found or expired"
            });
        }

    const isMatch = await bcrypt.compare(code,verificationCode.code);
    
    if(!isMatch){
        return res.status(400).json({success : false , message : "please Enter valid code"});
    }

    if(verificationCode.expries.getTime() > Date.now()){
        await verificationCodeModel.deleteMany({email});
        const user = await userModel.findOne({email});
        await userModel.findByIdAndUpdate(user._id,{verified : true});
        return res.status(200).json({success : true, message : "Email verifiy successfully"});
    }else{
        await verificationCodeModel.deleteMany({email});
        return res.status(400).json({success : false, message : "Verification code is Expried"});
    } 
  }catch(error){
    return res.status(500).json({success : false , message : "internal server error"}); 
  }
};

module.exports.resendOtp = async(req,res) => {
  try{
    const {email} = req.body;
    const existUser = await userModel.findOne({email});

    if(!existUser){
        return res.status(400).json({success : false,message : "please Enter your registered email"});
    }

    await verificationCodeModel.deleteMany({email});
    let otp = generateOtp();
    sendVerificationMail(existUser.email,otp);
    const verificationCode = new verificationCodeModel({email : existUser.email,code : otp});
    await verificationCode.save();
    return res.status(200).json({success : true , message : "OTP send on your email please verify your email and OTP send after 30 second so please wait"});
   }catch(err){
        return res.status(500).json({success : false , message : "internal server error"});
   }
};

module.exports.logOut = async(req,res)=>{
    try{
     if(!req.cookies.token){
        return res.status(400).json({success : false , message : "All ready you are log out"});
     }

     res.clearCookie('token');
     return res.status(200).json({success : true, message : "logout successfully"});
    }catch(err){
        return res.status(500).json({success : false , message : "some error "});
    }
};

module.exports.resetPassword = async(req,res)=>{
  try{
    const {email,password,confirmPassword} = req.body;
    if(!email || !password || !confirmPassword){
        return res.status(400).json({success : false,message : "all field are required"});
    }

    if(password !== confirmPassword){
        return res.status(400).json({success : false,message : "password and confirm password is not same"});
    }

    const user = await userModel.findOneAndUpdate({email},{password});
    return res.status(200).json({success : true,message : "password reset successfully"});
 }catch(err){
    return res.status(500).json({success : false , message : "internal server error"});
 }
};

module.exports.deleteAccount = async(req,res)=>{
   const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }

    await userModel.findOneAndDelete({_id : userId});
    return res.status(200).json({success : true, message : "user account delete successfully"});
};
