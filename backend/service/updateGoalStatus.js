const {getGoalStatus} = require("../service/getGoalStatus"); 
const {goalModel} = require("../model/goalModel");

const updateGoalStatus = async (goals) => {
   for(const goal of goals) {
      const status = await getGoalStatus(goal);
      if(goal.status !== status){
         const newGoal = await goalModel.findByIdAndUpdate(goal._id,{status});
         if(!newGoal){
          return "not updated";
         }
      }
   }

   return "updated";
};

module.exports = updateGoalStatus;