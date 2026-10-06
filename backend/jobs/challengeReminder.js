const cron = require("node-cron");
const {sendDailyChallengeReminderNotification,sendWeeklyChallengeReminderNotification,sendMonthlyChallengeReminderNotification}
     = require("../service/notification/challengeNotificationService");

const sendChallengeReminder = () => {
  cron.schedule('0 0 18 * * *',async () => {
    try{
      await sendDailyChallengeReminderNotification();
      console.log("Daily goal Reminder completed");
    }catch(error){
      console.error("Daily goal Reminder failed:",error);
    }
  },
  {
     timezone: "Asia/Kolkata"
  }
 );

 cron.schedule('0 0 18 * * 7 ',async () => {
    try{
      await sendWeeklyChallengeReminderNotification();
      console.log("weekly goal Reminder completed");
    }catch(error){
      console.error("weekly goal Reminder failed:",error);
    }
  },
  {
     timezone: "Asia/Kolkata"
  }
 );

 cron.schedule('0 0 18 L * *',async () => {
    try{
      await sendMonthlyChallengeReminderNotification();
      console.log("monthly goal Reminder completed");
    }catch(error){
      console.error("monthly goal Reminder failed:",error);
    }
  },
  {
     timezone: "Asia/Kolkata"
  }
 );
};

module.exports = {sendChallengeReminder};