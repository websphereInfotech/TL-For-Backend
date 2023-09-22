const Joi = require('joi');

const userSchema = Joi.object({
    login_id: Joi.string().required(),
    password: Joi.string().min(6).required(),
});

exports.login_validation = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error.details.map((detail) => detail.message).join(', '),
        });
    }
    next();
};

const carpenterSchema = Joi.object({
    carpentersName: Joi.string().required(),
    mobileNo: Joi.string().min(10).required(),
    Address:Joi.string().required()
});

exports.carpentervalidation = (req, res, next) => {
    const { error } = carpenterSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error.details.map((detail) => detail.message).join(', '),
        });
    }
    next();
};