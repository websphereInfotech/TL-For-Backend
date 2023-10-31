var shops = require("../model/shop.model");
var jwt = require("jsonwebtoken");
const user = require("../model/quotation.model");
const { default: mongoose } = require("mongoose");

exports.shopdetails_create = async function (req, res) {
  try {
    const { shopName, mobileNo, address } = req.body;

    const shopmobileno = await shops.findOne({ mobileNo });
    if (shopmobileno) {
      return res.status(400).json({
        status: "Fail",
        message: "Mobile Number already exist",
      });
    }
    const shopData = await shops.create({
      shopName: shopName,
      mobileNo: mobileNo,
      address: address,
    });
    console.log(shopData);
    const payload = {
      id: shopData._id,
      shopName: shopName,
      mobileNo: mobileNo,
      address: address,
    };
    let token = jwt.sign(payload, process.env.KEY, { expiresIn: "1d" });

    res.status(200).json({
      status: "Success",
      message: "Shop Create Successfully",
      data: shopData,
      token: token,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
//==============================================================UPDATE DATA============================================================
exports.shopdetails_update = async function (req, res, next) {
  try {
    const { shopName, mobileNo, address } = req.body;
    const updateshopdata = {
      shopName: shopName,
      mobileNo: mobileNo,
      ddress: address,
    };
    const shopdata = await shops.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: updateshopdata },
      { new: true }
    );
    if (!shopdata) {
      return res.status(400).json({
        status: "Fail",
        message: "user not found",
      });
    }
    res.status(200).json({
      status: "Success",
      message: " Shop Data Update Successfully",
      data: shopdata,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: "user not found",
    });
  }
  next();
};
//===============================================================DELETE DATA====================================================================
exports.shopdetails_delete = async function (req, res) {
  try {
    const shopdatadelete = await shops.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!shopdatadelete) {
      return res.status(400).json({
        status: "Fail",
        message: "user not found",
      });
    }
    res.status(200).json({
      status: "Sucess",
      message: "user delete sucessfully",
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: "user not found",
    });
  }
};
//========================================================================VIEW DATA=========================================================
exports.shopdetails_viewdata = async function (req, res) {
  try {
    const shopviewdata = await shops.findById({ _id: req.params.id });
    if (!shopviewdata) {
      return res.status(401).json({
        status: "Fail",
        message: "Quotation not found",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Shop Fetch successFully",
      data: shopviewdata,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
//========================================================================LIST DATA=========================================================
exports.shopdetails_listdata = async function (req, res) {
  try {
    const shopId = req.params.id;

    const usersConnectedToShop = await user.aggregate([
      {
        $match: {
          shop: new mongoose.Types.ObjectId(shopId),
        },
      },
      {
        $lookup: {
          from: "shops",
          localField: "shop",
          foreignField: "_id",
          as: "shopDetails",
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
    ]);

    if (usersConnectedToShop.length === 0) {
      return res.status(404).json({
        status: "Fail",
        message: "No users connected to the shop",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "get all data",
      data: usersConnectedToShop,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

//================================================================SHOP SEARCH DATA==========================================================
exports.shopsdetails_searchdata = async function (req, res) {
  try {
    let matchField = {};

    if (req.query.shopName) {
      matchField.shopName = new RegExp(req.query.shopName, "i");
    }
    // console.log(matchField);
    if (req.query.serialNumber) {
      matchField.serialNumber = parseInt(req.query.serialNumber);
    }

    const searchData = await shops
      .aggregate([
        {
          $match: matchField,
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "shop",
            as: "shopData",
          },
        },
        {
          $project: {
            __v: 0,
            "shopData.__v": 0,
          },
        },
      ])
      .exec();

    // if (!searchData || searchData.length === 0) {
    //   return res.status(404).json({
    //     status: "Success",
    //     data: [ ]
    //   });
    // }
    res.status(200).json({
      status: "Success",
      message: "Fetch Data Successfully",
      data: searchData,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
//=====================================================================list============================================================
exports.shoplist = async function (req, res, next) {
  try {
    const shoplist = await shops.find();
    const listdata = await shops.find();
    var Datacount = listdata.length;
    res.status(200).json({
      status: "Success",
      message: "get all data",
      count: Datacount,
      data: shoplist,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
