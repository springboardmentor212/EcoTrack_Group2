const {goalModel} = require("../model/goalModel");
const {unitMap,getBaseValue} = require("../utills/getUnitAndBaseValue");
const {currDates,utcDates,goalCurrentWeekDates,goalCurrentMonthDates,checkWeekEndDate,checkMonthEndDate}
      = require("../utills/getDate");
const updateGoalStatus = require("../service/goal/updateGoalStatus");
//read
module.exports.getGoals = async(req,res)=>{
 try{
    const userId = req.currUser,role = req.userRole,isBlocked = req.isBlocked;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to get update of goals"});
    }

    if(role !==  "user"){
        return res.status(400).json({success : false, message : "only normal user can get there goals data"});
    }

    if(isBlocked){
        return res.status(400).json({success : false, message : "blocked user can not get there goals data"});
    }
    
    const goals = await goalModel.find({
       userId, 
       $nor : [
         {status : "completed"},
         {status : "cancelled"} 
       ],
      });
    
    const goalRes = await updateGoalStatus(goals);

    if(goalRes==="updated"){
       const activeGoal = await goalModel.find({userId, status : "active"});
       const completeGoal = await goalModel.find({userId, status : "completed"});
       const otherGoal = await goalModel.find({  
          userId,
           $nor: [
           { status : "active" },
           { status : "completed" }
       ]});

       return res.status(200).json({success : true , result : {activeGoal , completeGoal ,otherGoal}});
    }else{
      return res.status(400).json({success : false , message : "not get the latest data of goals"});
    }
  }catch(error){
       return res.status(500).json({success : false , message : "internal server error"}); 
  }
};

module.exports.getGoal = async(req,res)=>{
  try{
    const userId = req.currUser,role = req.userRole,isBlocked = req.isBlocked;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to get goal"});
    }

    if(role !==  "user"){
        return res.status(400).json({success : false, message : "only normal user can get there specific goal data"});
    }

    if(isBlocked){
        return res.status(400).json({success : false, message : "blocked user can not get there specific goal data"});
    }

    const {id} = req.params;
    const goal = await goalModel.findOne({_id : id , userId});

    if(!goal){
       return res.status(400).json({success : false, message : "goal doesn't exist"}); 
    }

    if(goal.category==="carbon emission"){
        return res.status(200).json({success : true , 
               goal : { id : goal._id,title : goal.title,category : goal.category,
                        goalType : goal.goalType,
                        trackingType : goal.trackingType,target  :goal.target,
                        unit : goal.unit,period : goal.period,
                        startDate : goal.startDate,endDate : goal.endDate 
               }}); 
    }else{
        return res.status(200).json({success : true , 
               goal : { id : goal._id,title : goal.title, category : goal.category,
                        goalType : goal.goalType,target  :goal.target,
                        unit : goal.unit,period : goal.period,
                        startDate : goal.startDate,endDate : goal.endDate 
               }}); 
    }
   }catch(error){
       return res.status(500).json({success : false , message : "internal server error"}); 
   }
};

