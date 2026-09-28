const {utcDates} = require("../utills/getDate");
const {getGoalTrackingData} = require("../service/getGoalTrackingData");

module.exports.getGoalStatus = async (goal) => {
    const {startDate,endDate,goalDirection} = goal;
    let previousDay = new Date().setDate(new Date().getDate() - 1);
    previousDay = utcDates(previousDay);
      if (previousDay < startDate) {
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

    // पहले से कोई period missing है
    if (hasMissingEntry || values.length===0) {
        return "not have entry";
    }

    // Goal अभी चल रहा है
    if (endDate > previousDay) {
        return "active";
    }

    // Goal पूरा हो चुका है
    return "completed";
};