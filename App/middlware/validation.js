const Joi = require("joi");

exports.carpenter_Name = function (req, res, next) {
  var carpentersName = Joi.string()
    .trim()
    .regex(/^[A-Za-z\s!@#$%^&*(),.?":{}|<>]+$/)
    .empty()
    .required()
    .messages({
      "string.base": "Carpenter Name Must Be String",
      "string.empty": "Carpenter Name Cannot Be Empty",
      "any.required": "required field : Carpenter Name",
      "string.pattern.base":
        "Carpenter Name Must Contain Only Letters (Uppercase or lowercase)",
    });
  var { error: carpentersNameError } = carpentersName.validate(
    req.body.carpentersName
  );
  if (carpentersNameError) {
    return res.status(400).json({
      status: "fail",
      message: carpentersNameError.message,
    });
  } else {
    next();
  }
};
exports.shopsName = function (req, res, next) {
  var shopName = Joi.string().trim().empty().required().messages({
    "string.base": "Shop Name Must Be String",
    "string.empty": "Shop Name Cannot Be Empty",
    "any.required": "required field : Shop Name",
  });
  var { error: shopNameError } = shopName.validate(req.body.shopName);
  if (shopNameError) {
    return res.status(400).json({
      status: "fail",
      message: shopNameError.message,
    });
  } else {
    next();
  }
};
exports.arcitecsname = function (req, res, next) {
  var architecsName = Joi.string()
    .regex(/^[A-Za-z\s!@#$%^&*(),.?":{}|<>]+$/)
    .trim()
    .empty()
    .required()
    .messages({
      "string.base": "Architecture Name Must Be String",
      "string.empty": "Architecture Name Cannot Be Empty",
      "any.required": "required field : Architecture Name",
      "string.pattern.base":
        "Architecture Name Must Contain Only Letters (Uppercase or lowercase)",
    });
  var { error: architecsNameError } = architecsName.validate(
    req.body.architecsName
  );
  if (architecsNameError) {
    return res.status(400).json({
      status: "fail",
      message: architecsNameError.message,
    });
  } else {
    next();
  }
};
exports.mobileNo = function (req, res, next) {
  const { mobileNo } = req.body;
  if (mobileNo === null || mobileNo === undefined || mobileNo === "") {
    return res.status(400).json({
      status: "fail",
      message: "Mobile Number Cannot Be Empty",
    });
  }
  const mobileNoSchema = Joi.number()
    .integer()
    .min(1000000000)
    .max(9999999999)
    .required()
    .messages({
      "number.base": "Mobile Number Must Be A Number",
      "number.min": "Mobile Number Must Have At Least 10 Digits",
      "number.max": "Mobile Number Cannot Have More Than 10 Digits",
      "any.required": "Required field: Mobile Number",
    });

  const { error: mobileNoError } = mobileNoSchema.validate(mobileNo);

  if (mobileNoError) {
    return res.status(400).json({
      status: "fail",
      message: mobileNoError.message,
    });
  } else {
    next();
  }
};

exports.address = function (req, res, next) {
  var address = Joi.string().messages({
    "string.base": "Address Must Be A String",
    "string.empty": "Address Can Not Be Empty",
  });
  var { error: addressError } = address.validate(req.body.address);
  if (addressError) {
    return res.status(400).json({
      status: "fail",
      message: addressError.message,
    });
  } else {
    next();
  }
};
exports.userName = function (req, res, next) {
  var userName = Joi.string()
    .regex(/^[A-Za-z\s!@#$%^&*(),.?":{}|<>]+$/)
    .trim()
    .empty()
    .required()
    .messages({
      "string.base": "User Name Must Be String",
      "string.empty": "User Name Cannot Be Empty",
      "any.required": "required field : User Name",
      "string.pattern.base":
        "User Name Must Contain Only Letters (Uppercase or lowercase)",
    });
  var { error: userNameError } = userName.validate(req.body.userName);
  if (userNameError) {
    return res.status(400).json({
      status: "fail",
      message: userNameError.message,
    });
  } else {
    next();
  }
};
exports.serialNumber = function (req, res, next) {
  const serialNumber = Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": "Serial Number must be a string",
      "string.empty": "Serial Number cannot be empty",
      "any.required": "Required field: Serial Number",
    });

  const { error: serialNumberError } = serialNumber.validate(
    req.body.serialNumber
  );

  if (serialNumberError) {
    return res.status(400).json({
      status: "fail",
      message: serialNumberError.message,
    });
  }
  next();
};


exports.password = function (req, res, next) {
  var password = Joi.string().empty().required().messages({
    "string.empty": "password Cannot Be Empty",
    "any.required": "required field : password",
  });
  var { error: passwordError } = password.validate(req.body.password);
  if (passwordError) {
    return res.status(400).json({
      status: "fail",
      message: passwordError.message,
    });
  } else {
    next();
  }
};
exports.login_id = function (req, res, next) {
  var login_id = Joi.string().empty().required().messages({
    "string.base": "login Id Must Be A Number",
    "string.empty": "login Id Cannot Be Empty",
    "any.required": "required field : login Id",
  });
  var { error: loginidError } = login_id.validate(req.body.login_id);
  if (loginidError) {
    return res.status(400).json({
      status: "fail",
      message: loginidError.message,
    });
  } else {
    next();
  }
};

// total
// exports.description = function (req, res, next) {
//   var description = Joi.string().empty().required().messages({
//     "string.base": "Description Must Be A String",
//     "string.empty": "Description Cannot Be Empty",
//     "any.required": "required field : Description",
//   });
//   var { error: descriptionError } = description.validate(req.body.description);
//   if (descriptionError) {
//     return res.status(400).json({
//       status: "fail",
//       message: descriptionError.message,
//     });
//   } else {
//     next();
//   }
// };

// exports.quantity = function (req, res, next) {
//   var quantity = Joi.string().empty().regex(/^\d+$/).required().messages({
//     "string.base": "Quantity Must Be A Number",
//     "string.empty": "Quantity Cannot Be Empty",
//     "any.required": "required field : Quantity",
//     "string.pattern.base": "Quantity Must Contain Only Numeric Characters",
//   });
//   var { error: quantityError } = quantity.validate(req.body.quantity);
//   if (quantityError) {
//     return res.status(400).json({
//       status: "fail",
//       message: quantityError.message,
//     });
//   } else {
//     next();
//   }
// };

// exports.area = function (req, res, next) {
//   var area = Joi.string().empty().required().message({
//     "string.base": "area Must Be A Number",
//     "string.empty": "area Cannot Be Empty",
//     "any.required": "required field : area",
//   });
//   var { error: areaError } = area.validate(req.body.area);
//   if (areaError) {
//     return res.status(400).json({
//       status: "fail",
//       message: areaError.message,
//     });
//   } else {
//     next();
//   }
// };

// exports.size = function (req, res, next) {
//   var size = Joi.number().empty().required().message({
//     "number.base": "size Must Be A Number",
//     "number.empty": "size Cannot Be Empty",
//     "any.required": "required field : size",
//   });
//   var { error: sizeError } = size.validate(req.body.size);
//   if (sizeError) {
//     return res.status(400).json({
//       status: "fail",
//       message: sizeError.message,
//     });
//   } else {
//     next();
//   }
// };

// exports.totalrate = function (req, res, next) {
//   var rate = Joi.number().empty().required().message({
//     "number.base": "rate Must Be A Number",
//     "number.empty": "rate Cannot Be Empty",
//     "any.required": "required field : rate",
//   });
//   var { error: rateError } = rate.validate(req.body.rate);
//   if (rateError) {
//     return res.status(400).json({
//       status: "fail",
//       message: rateError.message,
//     });
//   } else {
//     next();
//   }
// };

// exports.total = function (req, res, next) {
//   var total = Joi.string().empty().required().message({
//     "number.base": "total Must Be A Number",
//     "number.empty": "total Cannot Be Empty",
//     "any.required": "required field : total",
//   });
//   var { error: numberError } = total.validate(req.body.total);
//   if (areaError) {
//     return res.status(400).json({
//       status: "fail",
//       message: numberError.message,
//     });
//   } else {
//     next();
//   }
// };

exports.totalcreate = function (req, res, next) {
  const dataToValidate = req.body;

  const validationSchema = Joi.object({
    user_id: Joi.string().required(),
    description: Joi.string().empty().required().messages({
      "string.base": "Description Must Be A String",
      "string.empty": "Description Cannot Be Empty",
      "any.required": "required field : Description",
    }),
    rate: Joi.number().empty().required().messages({
      "number.base": "Rate Must Be A Number",
      "number.empty": "Rate Cannot Be Empty",
      "any.required": "required field : Rate",
    }),
    quantity: Joi.number().empty().required().messages({
      "number.base": "Quantity Must Be A Number",
      "number.empty": "Quantity Cannot Be Empty",
      "any.required": "required field : Quantity",
    }),
    area: Joi.string().empty().required().messages({
      "string.base": "Area Must Be A String",
      "string.empty": "Area Cannot Be Empty",
      "any.required": "required field : Area",
    }),
    size: Joi.number().empty().required().messages({
      "number.base": "Size Must Be A Number",
      "number.empty": "Size Cannot Be Empty",
      "any.required": "required field : Size",
    }),
    total: Joi.number().empty().required().messages({
      "number.base": "Total Must Be A Number",
      "number.empty": "Total Cannot Be Empty",
      "any.required": "required field : Total",
    }),
  });

  const validationResults = dataToValidate
    .map((data, index) => {
      const { error, value } = validationSchema.validate(data);
      if (error) {
        return error.message;
      } else {
        return null;
      }
    })
    .filter((result) => result !== null);

  if (validationResults.length) {
    return res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors: validationResults,
    });
  } else {
    return next();
  }
};
