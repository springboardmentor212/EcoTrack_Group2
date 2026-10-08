const bcrypt = require("bcrypt");
const {secreatToken} = require("../utills/secreatToken");
const {userModel} = require('../model/userModel');

module.exports.adminLogin = async (req,res) => {
     const {email,password} = req.body;
  
     if(!email || !password){
          return res.status(400).json({success : false, message : "Email and password are required"});
     }
  
     const user = await userModel.findOne({email , role : "admin"});
     if(!user){
          return res.status(400).json({success : false, message : "please Enter admin registered email"});
     }
     
     const isMatch = await bcrypt.compare(password,user.password);
     if(!isMatch){
          return res.status(400).json({success : false, message : "Email or password is wrong"}); 
     }

     const token = secreatToken(user._id,email);
        res.cookie("token",token,{
            httpOnly: false,
            secure: true,                 
            sameSite: "none",             
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({success : true, message : "Log in successfully as Admin"});
};

module.exports.getAdminProfile = async (req,res) => {
    const userId = req.currUser,role = req.userRole;
    if(!userId){
        return res.status(400).json({success : false, message : "login first as admin to get profile"});
    }
    
    if(role !== "admin"){
        return res.status(403).json({success : false, message : "only admin user can access profile "});
    }
    
    const user = await userModel.findOne({_id : userId , role : "admin"});
    
    if(!user){
        res.status(404).json({success : false, message : "Admin Profile not found"});
    }
    res.status(200).json({success : true , profile : {
                name : user.name,
                email : user.email,
                role : user.role,
                profilePhoto : user.profilePhoto,
                location : user.location
    }});  
};

module.exports.updateAdminProfile = async (req,res) => {
    const userId = req.currUser,role = req.userRole;
    if(!userId){
        return res.status(400).json({success : false, message : "login first as admin to update admin profile"});
    }

    if(role !== "admin"){
        return res.status(403).json({success : false, message : "only admin user can update admin profile"});
    }

    const {name,location} = req.body;
    const user = {name,location};

     if(typeof req.file !== "undefined"){
        const profilePhoto = req.file.path;
        user.profilePhoto = profilePhoto;
     }
    const updateprofile = await userModel.findByIdAndUpdate(
            userId,
            {
                    $set : user
            },
            {
                    new : true,
                    runValidators: true     
            });
        
    if(updateprofile){
            res.status(200).json({success : true, message : "Admin Profile updated successfully"});
    }else{
            res.status(404).json({success : false, message : "Admin Profile not updated"});
    }
};

module.exports.users = async (req,res) => {
  
};

module.exports.block = async (req,res) => {

};

module.exports.unBlock = async (req,res) => {

};

module.exports.reports = async (req,res) => {

};