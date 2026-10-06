const {model} = require("mongoose");
const {challengeSchema} = require("../schema/challengeSchema");

const challengeModel = model("Challenge",challengeSchema);
module.exports = {challengeModel};