require("dotenv").config();
const jwt = require("jsonwebtoken");

const secreatToken = (id,email) => {
   return  jwt.sign({id,email} , process.env.Token_key , {expiresIn : 7 * 24 * 60 * 60});
};

module.exports = {secreatToken};