const {carbonTypeSummary,transportationTypeSummary,electricityTypeSummary,wasteTypeSummary} = require("../service/carbonActivity/typeBasisSummaryService");
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

const challengeUnitMap = (challengeType)=>{
   if(challengeType === "distance limit challenge" || challengeType === "ev travel challenge"){
     return "km";
   }else if(challengeType === "power saving month"){
     return "kwh";
   }else if(challengeType === "waste reduction week" || challengeType === "zero waste day" || challengeType === "recycle and save"){
     return "kg";
   }else if(challengeType === "carbon control challenge" || challengeType === "carbon saving challenge"){
     return "kgco2";
   }else if(challengeType ===  "cng commute challenge"){
     return "trips";
   }
};

const getBaseValue = async (date,period,category,userId) => {
     const month = new Date(date).getMonth(),year = new Date(date).getFullYear();
     const DateValue = new Date(date).getDate(),day = new Date(date).getDay();

     let startDate,endDate;
     if(period==="daily"){
        startDate =  new Date(Date.UTC(year,month,DateValue-1));
        endDate = new Date(Date.UTC(year,month,DateValue));
     }else if(period==="weekly"){
         if(day===0){
            day = 7;
         }
         startDate =  new Date(date);
         startDate.setDate(DateValue - (day - 1) - 7);
         endDate = new Date(startDate);
         endDate.setDate(startDate.getDate() + 7);
     }else if(period==="monthly"){
        startDate = new Date(Date.UTC(year,month-1,1));
        endDate = new Date(Date.UTC(year,month,1));
     }


     let typeSummary;
     if(category === "transportation"){
        typeSummary = await transportationTypeSummary(startDate,endDate,userId);
        typeSummary = typeSummary.length > 0 ? typeSummary[0].distance : 0;
    }else if(category === "electricity"){
        typeSummary = await electricityTypeSummary(startDate,endDate,userId);
        typeSummary = typeSummary.length > 0 ? typeSummary[0].consumption : 0;
     }else if(category === "waste management"){
        typeSummary = await wasteTypeSummary(startDate,endDate,userId);
        typeSummary = typeSummary.length > 0 ? typeSummary[0].wasteAmount : 0;
     }else if(category === "carbon emission"){
        typeSummary = await carbonTypeSummary(startDate,endDate,userId);
        typeSummary = typeSummary.length > 0 ? typeSummary[0] : 0;
     }else{
        typeSummary = 0;
     }
     return typeSummary;
};

module.exports = {unitMap,challengeUnitMap,getBaseValue};