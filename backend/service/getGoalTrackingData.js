const {getTransportationData,getElectricityData,getWasteData,getEmissionData} = require("../service/goalsDurationData");
const {utcDates} = require("../utills/getDate");

module.exports.getGoalTrackingData = async (goal) => {
   const {category,startDate,endDate,goalType,trackingType,period,userId,target,baseValue} = goal;
   let previousDay = new Date().setDate(new Date().getDate() - 1);
   previousDay = utcDates(previousDay);
   let unit;
   if(period === "daily"){
      unit = "day";
   }else if(period === "weekly"){
      unit = "week";
   }else if(period === "monthly"){
      unit = "month";
   }

   const endD = previousDay < endDate ? previousDay : endDate;
   let values,goalValue; 
    goalValue = (goalType === "reduce travelling distance" || goalType === "reduce electricity consumption" 
                 ||  goalType === "reduce waste generated" || goalType === "reduce carbon emissions"  
                    ) ? baseValue : target;
   if(category==="transportation"){
        const transportationData = await getTransportationData(startDate,endD,unit,userId);  
        if(goalType === "reduce travelling distance" || goalType === "keep travelling distance within limit"){ 
              values = transportationData.map(el => el.totalDistance);
        }else if(goalType === "use only electric vehicle"){
              values = transportationData.map(el => el.electricCount);
        }else if(goalType === "use only cng vehicle"){
              values = transportationData.map(el => el.cngCount);
        }
    }else if(category === "electricity"){
        const electricityData = await getElectricityData(startDate,endD,userId);
        values = electricityData.map(el => el.consumption);
    }else if(category === "waste management" || category === "carbon save"){
        const wasteData = await getWasteData(startDate,endD,unit,userId);
        if(category === "waste management"){
           values = wasteData.map(el => el.totalWasteAmount);
        }else{
           values = wasteData.map(el => el.totalCarbonSave);     
        }
    }else if(category === "carbon emission"){
        const carbonData = await getEmissionData(startDate,endD,unit,trackingType,userId);
        values = carbonData.map(el => el.totalEmission);
    }
    
    return {values,goalValue};
};