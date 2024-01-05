var jwt = require("jsonwebtoken");
var moment = require("moment");
const user = require("../model/quotation.model");
const shops = require("../model/shop.model");
const carpenter = require("../model/carpenter.model");
const architec = require("../model/architec.model");
const Follow = require("../model/follow.model");
const Total = require("../model/total.model");
const { default: mongoose } = require("mongoose");

// ==========================================CREATE DATA==================================================================
exports.quotation_create = async function (req, res) {
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
      addtotal,
    } = req.body;

    const checkserialno = await user.findOne({ serialNumber });
    if (checkserialno) {
      return res.status(400).json({
        status: "Fail",
        message: "Token Number Already Exist",
      });
    }

    const userData = await user.create({
      userName,
      mobileNo,
      address,
      serialNumber,
      Date: Date,
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
    if (!addtotal) {
      return res.status(400).json({
        status: "Fail",
        message: "Required Field of Total",
      });
    }
    const addTotalData = addtotal.map((item) => ({
      user_id: userData._id,
      ...item,
    }));
    // console.log(addTotalData);
    const totalOfAll = await Total.create(addTotalData);
    // console.log(totalOfAll);
    // console.log(userData);
    // console.log(userData.totalOfAll);
    const payload = {
      id: userData._id,
      userName: userName,
      mobileNo: mobileNo,
      address: address,
      serialNumber: serialNumber,
      Date: Date,
      sales: sales,
      architec: architec,
      carpenter: carpenter,
      shop: shop,
    };
    let token = jwt.sign(payload, process.env.KEY, { expiresIn: "1d" });

    const ResponseUserData = {
      id: userData._id,
      userName: userName,
      mobileNo: mobileNo,
      address: address,
      serialNumber: serialNumber,
      Date: Date,
      sales: sales,
      architec: architec,
      carpenter: carpenter,
      shop: shop,
      addtotal: totalOfAll,
    };
    userData.totalOfAll = totalOfAll;
    res.status(200).json({
      status: "Success",
      message: "Quotation Create Successfully",
      data: ResponseUserData,
      token: token,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

//==============================================UPDATE DATA============================================================
// exports.quotation_update = async function (req, res) {
//   try {
//     const quatationId = req.params.id;
//     console.log(quatationId);
//     const {
//       userName,
//       mobileNo,
//       address,
//       serialNumber,
//       Date,
//       sales,
//       architec,
//       carpenter,
//       shop,
//       addtotal,
//     } = req.body;

//     const updateuserdata = {
//       userName: userName,
//       mobileNo: mobileNo,
//       address: address,
//       serialNumber: serialNumber,
//       Date: Date,
//       sales: sales,
//       architecture_id: architec,
//       carpenter_id: carpenter,
//       shop_id: shop,
//     };
//     // console.log(updateuserdata);
//     const userdata = await user.findByIdAndUpdate(quatationId, updateuserdata, {
//       new: true,
//     });
//     // console.log(userdata);

//     // console.log(userdata);

//     const totalRemove = await Total.deleteMany({ user_id: quatationId });
//     const addTotalData = addtotal.map((item) => ({
//       user_id: userdata._id,
//       ...item,
//     }));
//     // console.log(addTotalData);
//     const totalOfAll = await Total.create(addTotalData);
//     const ResponseUserData = {
//       id: userdata._id,
//       userName: userName,
//       mobileNo: mobileNo,
//       address: address,
//       serialNumber: serialNumber,
//       Date: Date,
//       sales: sales,
//       architec: architec,
//       carpenter: carpenter,
//       shop: shop,
//       addtotal: totalOfAll,
//     };
//     userdata.totalOfAll = totalOfAll;
//     // console.log(userdata)

//     res.status(200).json({
//       status: "Success",
//       message: "Quotation Update Successfully",
//       data: ResponseUserData,
//     });
//   } catch (error) {
//     // console.log(error)
//     res.status(404).json({
//       status: "Fail",
//       message: "Quotation not found",
//     });
//   }
// };
exports.quotation_update = async function (req, res) {
  try {
    const quatationId = req.params.id;
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
      addtotal,
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

    // Update the user document
    const userdata = await user.findByIdAndUpdate(quatationId, updateuserdata, {
      new: true,
    });

    // Assuming the Total model has a field 'user_id' for association
    const addTotalData = addtotal.map((item) => ({
      user_id: quatationId, // Use the user's ID for association
      ...item,
    }));

    // Update the existing Total documents instead of creating new ones
    await Total.deleteMany({ user_id: quatationId });
    const totalOfAll = await Total.create(addTotalData);

    const ResponseUserData = {
      id: userdata._id,
      userName: userName,
      mobileNo: mobileNo,
      address: address,
      serialNumber: serialNumber,
      Date: Date,
      sales: sales,
      architec: architec,
      carpenter: carpenter,
      shop: shop,
      addtotal: totalOfAll,
    };

    userdata.totalOfAll = totalOfAll;

    res.status(200).json({
      status: "Success",
      message: "Quotation Update Successfully",
      data: ResponseUserData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

//==============================================DELETE DATA====================================================================
exports.quotation_delete = async function (req, res) {
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

//============================================VIEW DATA=========================================================
exports.quotation_view = async function (req, res) {
  try {
    const userviewdata = await user
      .findById({ _id: req.params.id })
      .populate("shop")
      .populate("carpenter")
      .populate("architec")
      .populate("sales");

    if (!userviewdata) {
      return res.status(400).json({
        status: "Fail",
        message: "user not found",
      });
    }
    const formattedDate = moment(userviewdata.Date).format("DD-MM-YYYY");

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
      data1: {
        ...userviewdata.toObject(),
        Date: formattedDate, // Replace Date field with the formatted date
      },
      data: usersConnectedToTotal,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

//============================================LIST DATA=========================================================
exports.quotation_list = async function (req, res) {
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
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "quatationId",
          as: "followDetails",
        },
      },
      {
        $project: {
          __v: 0,
          "shop.__v": 0,
          "carpenter.__v": 0,
          "architecture.__v": 0,
          "followDetails.__v": 0,
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

//==============================================SERCH DATA=========================================================
exports.quotation_search = async function (req, res) {
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
        $match: matchField,
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
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "quatationId",
          as: "followDetails",
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
