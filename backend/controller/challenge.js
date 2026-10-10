const {userModel} = require("../model/userModel");
const {challengeModel} = require("../model/challengeModel");
const {currDates,utcStartDate,utcDates,
       checkWeekStartDate,checkMonthStartDate,checkWeekEndDate,checkMonthEndDate}
      = require("../utills/getDate");
const {challengeUnitMap} = require("../utills/getUnitAndBaseValue");
const {sendChallengeSuggestion,sendUpdateChallengeNotification,sendDeleteChallengeNotification}
   = require("../service/notification/challengeNotificationService");
const {updateUserChallengesStatus} = require("../service/challenge/challengesStatus");

//create
module.exports.createChallenge = async (req,res) => {
  try{
    const userId = req.currUser,userRole = req.userRole;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to create challenge"});
    }

    if(!userRole || userRole !== "admin"){
        return res.status(400).json({success : false, message : "only Admin user has permission to create challenge"});
    }

    const challengeData = req.body;
    challengeData.startDate = utcStartDate(challengeData.startDate),
    challengeData.endDate = utcDates(challengeData.endDate);

    let isValidStartDate = true,isValidEndDate = true;

    if(challengeData.period === "weekly"){
       isValidStartDate = checkWeekStartDate(challengeData.startDate);
       isValidEndDate = checkWeekEndDate(challengeData.endDate);
    }

    if(challengeData.period === "monthly"){
       isValidStartDate = checkMonthStartDate(challengeData.startDate);
       isValidEndDate = checkMonthEndDate(challengeData.endDate);
    }

    const formate = new Intl.DateTimeFormat('en-GB',{
         timeZone : 'UTC' , dateStyle : 'medium' , timeStyle : 'short' , hour12 : true
    });
    const formatStartDate = formate.format(new Date(challengeData.startDate));
    const formatEndDate = formate.format(new Date(challengeData.endDate));

    if(!isValidStartDate){
      return res.status(400).json({success : false, message : `challenge start date ${formatStartDate.split(",")[0]} is unvaild for period ${challengeData.period}`});
    }

    if(!isValidEndDate){
      return res.status(400).json({success : false, message : `challenge end date ${formatEndDate.split(",")[0]} is unvaild for period ${challengeData.period}`});
   }

   challengeData.unit = challengeUnitMap(challengeData.challengeType);challengeData.direction = "maximum";
   if(challengeData.challengeType === "ev travel challenge" || 
      challengeData.challengeType === "cng commute challenge" || 
      challengeData.challengeType === "recycle and save" || 
      challengeData.challengeType === "carbon saving challenge"){
         challengeData.direction = "minimum";
   }

   if(challengeData.challengeType === "waste reduction week"){
      challengeData.period = "weekly";
   }

   if(challengeData.challengeType === "zero waste day"){
      challengeData.period = "daily";
      challengeData.target = 0;
   }

   const challenge = new challengeModel(challengeData);
   await challenge.save();
   await sendChallengeSuggestion(challenge);
   return res.status(200).json({success : true , message  : "challenge create successfully"});
  }catch(error){
     return res.status(500).json({success : false , message : "internal server error"}); 
  }
};

//read
module.exports.getChallengesByUser = async (req,res) => {
  try{
    const userId = req.currUser,role = req.userRole,isBlocked = req.isBlocked;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to get challenges"});
    }

    if(role !== "user"){
       return res.status(400).json({success : false , message : "only normal user get the challenges data"});
    }

    if(isBlocked){
       return res.status(400).json({success : false, message : "block user can't get challenges data"});
    }

   const user = await userModel.findById(userId);
   const userChallengesId = user.joinChallenges.map(ch => ch.challengeId);
   await updateUserChallengesStatus(user._id,userChallengesId);

   const userChallenges = (await userModel.findById(userId).select("joinChallenges")
                     .populate("joinChallenges.challengeId")).joinChallenges.reverse();
      
   const userChallengesData = userChallenges.map(ch => ({
       _id : ch.challengeId._id,
       title : ch.challengeId.title,
       description : ch.description || {},
       category : ch.challengeId.category,
       challengeType : ch.challengeId.challengeType,
       trackingType : ch.challengeId.trackingType,
       target : ch.challengeId.target,
       unit : ch.challengeId.unit,
       period : ch.challengeId.period,
       startDate : ch.challengeId.startDate,
       endDate : ch.challengeId.endDate,
       status : ch.status,
       direction : ch.challengeId.direction
     }));

     const otherChallenges = await challengeModel.find({ _id : { $nin : userChallengesId }});
     return res.status(200).json({success : true, userChallengesData , otherChallenges});
   }catch(error){
     return res.status(500).json({success : false , message : "internal server error"}); 
  }
};

