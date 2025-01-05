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

    const totalOfAll = await Total.create(addTotalData);

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
      architecture_id,
      carpenter_id,
      shop_id,
      addtotal,
    } = req.body;

    const updateuserdata = {
      userName: userName,
      mobileNo: mobileNo,
      address: address,
      serialNumber: serialNumber,
      Date: Date,
      sales: sales,
      architec: architecture_id,
      carpenter: carpenter_id,
      shop: shop_id,
    };


    const userdata = await user.findOneAndUpdate(
      { _id: quatationId },
      updateuserdata,
      { new: true }
    );

    if (!userdata) {
      console.error(`No user found with ID ${quatationId}`);
      return res.status(404).json({
        status: "Fail",
        message: "Quotation not found",
      });
    }

    console.log("Updated User Data:", userdata);

    const totalRemove = await Total.deleteMany({ user_id: quatationId });

    const addTotalData = Array.isArray(addtotal)
      ? addtotal.map((item) => ({
        user_id: userdata._id,
        ...item,
      }))
      : [];

    const totalOfAll = await Total.create(addTotalData);

    // Build the response data
    const ResponseUserData = {
      id: userdata._id,
      userName: userName,
      mobileNo: mobileNo,
      address: address,
      serialNumber: serialNumber,
      Date: Date,
      sales: sales,
      architec: architecture_id,
      carpenter: carpenter_id,
      shop: shop_id,
      addtotal: totalOfAll,
    };

    userdata.totalOfAll = totalOfAll;

    console.log("Response Data:", ResponseUserData);

    res.status(200).json({
      status: "Success",
      message: "Quotation Update Successfully",
      data: ResponseUserData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
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
// exports.quotation_search = async function (req, res) {
//   try {
//     // const nameField = ;
//     // const serialNoField = ;

//     let matchField = {};

//     if (req.query.userName) {
//       matchField.userName = new RegExp(req.query.userName, "i");
//     }

//     if (req.query.serialNumber) {
//       //  matchField.serialNumber = parseInt(req.query.serialNumber);

//       matchField = {
//         $expr: {
//           $regexMatch: {
//             input: { $toString: "$serialNumber" },
//             regex: req.query.serialNumber,
//           },
//         },
//       };
//       //  matchField.serialNumber =  new RegExp(req.query.serialNumber, "i")
//     }

//     const userData = await user.aggregate([
//       {
//         $match: matchField,
//       },
//       {
//         $lookup: {
//           from: "shops",
//           localField: "shop",
//           foreignField: "_id",
//           as: "shop",
//         },
//       },
//       {
//         $lookup: {
//           from: "carpenters",
//           localField: "carpenter",
//           foreignField: "_id",
//           as: "carpenter",
//         },
//       },
//       {
//         $lookup: {
//           from: "architectuers",
//           localField: "architec",
//           foreignField: "_id",
//           as: "architecture",
//         },
//       },
//       {
//         $lookup: {
//           from: "salespeople",
//           localField: "sales",
//           foreignField: "_id",
//           as: "salesPersonDetails",
//         },
//       },
//       {
//         $lookup: {
//           from: "follows",
//           localField: "_id",
//           foreignField: "quatationId",
//           as: "followDetails",
//         },
//       },
//       {
//         $project: {
//           __v: 0,
//           "shop.__v": 0,
//           "carpenter.__v": 0,
//           "architecture.__v": 0,
//         },
//       },
//     ]);
//     res.status(200).json({
//       status: "Success",
//       message: "Fetch Successfully",
//       data: userData,
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "Fail",
//       message: error.message,
//     });
//   }
// };

exports.quotation_search = async function (req, res) {
  try {
    console.log("Sample search:", req.query);
    let matchField = {};

    // Search by serialNumber first
    if (req.query.serialNumber) {
      matchField = {
        $expr: {
          $regexMatch: {
            input: { $toString: "$serialNumber" },
            regex: req.query.serialNumber,
          },
        },
      };
    }

    // Search by userName
    if (req.query.userName) {
      matchField.userName = new RegExp(req.query.userName, "i");
    }

    // Check if serialNumber yields any results
    let userData = await user.aggregate([
      { $match: matchField },
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

    console.log(user.length)

    // If no results from serialNumber search, try searching by mobileNo
    if (req.query.mobileNo) {
      console.log("No data found with serialNumber, trying mobileNo...");

      // Update matchField to search by mobileNo if serialNumber returns no results
      if (req.query.mobileNo) {
          matchField = {
            mobileNo: parseInt(req.query.mobileNo),  // Ensure it's a number for comparison
          };

        // Perform the query again with mobileNo
        userData = await user.aggregate([
          { $match: matchField },
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
      }
    }

    // Return the results
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







