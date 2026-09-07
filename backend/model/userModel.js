const {model} = require("mongoose");
const {userSchema} = require("../schema/userSchema");

const userModel = model("User",userSchema);

module.exports = {userModel};