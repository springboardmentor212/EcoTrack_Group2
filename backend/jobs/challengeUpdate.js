const cron = require("node-cron");

const {updateAllChallengesStatus} = require("../service/challenge/challengesStatus");

const updateChallengesStatus = () => {
  cron.schedule('0 2 0 * * *', async() => {
    try{
      await updateAllChallengesStatus();
      console.log("Daily challenge update completed");
    }catch(error){
      console.error("Daily challenge update failed:",error);
    }
  },
  {
    timezone: "Asia/Kolkata"
  }
 );
};

module.exports = {updateChallengesStatus};