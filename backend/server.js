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
const {sendDailyGoalSuggestion,sendGoalReminder} = require("./jobs/goalSuggestionAndGoalReminder");
const {sendGoalSuggestion,sendDailyGoalReminderNotification,
       sendWeeklyGoalReminderNotification,sendMonthlyGoalReminderNotification} = require("./service/notification/goalNotificationService");

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

app.use("/user",userRouter);
app.use("/profile",profileRouter);
app.use("/carbonActivity",carbonRouter);
app.use("/goal",goalRouter);
app.use("/notification",notificationRouter);

app.get("/",async (req,res)=>{
    await sendGoalSuggestion();
    await sendDailyGoalReminderNotification();
    await sendWeeklyGoalReminderNotification();
    await sendMonthlyGoalReminderNotification();
    res.send("work complete");
});
app.listen(port,()=>{
   console.log(`Server is running on port ${port}`);
});

