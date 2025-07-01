var architec = require("../model/architec.model");
const followModel = require("../model/follow.model");
const user = require("../model/quotation.model");
var jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { Types } = require("mongoose");


exports.architec_create = async function (req, res) {
  try {
    const { architecsName, mobileNo, address } = req.body;
    const architecmobilno = await architec.findOne({ mobileNo });
    if (architecmobilno) {
      return res.status(400).json({
        status: "Fail",
        message: "Mobile Number Already Exist",
      });
    }
    const architecData = await architec.create({
      architecsName: architecsName,
      mobileNo: mobileNo,
      address: address,
    });
    const payload = {
      id: architecData._id,
      architecsName: architecsName,
      mobileNo: mobileNo,
      address: address,
    };
    let token = jwt.sign(payload, process.env.KEY, { expiresIn: "1d" });

    res.status(200).json({
      status: "Success",
      message: " Architectures Create Successfully",
      data: architecData,
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
exports.architec_update = async function (req, res, next) {
  try {
    const { architecsName, mobileNo, address } = req.body;
    const updatearchitecdata = {
      architecsName: architecsName,
      mobileNo: mobileNo,
      address: address,
    };
    const architecdata = await architec.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: updatearchitecdata },
      { new: true }
    );
    if (!architecdata) {
      return res.status(400).json({
        status: "Fail",
        message: "user not found",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Architecture update Successfully",
      data: architecdata,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: "user not found",
    });
  }
};
//===============================================================DELETE DATA====================================================================
exports.architec_delete = async function (req, res) {
  try {
    const architecdatadelete = await architec.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!architecdatadelete) {
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
exports.architec_viewdata = async function (req, res) {
  try {
    const architecviewdata = await architec.findById({ _id: req.params.id });
    if (!architecviewdata) {
      return res.status(401).json({
        status: "Fail",
        message: "architec not found",
      });
    }
    res.status(200).json({
      status: "Sucess",
      message: "Architecture Fetch Sucessfully",
      data: architecviewdata,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: "something went wrong",
    });
  }
};
//========================================================================LIST DATA=========================================================

exports.architec_listdata = async function (req, res) {
  try {
    const architecherId = req.params.id;
    const statusFilter = req.query.status;
    const { startDate, endDate } = req.query;

    console.log(`📥 Request received for architecherId: ${architecherId}`);
    console.log(`🔎 Filters - Status: ${statusFilter}, StartDate: ${startDate}, EndDate: ${endDate}`);

    // Build match condition
    const matchConditions = {
      architec: new mongoose.Types.ObjectId(architecherId),
    };

    // Add date range filter if both dates are provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const adjustedEnd = new Date(endDate);
      adjustedEnd.setDate(adjustedEnd.getDate() + 1); // include full end date

      matchConditions.Date = { // ✅ Use correct field from your DB
        $gte: start,
        $lt: adjustedEnd,
      };

      console.log(`📆 Date filtering applied on 'Date' field: ${JSON.stringify(matchConditions.Date)}`);
    }

    console.log('⚙️ Aggregating users...');
    const usersConnectedToarchitecher = await user.aggregate([
      { $match: matchConditions },
      {
        $lookup: {
          from: "architectuers",
          localField: "architec",
          foreignField: "_id",
          as: "architecDetails",
        },
      },
      {
        $project: { __v: 0 },
      },
    ]);

    console.log(`🔍 Found ${usersConnectedToarchitecher.length} users`);

    if (usersConnectedToarchitecher.length === 0) {
      console.warn("❗ No users connected to the architecher.");
      return res.status(404).json({
        status: "Fail",
        message: "No users connected to the architecher",
      });
    }

    const usersWithStatus = await Promise.all(
      usersConnectedToarchitecher.map(async (userData) => {
        const follow = await followModel.findOne({ quatationId: userData._id });
        let status = "Follow Up";

        if (follow) {
          if (follow.Approve) {
            status = "Approve";
          } else if (follow.Reject) {
            status = "Reject";
          }
        }

        console.log(`👤 User ${userData._id} status resolved to: ${status}`);
        return { ...userData, status };
      })
    );

    const filteredUsers = statusFilter
      ? usersWithStatus.filter((u) => u.status === statusFilter)
      : usersWithStatus;

    console.log(`✅ Final user count after status filtering: ${filteredUsers.length}`);

    res.status(200).json({
      status: "Success",
      message: "get all data",
      data: filteredUsers,
    });
  } catch (error) {
    console.error("🔥 Error in architec_listdata:", error.message);
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

//================================================================SEARCH DATA===================================================================
exports.architecdetails_searchdata = async function (req, res) {
  try {
    let matchField = {};

    if (req.query.architecName) {
      matchField.architecsName = new RegExp(req.query.architecName, "i");
    }

    if (req.query.serialNumber) {
      matchField.serialNumber = parseInt(req.query.serialNumber);
    }

    const searchData = await architec
      .aggregate([
        {
          $match: matchField,
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "architec",
            as: "architectureData",
          },
        },
        {
          $project: {
            __v: 0,
            "architectureData.__v": 0,
          },
        },
      ])
      .exec();

    // if (!searchData || searchData.length === 0) {
    //   return res.status(404).json({
    //     status: "Fail",
    //     message: "Data not found",
    //   });
    // }
    res.status(200).json({
      status: "Success",
      message: "Architecture fetch successfully",
      data: searchData,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
//========================================================================list=========================================================
exports.architeclist = async function (req, res, next) {
  try {
    const architecturelist = await architec.find();
    dataCount = architecturelist.length;

    res.status(200).json({
      status: "Success",
      message: "get all data",
      count: dataCount,
      data: architecturelist,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
