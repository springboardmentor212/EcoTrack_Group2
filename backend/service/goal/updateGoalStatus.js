const {getGoalStatus} = require("./getGoalStatus"); 
const {goalModel} = require("../../model/goalModel");
const {utcDates,currDates,utcStartDate} = require("../../utills/getDate");

const updateGoalStatus = async (goals) => {
   for(const goal of goals) {
      let limitDate = utcDates(goal.endDate),currDate = currDates();
      limitDate = new Date(Date.UTC(
                  limitDate.getUTCFullYear(),limitDate.getUTCMonth(),limitDate.getUTCDate() + 3,
                  23,59,59,999
              ));
                
      currDate = utcStartDate(currDate);
      
      if(goal.status === "cancelled" || currDate > limitDate){
           continue;
      }
      const status = await getGoalStatus(goal);
      if(goal.status !== status){
         const newGoal = await goalModel.findByIdAndUpdate(goal._id,{status});
         if(!newGoal){
            continue;
         }
      }
   }

   return "updated";
};

module.exports = updateGoalStatus;