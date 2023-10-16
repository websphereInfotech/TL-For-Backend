var jwt = require("jsonwebtoken");
const user = require("../model/user.model");
const shops = require("../model/shop.model");
const carpenter = require("../model/carpenter.model");
const architec = require("../model/architec.model");
const Follow = require("../model/follow.model");
const Total = require("../model/total.model");
const { default: mongoose } = require("mongoose");

// =========================================================CREATE DATA==================================================================
exports.userdetails_create = async function (req, res) {
  try {
    const {
      userName,
      mobileNo,
      address,
      serialNumber,
      Date,
      sales,
      architec,
      carpenter,
      shop,
    } = req.body;

    const checkserialno = await user.findOne({ serialNumber });
    if (checkserialno) {
      return res.status(400).json({
        status: "Fail",
        message: "Serial Number Already Exist",
      });
    }

    const userData = await user.create({
      userName,
      mobileNo,
      address,
      serialNumber,
      Date,
      sales,
      architec,
      carpenter,
      shop,
    });
    const newQutationId = new Follow({
      quatationId: userData._id,
    });
    
    await newQutationId.save();

    await userData.save();

    const payload = {
      id: userData._id,
      userName: userName,
      mobileNo: mobileNo,
      address: address,
      serialNumber: serialNumber,
      Date: Date,
      sales: sales,
      architectureId: architec,
      carpenterId: carpenter,
      shopId: shop,
    };
    let token = jwt.sign(payload, process.env.KEY, { expiresIn: "1d" });

    res.status(200).json({
      status: "Success",
      message: "User Create Successfully",
      data: userData,
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
exports.userdetails_update = async function (req, res) {
  try {
    const {
      userName,
      mobileNo,
      address,
      serialNumber,
      Date,
      sales,
      architec,
      carpenter,
      shop,
    } = req.body;
    const updateuserdata = {
      userName: userName,
      mobileNo: mobileNo,
      address: address,
      serialNumber: serialNumber,
      Date: Date,
      sales: sales,
      architecture_id: architec,
      carpenter_id: carpenter,
      shop_id: shop,
    };
    const userdata = await user.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: updateuserdata },
      { new: true }
    );
    if (!userdata) {
      return res.status(400).json({
        status: "Fail",
        message: "user not found",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "User Update Successfully",
      data: userdata,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: "user not found",
    });
  }
};
//===============================================================DELETE DATA====================================================================
exports.userdetails_delete = async function (req, res) {
  try {
    const userdatadelete = await user.findByIdAndDelete({ _id: req.params.id });
    if (!userdatadelete) {
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
// //========================================================================VIEW DATA=========================================================
exports.userdetails_viewdata = async function (req, res) {
  try {
    const userviewdata = await user
      .findById({ _id: req.params.id })
      .populate("shop")
      .populate("carpenter")
      .populate("architec")
      .populate('sales');
    if (!userviewdata) {
      return res.status(400).json({
        status: "Fail",
        message: "user not found",
      });
    }

    const usersConnectedToTotal = await Total.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(userviewdata),
        },
      },  
      {
        $lookup: {
          from: "user",
          localField: "user_id",
          foreignField: "_id",
          as: "totalShow",
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
    ]);

    // if (usersConnectedToTotal.length === 0) {
    //   return res.status(404).json({
    //     status: "Fail",
    //     message: "No total connected to the user",
    //   });
    // }

    res.status(200).json({
      status: "Success",
      message: "get all data",
      data1: userviewdata,
      data: usersConnectedToTotal,
    });

  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
// //========================================================================LIST DATA=========================================================
exports.userdetails_listdata = async function (req, res) {
  try {
    const users = await user.aggregate([
      {
        $lookup: {
          from: "shops",
          localField: "shop",
          foreignField: "_id",
          as: "shop",
        },
      },
      {
        $lookup: {
          from: "carpenters",
          localField: "carpenter",
          foreignField: "_id",
          as: "carpenter",
        },
      },
      {
        $lookup: {
          from: "architectuers",
          localField: "architec",
          foreignField: "_id",
          as: "architecture",
        },
      },
      {
        $project: {
          __v: 0,
          "shop.__v": 0,
          "carpenter.__v": 0,
          "architecture.__v": 0,
        },
      },
    ]);
    const listdata = await user.find();
    var Datacount = listdata.length;

    res.status(200).json({
      status: "Success",
      message: "get all data",
      count: Datacount,
      data: users,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

//============================================================================SERCH DATA=========================================================
exports.userdetails_searchdata = async function (req, res) {
  try {
    // const nameField = ;
    // const serialNoField = ;

    let matchField = {};

    if (req.query.userName) {
      matchField.userName = new RegExp(req.query.userName, "i");
    }

    if (req.query.serialNumber) {
        //  matchField.serialNumber = parseInt(req.query.serialNumber);

          matchField = {
            $expr: {
              $regexMatch: {
                input: { $toString: "$serialNumber" },
                regex: req.query.serialNumber,
              },
            },
          };
        //  matchField.serialNumber =  new RegExp(req.query.serialNumber, "i")
    }
    
    const userData = await user.aggregate([
      {
        $match: matchField
      },
      {
        $lookup: {
          from: "shops",
          localField: "shop",
          foreignField: "_id",
          as: "shop",
        },
      },
      {
        $lookup: {
          from: "carpenters",
          localField: "carpenter",
          foreignField: "_id",
          as: "carpenter",
        },
      },
      {
        $lookup: {
          from: "architectuers",
          localField: "architec",
          foreignField: "_id",
          as: "architecture",
        },
      },
      {
        $lookup: {
          from: "salespeople",
          localField: "sales",
          foreignField: "_id",
          as: "salesPersonDetails",
        },
      },
      {
        $project: {
          __v: 0,
          "shop.__v": 0,
          "carpenter.__v": 0,
          "architecture.__v": 0,
        },
      },
    ]);
    res.status(200).json({
      status: "Success",
      message: "Fetch Successfully",
      data: userData,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
