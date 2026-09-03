const {model} = require("mongoose");
const {verificationCodeSchema} = require("../schema/verificationCodeSchema");

const verificationCodeModel = new model("VerificationCode",verificationCodeSchema);

module.exports = {verificationCodeModel};
