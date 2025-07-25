var architec = require("../model/architec.model");
var Quotation = require("../model/quotation.model");
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
        let status = "None";

        if (follow) {
          if (follow.Approve === true) {
            status = "Approve";
          } else if (follow.Reject === true) {
            status = "Reject";
          } else if (follow.followup === true) {
            status = "followup";
          }
        }
        console.log("status: ", status)

        console.log(`👤 User ${userData._id} status resolved to: ${status}`);
        return { ...userData, status };
      })
    );
    const filteredUsers =
      statusFilter && statusFilter !== "None"
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
exports.architeclist = async function (req, res, next) {
  try {
    const { filter, startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    console.log("Incoming Filter:", filter || "None");
    console.log("Date Range:", dateFilter);

    // Step 1: Build follow query
    const followQuery = {};
    if (filter && filter.toLowerCase() !== "none") {
      followQuery[filter] = true;
    }

    const follows = await followModel.find(followQuery).lean();

    console.log(`Follow Query: ${JSON.stringify(followQuery)}`);
    console.log(`Found ${follows.length} follow documents`);

    if (!follows.length) {
      return res.status(200).json({
        status: "Success",
        message: `No Follow documents matching the criteria`,
        count: 0,
        data: [],
      });
    }

    const userIds = follows.map(f => f.quatationId).filter(Boolean);
    console.log("User IDs from Follow:", userIds.map(id => id.toString()));

    // Step 2: Build user query with optional date range
    const userQuery = { _id: { $in: userIds } };
    if (Object.keys(dateFilter).length) {
      userQuery.Date = dateFilter;
    }

    console.log("User Query:", JSON.stringify(userQuery));

    const usersWithArchitects = await user
      .find(userQuery)
      .populate("architec")
      .lean();

    console.log("Users with Architects:", usersWithArchitects.length);

    // Step 3: Collect and deduplicate architects
    let architectList = [];
    usersWithArchitects.forEach(u => {
      if (u.architec && Array.isArray(u.architec)) {
        architectList.push(...u.architec);
      }
    });

    const uniqueArchitectMap = new Map();
    architectList.forEach(a => uniqueArchitectMap.set(a._id.toString(), a));

    const uniqueArchitects = Array.from(uniqueArchitectMap.values());

    console.log("Unique Architects Found:", uniqueArchitects.length);

    res.status(200).json({
      status: "Success",
      message: `Architects${filter && filter.toLowerCase() !== "none" ? ` with '${filter}' quotations` : ""}${Object.keys(dateFilter).length ? " within date range" : ""}`,
      count: uniqueArchitects.length,
      data: uniqueArchitects,
    });

  } catch (error) {
    console.error("❌ Error in architeclist:", error);
    res.status(500).json({
      status: "Fail",
      message: error.message,
    });
  }
};


