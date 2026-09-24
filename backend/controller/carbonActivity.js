const {carbonActivityModel} = require("../model/carbonActivityModel");
const monthMap = require("../utills/getMonth");
const {transportationEmission,electricityEmission,wasteEmission} = require("../service/emissionCalculationService");
const {getSummary} = require("../service/summaryCalculationService");

//Create Activity
module.exports.createTransporatationActivity = async(req,res)=>{
  try{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }

    const {category,date,transportation} = req.body;

    if((transportation.transportMode==="2 wheeler" && (transportation.fuelType==="diesel" || transportation.fuelType==="cng")) ||
       (transportation.transportMode==="bus" && (transportation.fuelType==="petrol" || transportation.fuelType==="cng")) || 
       (transportation.transportMode==="train" && transportation.fuelType!=="electric")){
       return res.status(400).json({success : false, message : "wrong transport mode or fuel type"});
    }

    const emission = transportationEmission(transportation.transportMode,transportation.fuelType,transportation.distance,date);
    const activity = new carbonActivityModel({userId,category,date,transportation,emission});
    await activity.save();
    return res.status(200).json({success : true , message : "activity save successfully"});
  }catch(err){
    return res.status(500).json({success : false , message : "internal server error"});
  }
};

module.exports.createElectricityActivity = async(req,res)=>{
  try{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }

    const {category,electricity} = req.body;
    const monthIndex = monthMap[electricity.month];
    const date = new Date(Date.UTC(electricity.year,monthIndex,2));

    const emission = electricityEmission(electricity.consumption,date);
    const activity = new carbonActivityModel(
      {
        userId,
        category,
        date,
        electricity,
        emission
      });
    await activity.save();
    return res.status(200).json({success : true , message : "activity save successfully"});
  }catch(error){
    return res.status(500).json({success : false , message : "internal server error"});
  }
};

module.exports.createWasteActivity = async(req,res)=>{
  // try{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }

    const {category,date,waste} = req.body;

    if((waste.wasteType==="wet waste" && (waste.disposalMethod === "burned" || waste.disposalMethod === "recycled")) || 
       (waste.wasteType!=="wet waste" && waste.disposalMethod === "composting")){
        return res.status(400).json({success : false,message : "wrong waste type or disposal method"});
    }

    let emission;
    if((waste.wasteType==="dry waste" || waste.wasteType==="e waste") && waste.disposalMethod==="recycled"){
        waste.carbonSave = wasteEmission(waste.wasteType,waste.disposalMethod,waste.wasteAmount);
        emission  = 0;
    }else{
        emission = wasteEmission(waste.wasteType,waste.disposalMethod,waste.wasteAmount);
        waste.carbonSave = 0;
    }

    const activity = new carbonActivityModel({userId,category,date,waste,emission});
    await activity.save();
    return res.status(200).json({success : true , message : "activity save successfully"});
  // }catch(error){
  //   return res.status(500).json({success : false , message : "internal server error"});
  // }
};

//Read Activity
module.exports.getTransporatationActivity = async(req,res)=>{
 try{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }
    
    const {month,year} = req.query;
    const monthIndex = monthMap[month];

    const startDate = new Date(Date.UTC(year,monthIndex,1));
    const endDate = new Date(Date.UTC(year,monthIndex + 1,1));

    const transporatationActivity = await carbonActivityModel.find(
      { 
       userId,
       category : "transportation",
       date : {
         $gte : startDate,
         $lt : endDate
       }
      }).sort({date : 'desc'});
    if(transporatationActivity){
        res.status(200).json({success : true , transporatationActivity });
    }else{
        res.status(200).json({success : false});
    }
  }catch(error){
    return res.status(500).json({success : false , message : "internal server error"}); 
  }
};

module.exports.getElectricityActivity = async(req,res)=>{
  try{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }
    
    const year = parseInt(req.query.year);
    const startDate = new Date(Date.UTC(year,0,1));
    const endDate = new Date(Date.UTC(year+1,0,1));

    const electricityActivity = await carbonActivityModel.find(
      {
        userId,
        category : "electricity",
        date : {
         $gte : startDate,
         $lt : endDate
       }
      }).sort({date : 'desc'});
    if(electricityActivity){
        res.status(200).json({success : true , electricityActivity });
    }else{
        res.status(200).json({success : false});
    }
  }catch(error){
    return res.status(500).json({success : false , message : "internal server error"});
  }
};

module.exports.getWasteActivity = async(req,res)=>{
  try{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }
    
    const {month,year} = req.query;
    const monthIndex = monthMap[month];

    const startDate = new Date(Date.UTC(year,monthIndex,1));
    const endDate = new Date(Date.UTC(year,monthIndex + 1,1));

    const wasteActivity = await carbonActivityModel.find(
      {
        userId,
        category : "waste",
        date : {
         $gte : startDate,
         $lt : endDate
       } 
      }).sort({date : 'desc'});
    if(wasteActivity){
        res.status(200).json({success : true , wasteActivity});
    }else{
        res.status(200).json({success : false});
    }
  }catch(error){
    return res.status(500).json({success : false , message : "internal server error"});
  }
};

