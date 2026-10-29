const {userModel} = require("../../model/userModel");
const {goalModel} = require("../../model/goalModel");
const {notificationModel} = require("../../model/notificationModel");
const {userNotificationModel} = require("../../model/userNotificationModel");
const {checkNothaveEntryForChallenge} = require("./checkNothaveEntry");
const {challengeModel} = require("../../model/challengeModel");
const {getCurrentDayDates,getCurrentWeekDates,getCurrentMonthDates} = require("../../utills/getDate");

const matchingChallenge = async (user,challenge) => {
  const sustainabilityPreferences = user.sustainabilityPreferences;
  
  if(!sustainabilityPreferences || sustainabilityPreferences.length === 0){
        return false;
  }

  if((challenge.period === "daily" || challenge.challengeType === "zero waste day") 
        && user.sustainabilityPreferences.includes("small daily changes")){
       return true;
  }

  if((challenge.period === "weekly" || challenge.challengeType === "waste reduction week")
         && user.sustainabilityPreferences.includes("weekly challenges")){
       return true;
  }

  if((challenge.challengeType === "carbon control challenge" ||
      challenge.challengeType === "carbon saving challenge"
  ) && user.sustainabilityPreferences.includes("reduce emissions")){
       return true;
  }

  if((challenge.challengeType === "waste reduction week" || challenge.challengeType === "zero waste day")
        && user.sustainabilityPreferences.includes("reduce wastes")){
       return true;
  }
    
  if(challenge.challengeType === "recycle and save" && user.sustainabilityPreferences.includes("sustainable waste disposal")){
       return true;
  }

  if((challenge.challengeType === "distance limit challenge" || 
      challenge.challengeType === "ev travel challenge" || 
      challenge.challengeType === "cng commute challenge"   
  )&& user.sustainabilityPreferences.includes("sustainable travel")){
       return true;
  }

  if(challenge.challengeType === "power saving month" && user.sustainabilityPreferences.includes("sustainable efficient electricity")){
       return true;
  }

  const query = {
      userId : user._id,
      category : challenge.category,
      period : challenge.period
  };

  if(challenge.category === "carbon emission"){
      query.trackingType = challenge.trackingType;
  }

  const goals = await goalModel.find(query);

  if(goals && goals.length > 0){
        return true;
  }
  return false;
};


