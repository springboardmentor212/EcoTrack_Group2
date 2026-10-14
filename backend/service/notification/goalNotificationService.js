const {userModel} = require("../../model/userModel");
const {goalModel} = require("../../model/goalModel");
const {notificationModel} = require("../../model/notificationModel");
const {userNotificationModel} = require("../../model/userNotificationModel");
const {checkNothaveEntry} = require("./checkNothaveEntry");
const {getCurrentDayDates,getCurrentWeekDates,getCurrentMonthDates} = require("../../utills/getDate");

const getMatchingGoals = async(user) => {
   const goalInterest = user.personalGoalPreferences;
   
   if(!goalInterest || goalInterest.length===0){
       return;
   }

   const systemGoals = await goalModel.find({isSystemGoal : true});

   const matchingGoals = systemGoals.filter((goal) => {
        if((goal.period === "daily" || goal.period === "weekly") && goalInterest.includes("short term goals")){
           return true;
        }

        if(goal.period === "monthly" && goalInterest.includes("long term goals")){
           return true;
        }

        if((goal.goalType === "keep travelling distance within limit" || 
            goal.goalType === "keep electricity consumption within limit" ||
            goal.goalType === "keep waste generation within limit" || 
            goal.goalType === "keep carbon emissions within limit" || 
            goal.goalType === "increase carbon saved"
        ) && goalInterest.includes("measurable progress")){
            return true;
        }

        if(goal.category === "carbon emission" && goalInterest.includes("emission reduction goals")){
           return true;
        }

        if(goal.category === "carbon save" && goalInterest.includes("carbon saving goals")){
            return true;
        }
        
        return false;
   });

   return matchingGoals;
};

const getGoalForSuggestion = async(user) => {
    const matchingGoals = await getMatchingGoals(user);

    if(!matchingGoals || matchingGoals.length === 0){
        return;
    }

    const suggestedGoal = user.suggestedGoal || [];

    const suggestedGoalId = suggestedGoal.map(id => id.toString());
    const notSuggestedGoal = matchingGoals.filter(goal => !suggestedGoalId.includes(goal._id.toString()));
    
    if(!notSuggestedGoal || notSuggestedGoal.length===0){
        return;
    }

    const userCreatedGoal = await goalModel.find({userId : user._id});
    if(!userCreatedGoal || userCreatedGoal.length===0){
        return notSuggestedGoal;
    }

    const userGoalType = new Set(
        userCreatedGoal.map((goal) => {
            if(goal.category === "carbon emission"){
                return `${goal.goalType}|${goal.period}|${goal.trackingType}`;
            }
            return `${goal.goalType}|${goal.period}`;
        }));

   const goalForSuggestion = notSuggestedGoal.filter(goal => {
        let key;
        if(goal.category === "carbon emission"){
            key = `${goal.goalType}|${goal.period}|${goal.trackingType}`;
        }else{
            key = `${goal.goalType}|${goal.period}`;
        }

        return !userGoalType.has(key);
   });

   return goalForSuggestion;
};

const sendGoalSuggestion = async() => {
    const users = await userModel.find({role : "user" , isBlocked : false , 
                        "notificationPreference.goalSuggestion" : true });

    for(const user of users){
        const suggestGoal = await getGoalForSuggestion(user);
        if(!suggestGoal || suggestGoal.length===0){
             continue;
        }

        const goalToSuggest = suggestGoal[0];
        
        const notification = await notificationModel.findOne({
              relatedId : goalToSuggest._id,
              type : "goal suggestion" 
            });

        if(!notification){
            continue;
        }

        await userModel.findByIdAndUpdate(
          user._id,
          {
            $addToSet: {
                suggestedGoal: goalToSuggest._id
            }
          });

        await userNotificationModel.findOneAndUpdate(
        {
            userId: user._id,
            notificationId: notification._id
        },
        {
            $setOnInsert: {
                userId: user._id,
                notificationId: notification._id
            }
        },
        {
            upsert: true,
            returnDocument: 'after' 
        }
       );
    }
};