//create
module.exports.createGoal = async(req,res)=>{
 try{
   const userId = req.currUser,role = req.userRole,isBlocked = req.isBlocked;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to create goal"});
    }
    
    if(role !==  "user"){
        return res.status(400).json({success : false, message : "only normal user can create new goal"});
    }

    if(isBlocked){
        return res.status(400).json({success : false, message : "blocked user can not create new goal"});
    }
    
   const goalData =  req.body;
   goalData.endDate = utcDates(goalData.endDate);

   let isValidEndDate = true;
   if(goalData.period === "daily"){
      goalData.startDate = currDates();
   }else if(goalData.period === "weekly"){
      const {weekStart} = goalCurrentWeekDates();
      goalData.startDate = weekStart;
      isValidEndDate = checkWeekEndDate(goalData.endDate);
   }else if(goalData.period === "monthly"){
      const {monthStart} = goalCurrentMonthDates();
      goalData.startDate = monthStart;
      isValidEndDate = checkMonthEndDate(goalData.endDate);
   }

   if(!isValidEndDate){
      const formate = new Intl.DateTimeFormat('en-GB',{
         timeZone : 'UTC' , dateStyle : 'medium' , timeStyle : 'short' , hour12 : true
      });
      const formattedDate = formate.format(new Date(goalData.endDate));
      return res.status(400).json({success : false, message : `goals endDate ${formattedDate.split(",")[0]} is unvaild for period ${goalData.period}`});
   }

   goalData.unit = unitMap(goalData.goalType),goalData.goalDirection = "maximum",goalData.userId = userId;
   let baseValue = 0;

   if(goalData.target > 100 && goalData.unit==="%"){
      return res.status(400).json({success : false , message : `target  ${goalData.target} or unit ${goalData.unit} or goalType ${goalData.goalType} is wrong`})
   }
   if(goalData.goalType === "use only electric vehicle" || 
      goalData.goalType === "use only cng vehicle" || 
      goalData.goalType === "increase carbon saved"){
         goalData.goalDirection = "minimum";
   }else if(goalData.goalType === "reduce travelling distance" || 
            goalData.goalType === "reduce electricity consumption" || 
            goalData.goalType === "reduce waste generated" || 
            goalData.goalType === "reduce carbon emissions"
   ){
      baseValue = await getBaseValue(goalData.startDate,goalData.period,
                        goalData.category,userId);

      if(goalData.goalType === "reduce carbon emissions"){
         if(goalData.trackingType === "all"){
            baseValue = baseValue.emission;
         }else if(goalData.trackingType === "transportation"){
            baseValue = baseValue.transportationEmission;
         }else if(goalData.trackingType === "electricity"){
            baseValue = baseValue.electricityEmission;
         }else if(goalData.trackingType === "waste management"){
            baseValue = baseValue.wasteEmission;
         }
      }

      if(!baseValue || baseValue===0){
         return res.status(400).json({success : false, message : `does not have a pervious distance history of your selected period`}); 
      }
   }

   if(baseValue > 0){
       baseValue = baseValue - goalData.target * (baseValue/100);
       goalData.baseValue = baseValue;
   }

   const goal = new goalModel(goalData);
   await goal.save();
   return res.status(200).json({success : true , message  : "goal create successfully"});
  }catch(error){
       return res.status(500).json({success : false , message : "internal server error"}); 
  }
};

