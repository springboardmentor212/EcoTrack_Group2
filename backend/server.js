require("dotenv").config();
const Express = require("express");
const app = Express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors  = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
const url = process.env.MONGO_URL;

app.use(cors({
        origin : process.env.Frontend_URL,
        methods : ["GET","POST","PUT","DELETE","PATCH"],
        credentials : true,
}));

app.use(Express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.set("trust proxy",1);

const userRouter = require("./router/user");
const profileRouter = require("./router/profile");
const carbonRouter = require("./router/carbonActivity");
const goalRouter = require("./router/goal");
const notificationRouter = require("./router/notification");
const challengeRouter = require("./router/challenge");
const adminRouter = require("./router/admin");

const {sendDailyGoalSuggestion,sendGoalReminder} = require("./jobs/goalSuggestionAndGoalReminder");
const {updateChallengesStatus} = require("./jobs/challengeUpdate");
const {sendChallengeReminder} = require("./jobs/challengeReminder");

const {sendGoalSuggestion,sendDailyGoalReminderNotification,
       sendWeeklyGoalReminderNotification,sendMonthlyGoalReminderNotification} = require("./service/notification/goalNotificationService");
const {sendDailyChallengeReminderNotification,sendWeeklyChallengeReminderNotification,sendMonthlyChallengeReminderNotification}
     = require("./service/notification/challengeNotificationService");
const {updateAllChallengesStatus} = require("./service/challenge/challengesStatus");

async function main(){
        await mongoose.connect(url);
}

main().then(()=>{
   console.log("connected");
}).catch(err => {
    console.log(err);
});

sendDailyGoalSuggestion();
sendGoalReminder();
updateChallengesStatus();
sendChallengeReminder();

app.use("/user",userRouter);
app.use("/profile",profileRouter);
app.use("/carbonActivity",carbonRouter);
app.use("/goal",goalRouter);
app.use("/notification",notificationRouter);
app.use("/challenge",challengeRouter);
app.use("/admin",adminRouter);

app.get("/",async (req,res)=>{
    // await sendGoalSuggestion();
    // await sendDailyGoalReminderNotification();
    // await sendWeeklyGoalReminderNotification();
    // await sendMonthlyGoalReminderNotification();
    await updateAllChallengesStatus();
    await sendDailyChallengeReminderNotification();
    // await sendWeeklyChallengeReminderNotification();
    // await sendMonthlyChallengeReminderNotification();
    res.send("work complete");
});
app.listen(port,()=>{
   console.log(`Server is running on port ${port}`);
});

