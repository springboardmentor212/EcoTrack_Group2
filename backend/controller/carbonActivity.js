const {carbonActivityModel} = require("../model/carbonActivityModel");


//Create Activity
module.exports.createTransporatationActivity = async(req,res)=>{
 try{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }

    const {category,date,transportation} = req.body;
    const emission = 5;

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

    const {category,date,electricity} = req.body;
    const emission = 5;

    const activity = new carbonActivityModel({userId,category,date,electricity,emission});
    await activity.save();
    return res.status(200).json({success : true , message : "activity save successfully"});
  }catch(error){
    return res.status(500).json({success : false , message : "internal server error"});
  }
};

module.exports.createWasteActivity = async(req,res)=>{
  try{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }

    const {category,date,waste} = req.body;
    const emission = 5;

    const activity = new carbonActivityModel({userId,category,date,waste,emission});
    await activity.save();
    return res.status(200).json({success : true , message : "activity save successfully"});
  }catch(error){
    return res.status(500).json({success : false , message : "internal server error"});
  }
};

//Read Activity
module.exports.getTransporatationActivity = async(req,res)=>{
  try{
    const userId = req.currUser;
    if(!userId){
        return res.status(400).json({success : false, message : "login first to update profile"});
    }
    
    const transporatationActivity = await carbonActivityModel.find({userId,category : "transportation"}).sort({date : 'desc'});
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
    
    const electricityActivity = await carbonActivityModel.find({userId,category : "electricity"}).sort({date : 'desc'});
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
    
    const wasteActivity = await carbonActivityModel.find({userId,category : "waste"}).sort({date : 'desc'});
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
    const emission = 10;

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

    const {id,date,electricity} = req.body;
    const emission = 10;

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
    const emission = 10;

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