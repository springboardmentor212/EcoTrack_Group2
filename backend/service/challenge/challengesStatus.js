const {challengeModel} = require("../../model/challengeModel");
const {userModel} = require("../../model/userModel");
const {currDates,utcStartDate,utcDates} = require("../../utills/getDate");
const {getTransportationData,getElectricityData,getWasteData,getEmissionData} 
       = require("../goal/goalsDurationData");

const getChallengeTrackingData = async(user,challenge) => {
    const {category,challengeType,trackingType,target,period,startDate,endDate,} = challenge;
    let todayEnd = currDates();
    todayEnd = utcDates(todayEnd);

    let unit;
    if(period === "daily"){
      unit = "day";
    }else if(period === "weekly"){
      unit = "week";
    }else if(period === "monthly"){
      unit = "month";
    }

    const endD = todayEnd < endDate ? todayEnd : endDate;
    let challengeValue = target,values = [];
    
    if(category==="transportation"){
        const transportationData = await getTransportationData(startDate,endD,unit,user._id);  
        if(challengeType === "distance limit challenge"){ 
            values = transportationData.map(el => el.totalDistance);
        }else if(challengeType === "ev travel challenge"){
            values = transportationData.map(el => el.electricDistance);
        }else if(challengeType === "cng commute challenge"){
            values = transportationData.map(el => el.cngCount);
        }
    }else if(category === "electricity"){
        const electricityData = await getElectricityData(startDate,endD,user._id);
        values = electricityData.map(el => el.consumption);
    }else if(category === "waste management" || category === "carbon save"){
        const wasteData = await getWasteData(startDate,endD,unit,user._id);
        if(category === "waste management" && 
           (challengeType === "waste reduction week" || challengeType === "zero waste day")){
           values = wasteData.map(el => el.totalWasteAmount);
        }else if(category === "waste management" && challengeType === "recycle and save"){
           values = wasteData.map(el => el.totalRecycleWaste);
        }else{
           values = wasteData.map(el => el.totalCarbonSave);     
        }
    }else if(category === "carbon emission"){
        const carbonData = await getEmissionData(startDate,endD,unit,trackingType,user._id);
        values = carbonData.map(el => el.totalEmission);
    }
        
    return {values,challengeValue};
};

const challengeStatus = async(user,challenge) => {
   const {startDate,endDate,direction} = challenge;
   let currDate = currDates(); //(y,m,d,h,m,s,ms)
   currDate = utcStartDate(currDate); //(y,m,d,0,0,0,0)
   
   if(currDate < startDate){
        return "not started";
   }

   const {values,challengeValue} = await getChallengeTrackingData(user,challenge);
   let hasMissingEntry = false;
   
       for (const value of values) {
   
           // Activity enter नहीं हुई
           if (value === -1 || value === undefined) {
   
               hasMissingEntry = true;
               continue;
           }
   
           // Maximum
           if (
               direction === "maximum" &&
               value > challengeValue
           ) {
               return "failed";
           }
   
           // Minimum
           if (
               direction === "minimum" &&
               value < challengeValue
           ) {
               return "failed";
           }
       }
   
       // ----------------------------------
       // Final status
       // ----------------------------------
   
      if (endDate <= currDate) {
       return hasMissingEntry || values.length === 0
           ? "failed"
           : "completed";
   }
   
     // अभी active है
      if (hasMissingEntry || values.length === 0) {
       return "not have entry";
     }
   
   return "active";
};

const updateUserChallengesStatus = async(userId,userChallengesId) => {
    const challenges = await challengeModel.find({ _id : { $in : userChallengesId}});
    const user = await userModel.findById(userId);

    for(const challenge of challenges){
        const chall = user.joinChallenges.find(ch => ch.challengeId.toString() === challenge._id.toString());

        if(!chall){
            continue;
        }
        let status,limitDate = utcDates(challenge.endDate),currDate = currDates();
        limitDate = new Date(
            Date.UTC(
            limitDate.getUTCFullYear(),
            limitDate.getUTCMonth(),
            limitDate.getUTCDate() + 3,
            23,59,59,999
        ));
          
        currDate = utcStartDate(currDate);

        if(chall.status === "cancelled" || currDate > limitDate){
           continue;
        }

          status = await challengeStatus(user,challenge);

          if(chall.status !== status){
           await userModel.updateOne(
                 { _id : userId, "joinChallenges.challengeId" : challenge._id},
                 { $set : {"joinChallenges.$.status" : status}}
              );
          }
    }

};

const updateAllChallengesStatus = async() => {
    const challenges = await challengeModel.find({status :  { $ne: "close" } });
    let currDate = currDates();
    currDate = utcStartDate(currDate);

    for(const challenge of challenges){
        const {startDate,endDate} = challenge;
        
        let status ;
        if(currDate < startDate){
            status = "not started";
        }

        if(startDate <= currDate &&  currDate <= endDate){
            status = "ongoing";
        }

        if(currDate > endDate){
            status = "closed";
        }

        if(!status || challenge.status === status){
            continue;
        }

        await challengeModel.findByIdAndUpdate(challenge._id , {status});
    }
};
module.exports = {updateUserChallengesStatus,updateAllChallengesStatus};