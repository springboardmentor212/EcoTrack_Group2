const {userModel} = require("../model/userModel");
const { cloudinary } = require("../cloundConfig");

module.exports.getProfile = async(req,res)=>{
  try{
    const userId = req.currUser,role = req.userRole;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to get profile"});
    }

    if(role !== "user"){
        return res.status(403).json({success : false, message : "only normal user can access profile "});
    }

    const user = await userModel.findOne({_id : userId , role : "user"});
 
    if(user){
        res.status(200).json({success : true, profile : {
                   name : user.name,
                   email : user.email,
                   role : user.role,
                   profilePhoto : user.profilePhoto,
                   sustainabilityPreferences : user.sustainabilityPreferences,
                   environmentalInterests : user.environmentalInterests,
                   personalGoalPreferences : user.personalGoalPreferences,
                   location : user.location
                }});
    } else {
        res.status(404).json({success : false, message : "Profile not found"});
    }
   }catch(err){
        res.status(500).json({success : false, message : "Internal server error"});
   }
};

module.exports.updateProfile = async(req,res)=>{
  try{
        const userId = req.currUser,role = req.userRole,isBlocked = req.isBlocked;
        if(!userId){
            return res.status(400).json({success : false, message : "login first to update profile"});
        }

        if(role !== "user"){
          return res.status(403).json({success : false, message : "only normal user can update profile"});
        }

        if(isBlocked){
          return res.status(403).json({success : false, message : "block user can't update profile"});
        }

        const {name,sustainabilityPreferences, environmentalInterests, personalGoalPreferences,location} = req.body;
        const user = {name,sustainabilityPreferences, environmentalInterests, personalGoalPreferences,location};
        const existingUser = await userModel.findOne({_id : userId , role : "user"});

        if(!existingUser){
           return res.status(404).json({success: false,message: "Profile not found"});
        }
          
        if(typeof req.file !== "undefined"){
            user.profilePhoto = req.file.path;
            user.profilePhotoPublicId = req.file.filename;
        }

        const updateprofile = await userModel.findByIdAndUpdate(
               userId,
               {
                 $set : user
                },
                {
                   returnDocument: 'after',
                   runValidators: true     
                });
        
        if(req.file && existingUser.profilePhotoPublicId && 
            existingUser.profilePhotoPublicId !== user.profilePhotoPublicId) {
            try {
               await cloudinary.uploader.destroy(existingUser.profilePhotoPublicId);
            } catch (error) {
               console.error("Old photo deletion failed:", error);
            }
        }
        
        if(updateprofile){
            res.status(200).json({success : true, message : "Profile updated successfully"});
        }else{
            res.status(404).json({success : false, message : "Profile not updated"});
        }
   }catch(err){
         res.status(500).json({success : false, message : "Internal server error"});
   }
};