const sendChallengeSuggestion = async (challenge) => {
   const notification = await notificationModel.create({
        type : "challenge suggestion",
        title : "A New Challenge for You",
        message : `Ready for a new challenge? ${challenge.title} is waiting for you! Join now and make a difference.`,
        relatedId : challenge._id,
        action : "join challenge"
   });

   const users = await userModel.find({role : "user" , isBlocked : false,verified : true,  
                  "notificationPreference.challengeSuggestion" : true
                 }).select("_id sustainabilityPreferences");;
   
   for(const user of users){
        const match = await matchingChallenge(user,challenge);

        if(match){
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
   }
};

const sendUpdateChallengeNotification = async (challenge) => {
   const notification = await notificationModel.create({
        type : "challenge information",
        title : "Challenge Details Updated",
        message : `"${challenge.title}" has been updated. Please check the latest challenge details and stay on track!`,
        relatedId : challenge._id,
        action : "informational notification"
   });

   const users = await userModel.find({role : "user",isBlocked : false,verified : true,
                      "notificationPreference.updates" : true
                  }).select("_id sustainabilityPreferences joinChallenges");;
   
   for(const user of users){
        const match = await matchingChallenge(user,challenge);

        if(match || (user.joinChallenges && user.joinChallenges.some(ch => ch.challengeId.toString() === challenge._id.toString()))){
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
   }
};

const sendDeleteChallengeNotification = async (challenge) => {
   const notification = await notificationModel.create({
        type : "challenge information",
        title : "Challenge Deleted",
        message : `The challenge "${challenge.title}" has been deleted and is no longer available.`,
        relatedId : null,
        action : "informational notification"
   });

   const userIds = await userModel.distinct("_id", {
      role : "user", isBlocked : false,verified : true,
      "notificationPreference.updates" : true,
      "joinChallenges.challengeId" : challenge._id
   });

   for(const userId of userIds){
      await userNotificationModel.findOneAndUpdate(
          {
               userId,
               notificationId: notification._id
          },
          {
               $setOnInsert: {
                    userId,
                    notificationId: notification._id
              }
          },
          {
               upsert: true,
               returnDocument: 'after' 
          }
     );  
   };
};

//challenge Remainder
const sendDailyChallengeReminderNotification = async() => {
    const users = await userModel.find({role : "user" , isBlocked : false,verified : true,
                        "notificationPreference.challengeReminder" : true});
    const {dayStart,dayEnd} = getCurrentDayDates();

    for(const user of users){
     const userChallenge = user.joinChallenges.filter(ch => ch.status !== "completed" && ch.status !== "cancelled");
     const userChallengeId = userChallenge.map(ch => ch.challengeId);
     const dailyChallenge = await challengeModel.find(
          {
            _id : {
               $in : userChallengeId
            }, 
            period : "daily" ,
            status : "ongoing",
            startDate : {$lt : dayStart},
            endDate : {$gte : dayEnd},
          });

      if(!dailyChallenge || dailyChallenge.length==0){
        continue;
      }

      const notHaveActivityChallenge = (await Promise.all(
         dailyChallenge.map(async (challenge) => {
         const notHaveEntry = await checkNothaveEntryForChallenge(user._id,challenge, dayStart, dayEnd, "day");
         return notHaveEntry ? challenge : null;
      }))).filter(Boolean);

      const challengeTitles = notHaveActivityChallenge.map(challenge => challenge.title);
      if(!challengeTitles || challengeTitles.length === 0){
        continue;
      }
      const message = `Don't forget to add today's activity for challenges ${challengeTitles.join(",")}" to keep your challenge up to date.`
    
      const notification = await notificationModel.create({
        type : "challenge reminder",
        title : "Daily challenge Reminder",
        message,
        action : "entry activity",
      });

      if(!notification){
        console.log("Notification creation for daily challenge reminder failed for user:", user._id);
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

const sendWeeklyChallengeReminderNotification = async() => {
    const users = await userModel.find({role : "user", isBlocked : false ,verified : true,
                         "notificationPreference.challengeReminder" : true
    });
    const {weekStart, weekEnd} = getCurrentWeekDates();

    for(const user of users){
     const userChallenge = user.joinChallenges.filter(ch => ch.status !== "completed" && ch.status !== "cancelled");
     const userChallengeId = userChallenge.map(ch => ch.challengeId);
     const weeklyChallenge = await challengeModel.find(
          {
            _id : {
               $in : userChallengeId
            }, 
            period : "weekly" ,
            status : "ongoing",
            startDate : {$lt : weekStart},
            endDate : {$gte : weekEnd},
          });

      if(!weeklyChallenge || weeklyChallenge.length==0){
        continue;
      }

      const notHaveActivityChallenge = (await Promise.all(
         weeklyChallenge.map(async (challenge) => {
         const notHaveEntry = await checkNothaveEntryForChallenge(user._id,challenge, weekStart, weekEnd, "week");
         return notHaveEntry ? challenge : null;
      }))).filter(Boolean);

      const challengeTitles = notHaveActivityChallenge.map(challenge => challenge.title);
      if(!challengeTitles || challengeTitles.length === 0){
        continue;
      }
      const message = `Log your latest activities for ${challengeTitles.join(",")} challenges to keep your weekly challenge progress up to date.`
    
      const notification = await notificationModel.create({
        type : "challenge reminder",
        title : "Your Weekly challenge Awaits",
        message,
        action : "entry activity",
      });

      if(!notification){
        console.log("Notification creation for weekly challenge reminder failed for user:", user._id);
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

const sendMonthlyChallengeReminderNotification = async() => {
    const users = await userModel.find({role : "user", isBlocked : false ,verified : true,
                   "notificationPreference.challengeReminder" : true
    });
    const {monthStart, monthEnd} = getCurrentMonthDates();

    for(const user of users){
     const userChallenge = user.joinChallenges.filter(ch => ch.status !== "completed" && ch.status !== "cancelled");
     const userChallengeId = userChallenge.map(ch => ch.challengeId);
     const monthlyChallenge = await challengeModel.find(
          {
            _id : {
               $in : userChallengeId
            }, 
            period : "monthly" ,
            status : "ongoing",
            startDate : {$lt : monthStart},
            endDate : {$gte : monthEnd},
          });

      if(!monthlyChallenge || monthlyChallenge.length==0){
        continue;
      }

      const notHaveActivityChallenge = (await Promise.all(
         monthlyChallenge.map(async (challenge) => {
         const notHaveEntry = await checkNothaveEntryForChallenge(user._id,challenge, monthStart, monthEnd, "month");
         return notHaveEntry ? challenge : null;
      }))).filter(Boolean);

      const challengeTitles = notHaveActivityChallenge.map(challenge => challenge.title);
      if(!challengeTitles || challengeTitles.length === 0){
        continue;
      }
      
      const message = `Don't forget to log your activities for ${challengeTitles.join(",")} challenge and track your progress toward your monthly challenge.`
    
      const notification = await notificationModel.create({
        type : "challenge reminder",
        title : "Keep Your Monthly challenges on Track",
        message,
        action : "entry activity",
      });

      if(!notification){
        console.log("Notification creation for monthly challenges reminder failed for user:", user._id);
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

module.exports = {sendChallengeSuggestion,sendUpdateChallengeNotification,sendDeleteChallengeNotification,
    sendDailyChallengeReminderNotification,sendWeeklyChallengeReminderNotification,sendMonthlyChallengeReminderNotification
};