module.exports.getActivity = async(req,res)=>{
  try{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }
    
    const {id} = req.params;
    const activity = await carbonActivityModel.findOne({_id : id ,userId});
    if(activity){
        if(activity.category === "transportation"){
           res.status(200).json({success : true , activity : {_id : activity._id ,category : activity.category,date : activity.date,emission : activity.emission,transportation : activity.transportation}});
        }else  if(activity.category === "electricity"){
           res.status(200).json({success : true , activity : {_id : activity._id ,category : activity.category,date : activity.date,emission : activity.emission,electricity : activity.electricity}});
        }else  if(activity.category === "waste"){
           res.status(200).json({success : true , activity : {_id : activity._id ,category : activity.category,date : activity.date,emission : activity.emission,waste : activity.waste}});
        }
    }else{
        res.status(200).json({success : false});
    }
  }catch(error){
    return res.status(500).json({success : false , message : "internal server error"});
  }
};

//update Activity
module.exports.updateTransporatationActivity = async(req,res)=>{
 try{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }

    const {id,date,transportation} = req.body;
    if((transportation.transportMode==="2 wheeler" && transportation.fuelType==="diesel") ||
       (transportation.transportMode==="bus" && transportation.fuelType==="petrol") || 
       (transportation.transportMode==="train" && transportation.fuelType!=="electric")){
       return res.status(400).json({success : false, message : "wrong transport mode or fuel type"});
    }

    const emission = transportationEmission(transportation.transportMode,transportation.fuelType,transportation.distance,date);
    const newActivity = await carbonActivityModel.findByIdAndUpdate(id,
        {
            date,
            emission,
            transportation
        }
    );

    if(newActivity){
       return res.status(200).json({success : true , message : "activity updated successfully"});
    }else{
        return res.status(400).json({success : false , message : "activity not updated"})
    }
  }catch(error){
    return res.status(500).json({success : false , message : "internal server error"});
  }
};

module.exports.updateElectricityActivity = async(req,res)=>{
  try{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }

    const {id,electricity} = req.body;
    const monthIndex = monthMap[electricity.month];
    const date = new Date(Date.UTC(electricity.year,monthIndex,2));
    
    const emission = electricityEmission(electricity.consumption,date);
    const newActivity = await carbonActivityModel.findByIdAndUpdate(id,
        {
            date,
            emission,
            electricity
        }
    );

    if(newActivity){
       return res.status(200).json({success : true , message : "activity updated successfully"});
    }else{
        return res.status(400).json({success : false , message : "activity not updated"})
    }
  }catch(error){
    return res.status(500).json({success : false , message : "internal server error"});
  }
};

module.exports.updateWasteActivity = async(req,res)=>{
  try{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }

    const {id,date,waste} = req.body;

    if((waste.wasteType==="wet waste" && (waste.disposalMethod === "burned" || waste.disposalMethod === "recycled")) || 
      (waste.wasteType!=="wet waste" && waste.disposalMethod === "composting")){
        return res.status(400).json({success : false,message : "wrong waste type or disposal method"});
    }

    let emission;
    if((waste.wasteType==="dry waste" || waste.wasteType==="e waste") && waste.disposalMethod==="recycled"){
        waste.carbonSave = wasteEmission(waste.wasteType,waste.disposalMethod,waste.wasteAmount);
        emission  = 0;
    }else{
        emission = wasteEmission(waste.wasteType,waste.disposalMethod,waste.wasteAmount);
        waste.carbonSave = 0;
    }

    const newActivity = await carbonActivityModel.findByIdAndUpdate(id,
        {
            date,
            emission,
            waste
        }
    );

    if(newActivity){
       return res.status(200).json({success : true , message : "activity updated successfully"});
    }else{
        return res.status(400).json({success : false , message : "activity not updated"})
    }
  }catch(error){
    return res.status(500).json({success : false , message : "internal server error"}); 
  }
};


//delete Activity
module.exports.deleteActivity = async(req,res)=>{
 try{
   const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }
    
    const {id} = req.params;
    await carbonActivityModel.findByIdAndDelete(id);
    return res.status(200).json({success : true , message : "activity deleted successfully"});
  }catch(error){
    return res.status(500).json({success : false , message : "internal server error"}); 
  }
};


//summmary
module.exports.summaryActivity = async(req,res)=>{
  try{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }

    const {type,duration} = req.query;
    const result = await getSummary(type,duration,userId);
    if(result.typeSummary && result.durationSummary){
        return res.status(200).json({success : true , message : `summary of ${type} activity basis of duration type ${duration}`,result});
    }else{
        return res.status(400).json({success : false, message : `doesn't have any ${type} activity in ${duration} duration`});
    }
  }catch(error){
       return res.status(500).json({success : false , message : "internal server error"}); 
  }
};