const {carbonTypeSummary,transportationTypeSummary,electricityTypeSummary,wasteTypeSummary} = require("./typeBasisSummaryService");
const unitMap = (goalType)=>{
   if(goalType === "reduce travelling distance" || goalType === "reduce electricity consumption" || 
      goalType === "reduce waste generated" || goalType === "reduce carbon emissions"){
     return "%";
   }else if(goalType === "keep travelling distance within limit"){
     return "km";
   }else if(goalType === "keep electricity consumption within limit"){
     return "kwh";
   }else if(goalType === "keep waste generation within limit"){
     return "kg";
   }else if(goalType === "keep carbon emissions within limit" || goalType === "increase carbon saved"){
     return "kgco2";
   }else if(goalType === "use only electric vehicle" || goalType === "use only cng vehicle"){
     return "trips";
   }
};


const getBaseValue = async (date,period,category,userId) => {
     const month = new Date(date).getMonth(),year = new Date(date).getFullYear();
     const Date = new Date(date).getDate(),day = new Date(date).getDay();

     let startDate,endDate;
     if(period==="daily"){
        startDate =  new Date(Date.UTC(year,month,Date-1));
        endDate = new Date(Date.UTC(year,month,Date));
     }else if(period==="weekly"){
         if(day===0){
            day = 7;
         }
         startDate =  new Date(date);
         startDate.setDate(Date - (currentDay - 1) - 7);
         endDate = new Date(startDate);
         endDate.setDate(startDate.getDate() + 7);
     }else if(period==="monthly"){
        startDate = new Date(Date.UTC(year,month-1,1));
        endDate = new Date(Date.UTC(year,month,1));
     }

     if(category === "transportation"){
        return await transportationTypeSummary(startDate,endDate,userId).distance;
     }else if(category === "electricity"){
        return await electricityTypeSummary(startDate,endDate,userId).consumption;
     }else if(category === "waste_management"){
        return await wasteTypeSummary(startDate,endDate,userId).wasteAmount;
     }else if(category === "carbon_emission"){
        return await carbonTypeSummary(startDate,endDate,userId);
     }else{
        return 0;
     }
};

module.exports = {unitMap,getBaseValue};