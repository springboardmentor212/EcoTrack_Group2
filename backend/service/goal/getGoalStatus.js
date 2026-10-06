const {utcDates} = require("../../utills/getDate");
const {getGoalTrackingData} = require("./getGoalTrackingData");

module.exports.getGoalStatus = async (goal) => {
    const {startDate,endDate,goalDirection} = goal;
    let currDay = new Date().setDate(new Date().getDate());
    currDay = utcDates(currDay);
      if (currDay < startDate) {
        return "active";
    }
    
  
    const {values,goalValue} = await getGoalTrackingData(goal);

    let hasMissingEntry = false;

    for (const value of values) {

        // Activity enter नहीं हुई
        if (value === -1 || value === undefined) {

            hasMissingEntry = true;
            continue;
        }

        // Maximum
        if (
            goalDirection === "maximum" &&
            value > goalValue
        ) {
            return "failed";
        }

        // Minimum
        if (
            goalDirection === "minimum" &&
            value < goalValue
        ) {
            return "failed";
        }
    }

    // ----------------------------------
    // Final status
    // ----------------------------------

   if (endDate <= currDay) {
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