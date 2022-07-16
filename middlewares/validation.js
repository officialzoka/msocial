const Joi = require('joi');

// Login Validation
module.exports.LoginValidation = (req, res, next) => {
    const { error } = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }).validate(req.body);
    if (error) return res.error(error.details[0].message);
    next();
};
// Register Validation
module.exports.RegisterValidation = (req, res, next) => {
    const { error } = Joi.object({
        fname: Joi.string().min(2).max(255).required(),
        lname: Joi.string().min(2).max(255).required(),
        username: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }).validate(req.body);
    if (error) return res.error(error.details[0].message);
    next();
};
module.exports.EmailValidate = (req, res, next) => {
    const { error } = Joi.object({
        email: Joi.string().email().required(),
    }).validate(req.body);
    if (error) return res.error(error.details[0].message);
    next();
};
