const {model} = require("mongoose");
const {carbonActivitySchema} = require("../schema/carbonActivitySchema");

const carbonActivityModel = model("CarbonActivity",carbonActivitySchema);

module.exports = {carbonActivityModel};
