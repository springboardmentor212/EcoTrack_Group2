const joi = require("joi");

module.exports.loginSchema = joi.object({
      email : joi.string().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
      password : joi.string().required().min(8).pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/),
}); 

module.exports.registerSchema = joi.object({
    name : joi.string().required().min(3).pattern(/^(?=.{3,}$)[A-Za-z]+(?: [A-Za-z]+)?$/),
    email : joi.string().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
    password : joi.string().required().min(8).pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/),
    location : joi.string().required().min(3),
});

module.exports.verifyEmailSchema = joi.object({
    email : joi.string().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
    code : joi.number().integer().min(100000).max(999999).required(),
});

module.exports.resendOtpSchema = joi.object({
    email : joi.string().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
});

module.exports.resentPasswordSchema = joi.object({
    email : joi.string().required().min(5).pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/),
    password : joi.string().required().min(8).pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/),
    confirmPassword : joi.string().required().min(8).pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/),
});