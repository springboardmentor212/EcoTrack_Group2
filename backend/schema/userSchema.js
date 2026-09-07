const {Schema} = require('mongoose');
const bcrypt = require("bcrypt");
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
    image : {
        url : {
            type : String,
            Default : '../utills/user.png',
        },
        filename :{
           type : String,
           Default : 'profile',
        },
    },
    verified : {
        type : Boolean,
        default : false,
    },
    role : {
        type : String,
        enum : ['user','administrator '],
    }
});

userSchema.pre("save",async function(){
    this.password = await bcrypt.hash(this.password,12);
});

userSchema.pre("findOneAndUpdate",async function(){
    const update = this.getUpdate();
    if(update.password){
     update.password = await bcrypt.hash(update.password,12);
    }
});

module.exports = {userSchema};