module.exports.generateOtp = () => {
   return parseInt(Math.floor(100000 + Math.random() * 900000)).toString();
}