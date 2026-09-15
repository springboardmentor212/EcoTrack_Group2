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
    },
    password : {
        type : String,
        required : [true,'password is required'],
        minLength : [8,'your password must be at have least 8 character'],
    },
    location : {
        type : String,
        minlength :[3,'your password must be at have least 3 character'],
        trim : true,
        lowercase : true,
    },
    verified : {
        type : Boolean,
        default : false,
    },
    role : {
        type : String,
        enum : ['user','administrator '],
    },

    profilePhoto: {
      type: String,
      default : '../utills/user.png'
    },

  sustainabilityPreferences: [{
    type: String,
    enum: [
      "renewable energy",
      "recycling",
      "waste reduction",
      "sustainable living",
      "green transportation"
    ]
  }],

  environmentalInterests: [{
    type: String,
    enum: [
      "renewable energy",
      "recycling",
      "waste reduction"
    ]
  }],

  personalGoalPreferences: [{
    type: String,
    enum: [
      "reduce carbon",
      "reduce electricity",
      "increase recycling",
      "reduce plastic",
      "use public transport",
      "plant trees"
    ]
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