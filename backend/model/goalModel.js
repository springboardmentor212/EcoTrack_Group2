const {model} = require("mongoose");
const {goalSchema} = require("../schema/goalSchema");

const goalModel = model("Goal",goalSchema);

module.exports = {goalModel};