module.exports.getChallengesByAdmin = async (req,res) => {
  try{
    const userId = req.currUser,role = req.userRole;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to get challenges"});
    }

    if(role !== "admin"){
       return res.status(400).json({success : false , message : "only admin user get the challenges data"});
    }

    const challenges = await challengeModel.find({}).sort({ createdAt: -1 });
    if(!challenges || challenges.length === 0){
      return res.status(400).json({success : false , message : "not have any challenges to show"});
    }

    return res.status(200).json({success : true , message : "challenges get successfully",challenges}); 
  }catch(error){
     return res.status(500).json({success : false , message : "internal server error"}); 
  }
};

module.exports.getChallenge = async (req,res) => {
  try{
    const userId = req.currUser,isBlocked = req.isBlocked;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to get challenge"});
    }

    if(isBlocked){
       return res.status(400).json({success : false, message : "block user can't get specific challenge"});
    }

    const {id} = req.params;
    const challenge = await challengeModel.findById(id);

    if(!challenge){
       return res.status(400).json({success : false, message : "challenge doesn't exist"}); 
    }

    const challengeData = {
        id : challenge._id,
        title : challenge.title,
        description : challenge.description || {},
        category : challenge.category,
        challengeType : challenge.challengeType,
        target : challenge.target,
        unit : challenge.unit,
        period : challenge.period,
        startDate : challenge.startDate,
        endDate : challenge.endDate,
        status : challenge.status,
        direction : challenge.direction
    };

    if(challenge.category === "carbon emission"){
        challengeData.trackingType = challenge.trackingType;
    }
    return res.status(200).json({success : true , message  : "get challenge successfully",challengeData});
  }catch(error){
     return res.status(500).json({success : false , message : "internal server error"}); 
  }
};

//update
module.exports.updateChallenge = async (req,res) => {
 try{
  const userId = req.currUser,userRole = req.userRole;
    if(!userId){
       return res.status(400).json({success : false, message : "login first to update challenge"});
    }

    if(!userRole || userRole !== "admin"){
        return res.status(400).json({success : false, message : "only Admin user has permission to update challenge"});
    }

    const challengeData = req.body;

    const currDate = currDates();
    challengeData.startDate = utcStartDate(challengeData.startDate),
    challengeData.endDate = utcDates(challengeData.endDate);

    let isValidStartDate = true,isValidEndDate = true;

    if(challengeData.period === "weekly"){
       isValidStartDate = checkWeekStartDate(challengeData.startDate);
       isValidEndDate = checkWeekEndDate(challengeData.endDate);
    }

    if(challengeData.period === "monthly"){
       isValidStartDate = checkMonthStartDate(challengeData.startDate);
       isValidEndDate = checkMonthEndDate(challengeData.endDate);
    }

    const formate = new Intl.DateTimeFormat('en-GB',{
         timeZone : 'UTC' , dateStyle : 'medium' , timeStyle : 'short' , hour12 : true
    });
    const formatStartDate = formate.format(new Date(challengeData.startDate));
    const formatEndDate = formate.format(new Date(challengeData.endDate));

    if(!isValidStartDate){
      return res.status(400).json({success : false, message : `challenge start date ${formatStartDate.split(",")[0]} is unvaild for period ${challengeData.period}`});
    }

    if(!isValidEndDate){
      return res.status(400).json({success : false, message : `challenge end date ${formatEndDate.split(",")[0]} is unvaild for period ${challengeData.period}`});
   }

   const challenge = await challengeModel.findById(challengeData.id);
   if(!challenge){
      return res.status(400).json({success : false, message : "challenge is not exist"});
   }

   if(challenge.status !== "not started" || challenge.startDate < currDate){
         return res.status(400).json({success : false, message : "challenge is Ongoing or closed, you can't update challenge"});
    }

   challengeData.unit = challengeUnitMap(challengeData.challengeType);challengeData.direction = "maximum";
   if(challengeData.challengeType === "ev travel challenge" || 
      challengeData.challengeType === "cng commute challenge" || 
      challengeData.challengeType === "recycle and save" || 
      challengeData.challengeType === "carbon saving challenge"){
         challengeData.direction = "minimum";
   }

   if(challengeData.challengeType === "waste reduction week"){
      challengeData.period = "weekly";
   }

   if(challengeData.challengeType === "zero waste day"){
      challengeData.period = "daily";
      challengeData.target = 0;
   }

   const updatedChallenge = await challengeModel.findByIdAndUpdate(challengeData.id,challengeData,{new : true,runValidators: true});
   await sendUpdateChallengeNotification(updatedChallenge);
   return res.status(200).json({success : true , message  : "challenge update successfully"});
  }catch(error){
     return res.status(500).json({success : false , message : "internal server error"}); 
  }
};

