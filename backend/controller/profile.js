const {userModel} = require("../model/userModel");

module.exports.getProfile = async(req,res)=>{
  try{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to get profile"});
    }
    const user = await userModel.findById(userId);
 
    if(user){
        res.status(200).json({success : true, profile : {
                   name : user.name,
                   email : user.email,
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
        const userId = req.currUser;
        if(!userId){
            return res.status(400).json({success : false, message : "login first to update profile"});
        }

        const {name,profilePhoto, sustainabilityPreferences, environmentalInterests, personalGoalPreferences,location} = req.body; 
        const updateprofile = await userModel.findByIdAndUpdate(
               userId,
               {
                 $set : {
                   name,
                   profilePhoto,
                   sustainabilityPreferences,
                   environmentalInterests,
                   personalGoalPreferences,
                   location
                 }
                },
                {
                   new : true,
                   runValidators: true     
                });
        
        if(updateprofile){
            res.status(200).json({success : true, message : "Profile updated successfully"});
        }else{
            res.status(404).json({success : false, message : "Profile not updated"});
        }
   }catch(err){
         res.status(500).json({success : false, message : "Internal server error"});
   }
};