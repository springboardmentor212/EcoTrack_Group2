const bcrypt = require("bcrypt");
const {secreatToken} = require("../utills/secreatToken");
const {userModel} = require('../model/userModel');
const {getUser} = require("../service/report/user");
const {completeChallengeReport,challengeReport,challengeCount} = require("../service/report/challenge");
const {challengeModel} = require("../model/challengeModel");

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
        return res.status(400).json({success : false, message : "only admin user can access profile "});
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
                    returnDocument: 'after' ,
                    runValidators: true     
            });
        
    if(updateprofile){
            res.status(200).json({success : true, message : "Admin Profile updated successfully"});
    }else{
            res.status(404).json({success : false, message : "Admin Profile not updated"});
    }
};

module.exports.adminDashboard = async (req,res) => {
   const userId = req.currUser,role = req.userRole;
    if(!userId){
        return res.status(400).json({success : false, message : "login first as admin to get dashboard data"});
    }

    if(role !== "admin"){
        return res.status(400).json({success : false, message : "only admin user can get admin dashboard data"});
    }

    const user = await getUser();
    const challengeStatus =await challengeCount();

    if(!user || !challengeStatus){
        return res.status(400).json({success : false, message : "doesn't get the admin dashboard data"});
    }

    const dashboardData = {
       totalUser : user.totalUsers,
       activeUser : user.activeUsers,
       blockedUser : user.blockedUsers,
       activeChallenge : challengeStatus.active,
       completedChallenge : challengeStatus.completed,
    };

    return res.status(200).json({success : true , message : "dashboard data get successfully",dashboardData});
};

module.exports.users = async (req,res) => {
   const userId = req.currUser,role = req.userRole;
    if(!userId){
        return res.status(400).json({success : false, message : "login first as admin to get all users data"});
    }

    if(role !== "admin"){
        return res.status(400).json({success : false, message : "only admin user can get all user data"});
    }

    const users = await userModel.find({role : "user"}).select("_id name email location profilePhoto isBlocked");
    if(!users){
        res.status(400).json({success : false , message : "don't have users data"});
    }

    res.status(200).json({success : true, users});
};

module.exports.block = async (req,res) => {
   const userId = req.currUser,role = req.userRole;
    if(!userId){
        return res.status(400).json({success : false, message : "login first as admin to block user"});
    }

    if(role !== "admin"){
        return res.status(400).json({success : false, message : "only admin user can block any user"});
    }

    const {id} = req.params;
    if(!id){
        return res.status(400).json({success : false ,message : "please select first any user to block it"});
    }

    const user = await userModel.findOneAndUpdate({_id : id , role : "user"},{isBlocked : true});
    if(!user){
        return res.status(400).json({success : false , message : "doesn't find user to block"});
    }

    return res.status(200).json({success : true, message : "user blocked succuesfully"});
};

module.exports.unBlock = async (req,res) => {
  const userId = req.currUser,role = req.userRole;
    if(!userId){
        return res.status(400).json({success : false, message : "login first as admin to unblock user"});
    }

    if(role !== "admin"){
        return res.status(400).json({success : false, message : "only admin user can unblock any user"});
    }

    const {id} = req.params;
    if(!id){
        return res.status(400).json({success : false ,message : "please select first any user to unblock it"});
    }

    const user = await userModel.findOneAndUpdate({_id : id , role : "user"},{isBlocked : false});
    if(!user){
        return res.status(400).json({success : false , message : "don't find user to unblock"});
    }

    return res.status(200).json({success : true, message : "user unblocked succuesfully"});
};

module.exports.userReport = async (req,res) => {
    const userId = req.currUser,role = req.userRole;
    if(!userId){
        return res.status(400).json({success : false, message : "login first as admin to get user data"});
    }

    if(role !== "admin"){
        return res.status(400).json({success : false , message : "only admin user get the user report data"});
    }

    const userData = await getUser();
    
    if(!userData){
        return res.status(400).json({success : false , message : "doesn't get the user report data"});
    }

    return res.status(200).json({success : true, message : "user report data get successfully" ,userData});
}

module.exports.completeChallengesReport = async (req,res) => {
   const userId = req.currUser,role = req.userRole;
    if(!userId){
        return res.status(400).json({success : false, message : "login first as admin to get challeges data"});
    }

    if(role !== "admin"){
        return res.status(400).json({success : false , message : "only admin user get the challeges report data"});
    }

    const challenges = await completeChallengeReport();
    if(!challenges || challenges.length === 0){
        return res.status(400).json({success : false , message : "No completed challenges found for the current month."});
    }
   
    return res.status(200).json({success : true, message : "completed challenges get successfully",challenges});
};

module.exports.challengeReport = async (req,res) => {
   const userId = req.currUser,role = req.userRole;
    if(!userId){
        return res.status(400).json({success : false, message : "login first as admin to get challege data"});
    }

    if(role !== "admin"){
        return res.status(400).json({success : false , message : "only admin user get the specife challege report data"});
    }

    const {id} = req.params;
    if(!id){
        return res.status(400).json({success : false ,message : "please choose any challenge to get his report"});
    }

    const challenge = await challengeModel.findById(id);
    if(!challenge || challenge.status !== "closed"){
        return res.status(400).json({success : false, message : "challege is not fine or not closed so you can't get those data"});
    }

    const challengeData = await challengeReport(id);
    if(!challengeData){
        return res.status(400).json({success : false, message : "challege data not find"});
    }

    return res.status(200).json({ success : true , message : "challege data get successfully",challengeData});
};