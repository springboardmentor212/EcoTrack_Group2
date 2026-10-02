const cron = require("node-cron");

const {sendGoalSuggestion,sendDailyGoalReminderNotification,
       sendWeeklyGoalReminderNotification,sendMonthlyGoalReminderNotification} = require("../service/notification/goalNotificationService");

const sendDailyGoalSuggestion = () => {
  cron.schedule('0 0 9 * *', async() => {
    try{
      await sendGoalSuggestion();
      console.log("Daily goal suggestion completed");
    }catch(error){
      console.error("Daily goal suggestion failed:",error);
    }
  },
  {
    timezone: "Asia/Kolkata"
  }
 );
};

const sendGoalReminder = () => {
  cron.schedule('0 0 18 * * *',async () => {
    try{
      await sendDailyGoalReminderNotification();
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
      await sendWeeklyGoalReminderNotification();
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
      await sendMonthlyGoalReminderNotification();
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
module.exports = {sendDailyGoalSuggestion,sendGoalReminder};