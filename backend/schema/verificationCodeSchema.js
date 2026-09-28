const {Schema} = require("mongoose");
const bcrypt = require("bcrypt");

const verificationCodeSchema = new Schema({
      email : {
         type : String,
         required : true,
         trim : true,
      },
      code : {
         type : String,
         required : true,
         minLength : 6,
      },
      expries : {
        type : Date,
        default : () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      }
});

verificationCodeSchema.pre("save",async function(){
   this.code = await bcrypt.hash(this.code,12);
});

module.exports = {verificationCodeSchema};