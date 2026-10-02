const {carbonTypeSummary,transportationTypeSummary,electricityTypeSummary,wasteTypeSummary} = require("./typeBasisSummaryService");
const {getSummaryDaysBasis,getSummaryWeekBasis,getSummaryMonthBasis} = require("./durationBasisSummaryService");

module.exports.getSummary = async(type,duration,userId) => {
   const month = new Date().getUTCMonth(),year = new Date().getUTCFullYear();
   let startDate,endDate,durationSummary,typeSummary; 

   if(duration==="day" && type!=="electricity"){
       startDate = new Date(Date.UTC(year,month,1));
       endDate = new Date(Date.UTC(year,month + 1,1));
       durationSummary =  await getSummaryDaysBasis(type,userId,startDate,endDate);
   }else if(duration==="week" && type!=="electricity"){
       startDate = new Date(Date.UTC(year,month,1));
       endDate = new Date(Date.UTC(year,month + 1,1));
       durationSummary =  await getSummaryWeekBasis(type,userId,startDate,endDate);
   }else if(duration==="month" && type==="electricity"){
       startDate = new Date(Date.UTC(year,month,1));
       endDate = new Date(Date.UTC(year,month + 1,1));
       durationSummary =  await getSummaryMonthBasis(type,userId,startDate,endDate);
   }else if(duration==="3months"){
       startDate = new Date(Date.UTC(year,month - 3 ,1));
       endDate = new Date(Date.UTC(year,month,1));
       durationSummary =  await getSummaryMonthBasis(type,userId,startDate,endDate);
   }else if(duration==="year"){
       startDate = new Date(Date.UTC(year,0,1));
       endDate = new Date(Date.UTC(year + 1,0,1));
       durationSummary = await getSummaryMonthBasis(type,userId,startDate,endDate);
   }else{
       durationSummary = [{}];
   }


   if(type==="carbon"){
       typeSummary = await carbonTypeSummary(startDate,endDate,userId);
   }else if(type==="transportation"){
       typeSummary = await transportationTypeSummary(startDate,endDate,userId);
   }else if(type==="electricity"){
       typeSummary = await electricityTypeSummary(startDate,endDate,userId);
   }else if(type==="waste"){
       typeSummary = await wasteTypeSummary(startDate,endDate,userId);
   }else{
       typeSummary = [{}];
   }
   
   return {typeSummary : typeSummary[0],durationSummary : durationSummary[0]};
}