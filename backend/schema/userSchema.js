const {Schema} = require('mongoose');
const bcrypt = require("bcrypt");
const {carbonActivityModel} = require("../model/carbonActivityModel");

const userSchema = new Schema({
    name : {
        type : String,
        required : [true,'name is required'],
        minlength :[3,'your password must be at have least 3 character'],
        maxlength : 50,
        trim : true,
        lowercase : true,
    },
    email : {
        type : String,
        required : [true,'email is required'],
        unique : true,
        trim : true,
    },
    password : {
        type : String,
        required : [true,'password is required'],
        minLength : [8,'your password must be at have least 8 character'],
        trim : true,
    },
    location : {
        type : String,
        minlength :[3,'your password must be at have least 3 character'],
        trim : true,
        lowercase : true,
        trim : true,
    },
    verified : {
        type : Boolean,
        default : false,
    },
    role : {
        type : String,
        enum : ['user','administrator '],
        lowercase : true,
        trim : true,
    },

    profilePhoto: {
      type: String,
      default : '../utills/user.png'
    },

  sustainabilityPreferences: [{
    type: String,
    enum: [
      "small daily changes",
      "weekly challenges",
      "reduce emissions",
      "reduce wastes",
      "sustainable waste disposal",
      "sustainable travel",
      "sustainable efficient electricity",
      "carbon footprints"
    ],
    lowercase : true,
    trim : true,
  }],

  environmentalInterests: [{
    type: String,
    enum: [
     "transportation",
     "electricity",
     "waste management",
     "build sustainable habits"
    ],
    lowercase : true,
    trim : true,
  }],

  personalGoalPreferences: [{
    type: String,
    enum: [
     "short term goals",
     "long term goals",
     "measurable progress",
     "habit-based goals",
     "emission reduction goals",
     "resource-saving goals"
    ],
    lowercase : true,
    trim : true,
  }],
} , { timestamps: true });

userSchema.pre("save",async function(){
    this.password = await bcrypt.hash(this.password,12);
});

userSchema.pre("findOneAndUpdate",async function(){
    const update = this.getUpdate();
    if(update.password){
     update.password = await bcrypt.hash(update.password,12);
    }
});

userSchema.pre("findOneAndDelete",async function(){
    const userId = this.getQuery()._id; 
    await carbonActivityModel.deleteMany({userId});
});
module.exports = {userSchema};