const Joi = require('joi');

exports.carpenter_Name = function (req, res, next) {
    var carpentersName = Joi.string().trim() .regex(/^[A-Za-z\s!@#$%^&*(),.?":{}|<>]+$/).empty().required().messages({
        'string.base': 'Carpenter Name Must Be String',
        'string.empty': 'Carpenter Name Cannot Be Empty',
        'any.required': 'required field : Carpenter Name',
        'string.pattern.base': 'Carpenter Name Must Contain Only Letters (Uppercase or lowercase)'
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
    var shopName = Joi.string().trim().empty().required().messages({
        'string.base': 'Shop Name Must Be String',
        'string.empty': 'Shop Name Cannot Be Empty',
        'any.required': 'required field : Shop Name',
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
        'string.base': 'Architecture Name Must Be String',
        'string.empty': 'Architecture Name Cannot Be Empty',
        'any.required': 'required field : Architecture Name',
        'string.pattern.base': 'Architecture Name Must Contain Only Letters (Uppercase or lowercase)'
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
        'string.empty': 'Mobile Number Cannot Be Empty',
      'string.pattern.base': 'Nobile Number Must Be A 10 Digit Number',
        'any.required': 'required field : Mobile Number',
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
        'string.base': 'Address Must Be A String',
        'string.empty': 'Address Cannot Be Empty',
        'any.required': 'required field : Address',
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
        'string.base': 'User Name Must Be String',
        'string.empty': 'User Name Cannot Be Empty',
        'any.required': 'required field : User Name',
        'string.pattern.base': 'User Name Must Contain Only Letters (Uppercase or lowercase)'
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
        'number.base': 'Serial Numbner Must Be A Number',
        'string.empty': 'Serial Number Cannot Be Empty',
        'any.required': 'required field : Serial Number',
        'string.pattern.base': 'Serial Number Must Contain Only Numeric Characters',
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
        'number.base': 'Rate Must Be A Number',
        'string.empty': 'Rate Cannot Be Empty',
        'any.required': 'required field : Rate',
        'string.pattern.base': 'Rate  Must Contain Only Numeric Characters',

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
        'string.base': 'Description Must Be A String',
        'string.empty': 'Description Cannot Be Empty',
        'any.requireD': 'required field : Description',
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
        'number.base': 'Quantity Must Be A Number',
        'string.empty': 'Quantity Cannot Be Empty',
        'any.required': 'required field : Quantity',
        'string.pattern.base': 'Quantity Must Contain Only Numeric Characters',
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




