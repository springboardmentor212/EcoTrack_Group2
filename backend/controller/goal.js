const {goalModel} = require("../model/goalModel");
const {unitMap,getBaseValue} = require("../utills/getUnitAndBaseValue");

//read
module.exports.getGoals = async(req,res)=>{

};

module.exports.getGoal = async(req,res)=>{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }

    const {id} = req.params;
    const goal = await goalModel.findOne({_id : id , userId});

    if(!goal){
       return res.status(400).json({success : false, message : "goal doesn't exist"}); 
    }

    if(goal.category==="carbon_emission"){
        return res.status(200).json({success : true , 
               goal : {category : goal.category,goalType : goal.goalType,
                        trackingType : goal.trackingType,target  :goal.target,
                        unit : goal.unit,period : goal.period,
                        startDate : goal.startDate,endDate : goal.endDate 
               }}); 
    }else{
        return res.status(200).json({success : true , 
               goal : {category : goal.category,goalType : goal.goalType,
                        target  :goal.target,unit : goal.unit,
                        period : goal.period,startDate : goal.startDate,
                        endDate : goal.endDate 
               }}); 
    }
};

//create
module.exports.createTransportationGoal = async(req,res)=>{
   const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }
    
   const goalData =  req.body;
   goalData.startDate = new Date(),goalData.unit = unitMap(goalType),goalData.goalDirection = "maximum";
   let baseValue = 0;

   if(goalData.target > 100 && goalData.unit==="%"){
      return res.status(400).json({success : false , message : `target value ${goalData.target} or unit ${goalData.unit} or goalType ${goalData.goalType} is wrong`})
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
      baseValue = await getBaseValue(startDate,period,category,userId);

      if(baseValue===0){
         return res.status(400).json({success : false, message : `does not have a pervious distance history of your selected period`}); 
      }
   }

   if(baseValue > 0){
       baseValue = baseValue - target * (baseValue/100);
       goalData.baseValue = baseValue;
   }

   const goal = new goalModel(goalData);
   await goal.save();
   return res.status(200).json({success : true , message  : "goal save successfully"});
};

module.exports.createElectricityGoal = async(req,res)=>{
   const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }
    
   const {category,goalType,target,period,endDate} = req.body;
   let baseValue = 0,startDate = new Date(),unit = unitMap(goalType),goalDirection = "maximum";

   if(target > 100 && unit==="%"){
      return res.status(400).json({success : false , message : `target value ${target} or unit ${unit} or goalType ${goalType} is wrong`})
   }

   if(goalType === "reduce electricity consumption"){
      baseValue = await getBaseValue(startDate,period,category,userId);

      if(baseValue===0){
         return res.status(400).json({success : false, message : `does not have a pervious electricity consumption history of pervious month`}); 
      }
   }

   let goal;
   if(baseValue === 0){
       goal = new goalModel({userId,category,goalType,target,unit,period,startDate,endDate,goalDirection});
   }else if(baseValue > 0){
       baseValue = baseValue - target * (baseValue/100);
       goal = new goalModel({userId,category,goalType,target,unit,period,startDate,endDate,goalDirection,baseValue});
   }

   await goal.save();
   return res.status(200).json({success : true , message  : "goal save successfully"});
};

module.exports.createWastemanagementGoal = async(req,res)=>{
   const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }
    
   const {} = req.body;

};

module.exports.createCarbonEmissionGoal = async(req,res)=>{
   const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }
    
   const {} = req.body;

};

module.exports.createCarbonSaveGoal = async(req,res)=>{
   const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }
    
   const {} = req.body;

};

//update
module.exports.updateTransportationGoal = async(req,res)=>{

};

module.exports.updateElectricityGoal = async(req,res)=>{

};

module.exports.updateWastemanagementGoal = async(req,res)=>{

};

module.exports.updateCarbonEmissionGoal = async(req,res)=>{

};

module.exports.updateCarbonSaveGoal = async(req,res)=>{

};

//delete
module.exports.cancelGoal = async(req,res)=>{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }

    const {id} = req.params;
    const goal = await goalModel.findOne({_id : id , userId});
    
    if(!goal){
       return res.status(400).json({success : false, message : "goal doesn't exist"}); 
    }

    if(goal.status === "active"){
       await goalModel.findByIdAndUpdate(id ,{status : "cancelled"});
       return res.status(200).json({success : false , message : "goal cancelled successfully"});
    }else{
       return res.status(200).json({success : false , message : "goal doesn't active so you can't cancelled it"});
    }
};

module.exports.deleteGoal = async(req,res)=>{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }

    const {id} = req.params;
    await goalModel.findByIdAndDelete(id);
    return res.status(200).json({success : true , message : "goal delete successfully"});
};