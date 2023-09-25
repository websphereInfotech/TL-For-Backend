const Joi = require('joi');

exports.carpenter_Name = function (req, res, next) {
    var carpentersName = Joi.string().trim().regex(/^[a-zA-Z\s]+$/).empty().required().messages({
        'string.base': 'carpentersName must be a string',
        'string.empty': 'carpentersName cannot be empty',
        'any.required': 'required field:carpentername',
        'string.pattern.base': 'lastname must contain only letters (uppercase or lowercase)'
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
    var shopName = Joi.string().regex(/^[a-zA-Z\s]+$/).trim().empty().required().messages({
        'string.base': 'shopName must be a string',
        'string.empty': 'shopName cannot be empty',
        'any.required': 'required field:shopName',
        'string.pattern.base': 'lastname must contain only letters (uppercase or lowercase)'
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
exports.arcitecsName = function (req, res, next) {
    var architecsName = Joi.string().regex(/^[a-zA-Z\s]+$/).trim().empty().required().messages({
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
    var Address = Joi.string().trim().empty().required().messages({
        'string.base': 'Address must be a string',
        'string.empty': 'Address cannot be empty',
        'any.required': 'required field:Address',
    });
    var { error: AddressError } = Address.validate(req.body.Address);
    if (AddressError) {
        return res.status(400).json({
            status: "fail",
            message:  AddressError.message
        });
    }
    else {
        next();
    }
}
exports.userName = function (req, res, next) {
    var userName = Joi.string().regex(/^[a-zA-Z\s]+$/).trim().empty().required().messages({
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

exports.architectureId = function (req, res, next) {
    var architecture_id = Joi.string().trim().empty().required().messages({
        'string.base': 'architecture_id must be a string',
        'string.empty': 'architecture_id cannot be empty',
        'any.required': 'required field:architectureId',
    });
    var { error: architecture_idError } = architecture_id.validate(req.body.architecture_id);
    if (architecture_idError) {
        return res.status(400).json({
            status: "fail",
            message:  architecture_idError.message
        });
    }
    else {
        next();
    }
}
exports.carpenterId = function (req, res, next) {
    var carpenter_id = Joi.string().trim().empty().required().messages({
        'string.base': 'carpenter_id must be a string',
        'string.empty': 'carpenter_id cannot be empty',
        'any.required': 'required field:carpenterId',
    });
    var { error: carpenter_idError } = carpenter_id.validate(req.body.carpenter_id);
    if (carpenter_idError) {
        return res.status(400).json({
            status: "fail",
            message: carpenter_idError.message
        });
    }
    else {
        next();
    }
}
exports.shopId = function (req, res, next) {
    var shop_id = Joi.string().trim().empty().required().messages({
        'string.base': 'shop_id must be a string',
        'string.empty': 'shop_id cannot be empty',
        'any.required': 'required field:shopId',
    });
    var { error: shop_idError } = shop_id.validate(req.body.shop_id);
    if (shop_idError) {
        return res.status(400).json({
            status: "fail",
            message:  shop_idError.message
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

// const carpenterSchema = Joi.object({
//     carpentersName: Joi.string(),
//     mobileNo: Joi.number().integer().min(1000000000).max(9999999999),
//     Address:Joi.string()
// });

// exports.carpenterValidation = validateSchema(carpenterSchema);

// const shopSchema = Joi.object({
//     shopName: Joi.string().required(),
//     mobileNo: Joi.number().integer().min(1000000000).max(9999999999).required(),
//     Address:Joi.string().required()
// });
// exports.shopValidation = validateSchema(shopSchema);

// const architecSchema = Joi.object({
//     architecsName: Joi.string().required(),
//     mobileNo: Joi.number().integer().min(1000000000).max(9999999999),
//     Address:Joi.string().required()
// });
// exports.architecValidation = validateSchema(architecSchema);



// const usersSchema = Joi.object({
//     userName: Joi.string().required(),
//     mobileNo: Joi.number().integer().min(1000000000).max(9999999999).required(),
//     Address:Joi.string().required(),
//     architecture_id:Joi.string().required(),
//     carpenter_id:Joi.string().required(),
//     shop_id:Joi.string().required()
// });
// exports.usersValidation = validateSchema(usersSchema);