//update
module.exports.updateGoal = async(req,res)=>{
 try{
  const userId = req.currUser,role = req.userRole,isBlocked = req.isBlocked;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update goals"});
    }

    if(role !==  "user"){
        return res.status(400).json({success : false, message : "only normal user can update there existing goal"});
    }

    if(isBlocked){
        return res.status(400).json({success : false, message : "blocked user can not update goal"});
    }
    
   const goalData =  req.body;

   const currDate = currDates();
   goalData.endDate = utcDates(goalData.endDate);

   const goal = await goalModel.findById(goalData.id);
   if(goal.status==="completed" || goal.status==="cancelled"){
     return res.status(400).json({success : false, message : "goal is completed or cancelled so you can't update it"});
   }

   if(goal.status === "failed" && goal.endDate < currDate){
      return res.status(400).json({success : false, message : "goal has failed and its end date has passed so you can't update it"});
   }

   let isValidEndDate = true;
   if(goalData.period === "daily"){
      goalData.startDate = currDates();
   }else if(goalData.period === "weekly"){
      const {weekStart} = goalCurrentWeekDates();
      goalData.startDate = weekStart;
      isValidEndDate = checkWeekEndDate(goalData.endDate);
   }else if(goalData.period === "monthly"){
      const {monthStart} = goalCurrentMonthDates();
      goalData.startDate = monthStart;
      isValidEndDate = checkMonthEndDate(goalData.endDate);
   }

   if(!isValidEndDate){
      const formate = new Intl.DateTimeFormat('en-GB',{
         timeZone : 'UTC' , dateStyle : 'medium' , timeStyle : 'short' , hour12 : true
      });
      const formattedDate = formate.format(new Date(goalData.endDate));
      return res.status(400).json({success : false, message : `goals endDate ${formattedDate.split(",")[0]} is unvaild for period ${goalData.period}`});
   }

   goalData.unit = unitMap(goalData.goalType),goalData.goalDirection = "maximum";
   goalData.endDate = utcDates(goalData.endDate);
   let baseValue = 0;

   if(goalData.target > 100 && goalData.unit==="%"){
      return res.status(400).json({success : false , message : `target value ${goalData.target} or unit ${goalData.unit} or goalType ${goalData.goalType} is wrong`});
   }
   if(goalData.goalType === "use only electric vehicle" || 
      goalData.goalType === "use only cng vehicle" || 
      goalData.goalType === "increase carbon saved"){
         goalData.goalDirection = "minimum";
   }else if(goalData.goalType === "reduce travelling distance" || 
            goalData.goalType === "reduce electricity consumption" || 
            goalData.goalType === "reduce waste generated" || 
            goalData.goalType === "reduce carbon emissions"
   ){
      baseValue = await getBaseValue(goalData.startDate,goalData.period,
                        goalData.category,userId);

      if(goalData.goalType === "reduce carbon emissions"){
         if(goalData.trackingType === "all"){
            baseValue = baseValue.emission;
         }else if(goalData.trackingType === "transportation"){
            baseValue = baseValue.transportationEmission;
         }else if(goalData.trackingType === "electricity"){
            baseValue = baseValue.electricityEmission;
         }else if(goalData.trackingType === "waste management"){
            baseValue = baseValue.wasteEmission;
         }
      }

      if(!baseValue || baseValue===0){
         return res.status(400).json({success : false, message : "There is no previous history for your selected period"}); 
      }
   }

   if(baseValue > 0){
       baseValue = baseValue - goalData.target * (baseValue/100);
   }
   goalData.baseValue = baseValue;

  const newGoal = await goalModel.findByIdAndUpdate(goalData.id,goalData);
   if(newGoal){
    return res.status(200).json({success : true , message  : "goal updated successfully"});
   }else{
    return res.status(200).json({success : true , message  : "goal not updated"}); 
   }
  }catch(error){
       return res.status(500).json({success : false , message : "internal server error"}); 
  }
};

//delete
module.exports.cancelGoal = async(req,res)=>{
 try{
    const userId = req.currUser,role = req.userRole,isBlocked = req.isBlocked;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to cancel goal"});
    }

    if(role !==  "user"){
        return res.status(400).json({success : false, message : "only normal user can cancel there specific goal"});
    }

    if(isBlocked){
        return res.status(400).json({success : false, message : "blocked user can not cancel there specific goal"});
    }

    const {id} = req.params;
    const goal = await goalModel.findOne({_id : id , userId});
    
    if(!goal){
       return res.status(400).json({success : false, message : "goal doesn't exist"}); 
    }

    if(goal.status === "completed" || goal.status === "cancelled"){
       return res.status(200).json({success : false , message : "goal is completed or cancelled so you can't cancelled it"});
    }

    const currDate = currDates();
    if(goal.status === "failed" && goal.endDate < currDate){
      return res.status(400).json({success : false, message : "goal has failed and its end date has passed so you can't cancelled it"});
    }

    await goalModel.findByIdAndUpdate(id ,{status : "cancelled"});
    return res.status(200).json({success : false , message : "goal cancelled successfully"});
   }catch(error){
       return res.status(500).json({success : false , message : "internal server error"}); 
   }
};

module.exports.deleteGoal = async(req,res)=>{
 try{
    const userId = req.currUser,role = req.userRole,isBlocked = req.isBlocked;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to delete goal"});
    }

    if(role !==  "user"){
        return res.status(400).json({success : false, message : "only normal user can delete there specific goal data"});
    }

    if(isBlocked){
        return res.status(400).json({success : false, message : "blocked user can not delete there specific goal data"});
    }

    const {id} = req.params;
    await goalModel.findByIdAndDelete(id);
    return res.status(200).json({success : true , message : "goal delete successfully"});
   }catch(error){
       return res.status(500).json({success : false , message : "internal server error"}); 
   }
};