const sendDailyGoalReminderNotification = async() => {
    const users = await userModel.find({role : "user" , isBlocked : false ,
                        "notificationPreference.goalReminder" : true
    });

    const {dayStart,dayEnd} = getCurrentDayDates();
    for(const user of users){
      const dailyGoal = await goalModel.find(
          {
            userId : user._id , 
            period : "daily" ,
            status: {
              $nin: ["completed", "cancelled"]
            },
            startDate : {$lt : dayStart},
            endDate : {$gte : dayEnd},
          });

      if(!dailyGoal || dailyGoal.length==0){
        continue;
      }

      const notHaveActivityGoal = (await Promise.all(
         dailyGoal.map(async (goal) => {
         const notHaveEntry = await checkNothaveEntry(goal, dayStart, dayEnd, "day");
         return notHaveEntry ? goal : null;
      }))).filter(Boolean);

      const goalTitles = notHaveActivityGoal.map(goal => goal.title);
      if(!goalTitles || goalTitles.length === 0){
        continue;
      }
      const message = `Don't forget to add today's activity for goal ${goalTitles.join(",")}" to keep your goal up to date.`
    
      const notification = await notificationModel.create({
        type : "goal reminder",
        title : "Daily Goal Reminder",
        message,
        action : "entry activity",
      });

      if(!notification){
        console.log("Notification creation for daily goal reminder failed for user:", user._id);
        continue;
      }
      const userNotification = await userNotificationModel.findOneAndUpdate(
        {
            userId: user._id,
            notificationId: notification._id
        },
        {
            $setOnInsert: {
                userId: user._id,
                notificationId: notification._id
            }
        },
        {
            upsert: true,
            returnDocument: 'after' 
        }
       );
    }
};

const sendWeeklyGoalReminderNotification = async() => {
    const users = await userModel.find({role : "user" , isBlocked : false,
                       "notificationPreference.goalReminder" : true});
    const {weekStart, weekEnd} = getCurrentWeekDates();

    for(const user of users){
      const weeklyGoal = await goalModel.find(
          {
            userId : user._id , 
            period : "weekly" ,
            status: {
              $nin: ["completed", "cancelled"]
            },
            startDate : {$lt : weekStart},
            endDate : {$gte : weekEnd}
        });
  
      if(!weeklyGoal || weeklyGoal.length==0){
        continue;
      }

      const notHaveActivityGoal = (await Promise.all(
         weeklyGoal.map(async (goal) => {
         const notHaveEntry = await checkNothaveEntry(goal,weekStart,weekEnd,"week");
         return notHaveEntry ? goal : null;
      }))).filter(Boolean);

      const goalTitles = notHaveActivityGoal.map(goal => goal.title);
      if(!goalTitles || goalTitles.length === 0){
        continue;
      }
      const message = `Log your latest activities for ${goalTitles.join(",")} goals to keep your weekly goal progress up to date.`
    
      const notification = await notificationModel.create({
        type : "goal reminder",
        title : "Your Weekly Goal Awaits",
        message,
        action : "entry activity",
      });

      if(!notification){
        console.log("Notification creation for weekly goal reminder failed for user:", user._id);
        continue;
      }
      const userNotification = await userNotificationModel.findOneAndUpdate(
        {
            userId: user._id,
            notificationId: notification._id
        },
        {
            $setOnInsert: {
                userId: user._id,
                notificationId: notification._id
            }
        },
        {
            upsert: true,
            returnDocument: 'after' 
        }
       );
   }  
}

const sendMonthlyGoalReminderNotification = async() => {
    const users = await userModel.find({role : "user" , isBlocked : false ,
                        "notificationPreference.goalReminder" : true
    });
    const {monthStart, monthEnd} = getCurrentMonthDates();

    for(const user of users){
      const monthlyGoal = await goalModel.find(
          {
            userId : user._id , 
            period : "monthly" ,
            status: {
              $nin: ["completed", "cancelled"]
            },
            startDate : {$lt : monthStart},
            endDate : {$gte : monthEnd},
          });

      if(!monthlyGoal || monthlyGoal.length==0){
        continue;
      }

      const notHaveActivityGoal = (await Promise.all(
         monthlyGoal.map(async (goal) => {
         const notHaveEntry = await checkNothaveEntry(goal,monthStart, monthEnd,"month");
         return notHaveEntry ? goal : null;
      }))).filter(Boolean);

      const goalTitles = notHaveActivityGoal.map(goal => goal.title);
      if(!goalTitles || goalTitles.length === 0){
        continue;
      }
      const message = `Don't forget to log your activities for ${goalTitles.join(",")} goals and track your progress toward your monthly goal.`
    
      const notification = await notificationModel.create({
        type : "goal reminder",
        title : "Keep Your Monthly Goal on Track",
        message,
        action : "entry activity",
      });

      if(!notification){
        console.log("Notification creation for monthly goal reminder failed for user:", user._id);
        continue;
      }
      const userNotification = await userNotificationModel.findOneAndUpdate(
        {
            userId: user._id,
            notificationId: notification._id
        },
        {
            $setOnInsert: {
                userId: user._id,
                notificationId: notification._id
            }
        },
        {
            upsert: true,
            returnDocument: 'after' 
        }
       );
   }  
}

module.exports = {sendGoalSuggestion,sendDailyGoalReminderNotification,sendWeeklyGoalReminderNotification,sendMonthlyGoalReminderNotification};