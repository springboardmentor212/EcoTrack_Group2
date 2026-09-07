require("dotenv").config();
const Express = require("express");
const app = Express();
const jwt = require("jsonwebtoken");
const bcypt = require("bcrypt");
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

async function main(){
        await mongoose.connect(url);
}

main().then(()=>{
   console.log("connected");
}).catch(err => {
    console.log(err);
});

app.use("/user",userRouter);

app.listen(port,()=>{
   console.log(`Server is running on port ${port}`);
});

