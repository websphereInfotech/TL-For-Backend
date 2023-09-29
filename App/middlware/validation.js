const Joi = require('joi');

exports.carpenter_Name = function (req, res, next) {
    var carpentersName = Joi.string().trim() .regex(/^[A-Za-z\s!@#$%^&*(),.?":{}|<>]+$/).empty().required().messages({
        'string.base': 'carpentersName must be a string',
        'string.empty': 'carpentersName cannot be empty',
        'any.required': 'required field:carpentername',
        'string.pattern.base': 'carpentersname must contain only letters (uppercase or lowercase)'
    });
    var { error: carpentersNameError } = carpentersName.validate(req.body.carpentersName);
    if (carpentersNameError) {
        return res.status(400).json({
            status: "fail",
            message:  carpentersNameError.message
        });
    }
    else {
        next();
    }
}
exports.shopsName = function (req, res, next) {
    var shopName = Joi.string() .regex(/^[A-Za-z\s!@#$%^&*(),.?":{}|<>]+$/).trim().empty().required().messages({
        'string.base': 'shopName must be a string',
        'string.empty': 'shopName cannot be empty',
        'any.required': 'required field:shopName',
        'string.pattern.base': 'shopname must contain only letters (uppercase or lowercase)'
    });
    var { error: shopNameError } = shopName.validate(req.body.shopName);
    if (shopNameError) {
        return res.status(400).json({
            status: "fail",
            message:shopNameError.message
        });
    }
    else {
        next();
    }
}
exports.arcitecsname = function (req, res, next) {
    var architecsName = Joi.string() .regex(/^[A-Za-z\s!@#$%^&*(),.?":{}|<>]+$/).trim().empty().required().messages({
        'string.base': 'architecsName must be a string',
        'string.empty': 'architecsName cannot be empty',
        'any.required': 'required field:architecsName',
        'string.pattern.base': 'architecsName must contain only letters (uppercase or lowercase)'
    });
    var { error: architecsNameError } = architecsName.validate(req.body.architecsName);
    if (architecsNameError) {
        return res.status(400).json({
            status: "fail",
            message: architecsNameError.message
        });
    }
    else {
        next();
    }
}
exports.mobileNo = function (req, res, next) {
    var mobileNo = Joi.string().regex(/^[0-9]{10}$/).trim().empty().required().messages({
        'string.base': 'mobileNo must be a string',
        'string.empty': 'mobileNo cannot be empty',
      'string.pattern.base': 'mobileNo must be a 10-digit number',
        'any.required': 'required field:mobilNumber',
    });
    var { error: mobileNoError } = mobileNo.validate(req.body.mobileNo);
    if (mobileNoError) {
        return res.status(400).json({
            status: "fail",
            message:  mobileNoError.message
        });
    }
    else {
        next();
    }
}
exports.address = function (req, res, next) {
    var address = Joi.string().trim().empty().required().messages({
        'string.base': 'address must be a string',
        'string.empty': 'address cannot be empty',
        'any.required': 'required field:address',
    });
    var { error: addressError } = address.validate(req.body.address);
    if (addressError) {
        return res.status(400).json({
            status: "fail",
            message:  addressError.message
        });
    }
    else {
        next();
    }
}
exports.userName = function (req, res, next) {
    var userName = Joi.string() .regex(/^[A-Za-z\s!@#$%^&*(),.?":{}|<>]+$/).trim().empty().required().messages({
        'string.base': 'userName must be a string',
        'string.empty': 'userName cannot be empty',
        'any.required': 'required field:userName',
        'string.pattern.base': 'userName must contain only letters (uppercase or lowercase)'
    });
    var { error: userNameError } = userName.validate(req.body.userName);
    if (userNameError) {
        return res.status(400).json({
            status: "fail",
            message:  userNameError.message
        });
    }
    else {
        next();
    }
}

exports.serialNumber = function (req, res, next) {
    var serialNumber = Joi.string().empty().required().regex(/^\d+$/).messages({
        'number.base': 'serialnumbner must be a number',
        'string.empty': 'serialNumber cannot be empty',
        'any.required': 'required field:serialNumber',
        'string.pattern.base': 'serialNumber must contain only numeric characters',
    });
    var { error: serialNumberError } = serialNumber.validate(req.body.serialNumber);
    if (serialNumberError) {
        return res.status(400).json({
            status: "fail",
            message:  serialNumberError.message
        });
    }
    else {
        next();
    }
}
exports. rate = function (req, res, next) {
    var rate = Joi.string().empty().required().regex(/^\d+$/).messages({
        'number.base': 'rate must be a number',
        'string.empty': 'rate cannot be empty',
        'any.required': 'required field:rate',
        'string.pattern.base': 'rate must contain only numeric characters',

    });
    var { error: rateError } = rate.validate(req.body.rate);
    if (rateError) {
        return res.status(400).json({
            status: "fail",
            message: rateError.message
        });
    }
    else {
        next();
    }
}
exports.description = function (req, res, next) {
    var description = Joi.string().empty().required().messages({
        'string.base': 'description must be a string',
        'string.empty': 'description cannot be empty',
        'any.required': 'required field:description',
    });
    var { error: descriptionError } = description.validate(req.body.description);
    if (descriptionError) {
        return res.status(400).json({
            status: "fail",
            message:  descriptionError.message
        });
    }
    else {
        next();
    }
}
exports.quantity = function (req, res, next) {
    var quantity = Joi.string().empty().regex(/^\d+$/).required().messages({
        'number.base': 'quantity must be a number',
        'string.empty': 'quantity cannot be empty',
        'any.required': 'required field:quantity',
        'string.pattern.base': 'quantity must contain only numeric characters',
    });
    var { error: quantityError } = quantity.validate(req.body.quantity);
    if (quantityError) {
        return res.status(400).json({
            status: "fail",
            message:  quantityError.message
        });
    }
    else {
        next();
    }
}
const validateSchema = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error.details.map((detail) => detail.message).join(', '),
        });
    }
    next();
};

const userSchema = Joi.object({
    login_id: Joi.string().required(),
    password: Joi.string().min(6).max(10).required(),
});

exports.loginValidation = validateSchema(userSchema);