//delete
module.exports.deleteChallenge = async (req,res) => {
 try{
    const userId = req.currUser,userRole = req.userRole;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to delete challenge"});
    }

    if(!userRole || userRole !== "admin"){
        return res.status(400).json({success : false, message : "only Admin user has permission to delete challenge"});
    }

    const {id} = req.params;
    const challenge = await challengeModel.findById(id);
    if(!challenge){
       return res.status(400).json({success : false, message : "challenge is not exist"});
    }

    if(challenge.status === "closed" || challenge.endDate < currDates()){
       return res.status(400).json({success : false, message : "challenge is closed , you can't delete challenge"});
    }
  
    await sendDeleteChallengeNotification(challenge);
    await challengeModel.findByIdAndDelete(id);
    return res.status(200).json({success : true , message  : "delete challenge successfully"});
  }catch(error){
     return res.status(500).json({success : false , message : "internal server error"}); 
  }
};

//join
module.exports.joinChallenge = async (req,res) => {
 try{
   const userId = req.currUser,userRole = req.userRole,isBlocked = req.isBlocked;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to join challenge"});
    }

    if(!userRole || userRole !== "user"){
        return res.status(400).json({success : false, message : "only normal user join the challenge"});
    }

    if(isBlocked){
        return res.status(400).json({ success : false, message : "blocked user can't join the challenge"});
    }

   const {id} = req.params;
   const currDate = currDates();
   const challenge = await challengeModel.findById(id);
   if(!challenge || challenge.endDate < currDate){
      return res.status(400).json({success : false , message : "challenge is not exist or closed so you can't join it"});
   }

   const user = await userModel.findById(userId);
   if(user.joinChallenges && user.joinChallenges.length > 0 && 
      user.joinChallenges.some(ch => ch.challengeId.toString() === id.toString())){
      return res.status(400).json({success : false , message : "you already joined this challenge"});
   }

   let status = "not started";
   if(challenge.startDate <= currDate){
        status = "active";
   }

   const newChallenge = {
      challengeId : id,
      status
   };

   const updateJoinChallenge = await userModel.findByIdAndUpdate(
       userId,
       {$push : { joinChallenges : newChallenge }},
       {new : true}  
   );

   if(updateJoinChallenge){
      return res.status(200).json({success : true , message : "challenge join successfully"});
   }else{
      return res.status(400).json({success : false , message : "challenge not join"});
   }
  }catch(error){
     return res.status(500).json({success : false , message : "internal server error"}); 
  }
};

module.exports.getJoinChallenge = async (req,res) => {
try{
   const userId = req.currUser,userRole = req.userRole,isBlocked = req.isBlocked;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to get join challenges"});
    }

    if(!userRole || userRole !== "user"){
        return res.status(400).json({success : false, message : "only normal user can get join challenge data"});
    }

    if(isBlocked){
        return res.status(400).json({ success : false, message : "blocked user can't get join challenge data"});
    }
  
    const userChallenge = (await userModel.findOne({_id : userId, role : "user"}).select("joinChallenges")).joinChallenges;
    if(!userChallenge){
        return res.status(400).json({ success : false , message : "does't get the user challeges data"});
    } 

    const joinChallenges = userChallenge.map(ch => ch.challengeId);

    return res.status(200).json({ success : true , joinChallenges});
  }catch(error){
      return res.status(500).json({success : false , message : "internal server error"}); 
  }
}

//cancel
module.exports.cancelChallenge = async (req,res) => {
  try{
    const userId = req.currUser,userRole = req.userRole,isBlocked = req.isBlocked;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to cancel challenge"});
    }

    if(!userRole || userRole !== "user"){
        return res.status(400).json({success : false, message : "only normal user cancel the challenge"});
    }

    if(isBlocked){
        return res.status(400).json({ success : false, message : "blocked user can't cancel the challenge"});
    }

   const {id} = req.params;
   const currDate = currDates();
   const challenge = await challengeModel.findById(id);
   if(!challenge || challenge.endDate < currDate){
      return res.status(400).json({success : false , message : "challenge is not exist or closed so you can't cancelled it"});
   }

   const user = await userModel.findById(userId);
   if(!user.joinChallenges || user.joinChallenges.length === 0 || 
      !user.joinChallenges.some(ch => ch.challengeId.toString() === id.toString())){
      return res.status(400).json({success : false , message : "you doesn't joined this challenge so you can't cancelled it"});
   }

   const chall = user.joinChallenges.find(ch => ch.challengeId.toString() === id.toString());
   if(chall.status === "completed" || chall.status === "cancelled"){
      return res.status(400).json({success : false , message : "challenge is complete or already cancelled so you can't cancelled it"}); 
   }

   await userModel.updateOne(
      { _id : userId, "joinChallenges.challengeId" : id},
      { $set : {"joinChallenges.$.status" : "cancelled"}}
   );

   return res.status(200).json({success : true , message : "cancelled challenge successfully"});
  }catch(error){
     return res.status(500).json({success : false , message : "internal server error"}); 
  }
};