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
    var architecsName = Joi.string() 
    .regex(/^[A-Za-z\s!@#$%^&*(),.?":{}|<>]+$/)
    .trim()
    .empty()
    .required()
    .messages({
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
    const { mobileNo } = req.body;
    if (mobileNo === null || mobileNo === undefined || mobileNo === '') {
        return res.status(400).json({
            status: "fail",
            message: "Mobile Number Cannot Be Empty"
        });
    }
    const mobileNoSchema = Joi.number()
        .integer()
        .min(1000000000)
        .max(9999999999)
        .required()
        .messages({
            'number.base': 'Mobile Number Must Be A Number',
            'number.min': 'Mobile Number Must Have At Least 10 Digits',
            'number.max': 'Mobile Number Cannot Have More Than 10 Digits',
            'any.required': 'Required field: Mobile Number'
        });

    const { error: mobileNoError } = mobileNoSchema.validate(mobileNo);

    if (mobileNoError) {
        return res.status(400).json({
            status: "fail",
            message: mobileNoError.message
        });
    } else {
        next();
    }
}

exports.address = function (req, res, next) {
    var address = Joi.string().messages({
        'string.base': 'Address Must Be A String'
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

exports.password = function (req, res, next) {
    var password = Joi.string().empty().required().messages({
        'string.empty': 'password Cannot Be Empty',
        'any.required': 'required field : password',
       
    });
    var { error: passwordError } = password.validate(req.body.password);
    if (passwordError) {
        return res.status(400).json({
            status: "fail",
            message:  passwordError.message
        });
    }
    else {
        next();
    }
}
exports.login_id = function (req, res, next) {
    var login_id = Joi.string().empty().required().messages({
        'string.base': 'login Id Must Be A Number',
        'string.empty': 'login Id Cannot Be Empty',
        'any.required': 'required field : login Id',
    });
    var { error: loginidError } = login_id.validate(req.body.login_id);
    if (loginidError) {
        return res.status(400).json({
            status: "fail",
            message:  loginidError.message
        });
    }
    else {
        next();
    }
}



