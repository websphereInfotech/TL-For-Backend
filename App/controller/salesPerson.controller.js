const { types } = require("joi");
const salesPerson = require("../model/salesPerson.model");
const user = require("../model/user.model");
var jwt = require("jsonwebtoken");
const { Types, default: mongoose } = require("mongoose");

// SalesPersonCreate
exports.personCreate = async (req, res) => {
  try {
    const { Name, mobileNo } = req.body;

    const findMob = await salesPerson.findOne({ mobileNo });
    if (findMob) {
      return res.status(400).json({
        status: "Fail",
        message: "Mobile Number already exist",
      });
    }
    const sales = await salesPerson.create({
      Name,
      mobileNo,
    });
    await sales.save();

    const payload = {
      Name: Name,
      mobileNo: mobileNo,
    };
    let token = jwt.sign(payload, process.env.KEY, { expiresIn: "1d" });
    res.status(200).json({
      status: "Success",
      message: "SalesPerson Create Successfully",
      data: sales,
      token: token,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

// SalesPersonUpdate
exports.personUpdate = async (req, res) => {
  try {
    const { Name, mobileNo } = req.body;

    const findMob = await salesPerson.findOne({ mobileNo });
    if (findMob) {
      return res.status(400).json({
        status: "Fail",
        message: "Mobile Number already exist",
      });
    }

    const updatePerson = {
      Name,
      mobileNo,
    };
    const personData = await salesPerson.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: updatePerson },
      { new: true }
    );
    if (!personData) {
      return res.status(400).json({
        status: "Fail",
        message: "salesPerson not found",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "salesPerson Update Successfully",
      data: personData,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

// SalesPersonDelete
exports.PersonDelete = async (req, res) => {
  try {
    const personDataDelete = await salesPerson.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!personDataDelete) {
      return res.status(400).json({
        status: "Fail",
        message: "salesPerson not found",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "salesPerson delete successfully",
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: "Internal; Server Error",
    });
  }
};

// salesPersonView
exports.salesPersonView = async (req, res) => {
  try {
    const salesPersonData = await salesPerson.findById({ _id: req.params.id });
    if (!salesPersonData) {
      return res.status(400).json({
        status: "Fail",
        message: "user not found",
      });
    }
    res.status(201).json({
      status: "Success",
      message: "salesPeron Fetch Successfully",
      data: salesPersonData,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

// PersonListData
exports.salesPersonListData = async (req, res) => {
  try {
    const personList = await salesPerson.find();
    const personListData = await salesPerson.find();
    var Datacount = personListData.length;
    res.status(200).json({
      status: "Success",
      message: "get all data",
      count: Datacount,
      data: personList,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

// salesPersonList date wise
exports.salesPersonList = async (req, res) => {
  try {
    const id = req.params.id;
    // let matchField = {};

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    // if(startDate && endDate){
    //     matchField.$match = {
    //       "connectedUsers.Date": {
    //         $gte: startDate,
    //         $lte: endDate,
    //       },
    //     };
    // }
    // const dateMatch = {};
    // if (startDate && endDate) {
    //   dateMatch["connectedUsers.Date"] = {
    //     $gte: new Date(startDate),
    //     $lte: new Date(endDate),
    //   };
    // }

    // const usersConnectedToSales = await salesPerson.aggregate([
    //   {
    //     $match: {
    //       _id: new Types.ObjectId("6527d1f28301166df4bfc919"),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "_id",
    //       foreignField: "sales",
    //       as: "connectedUsers",
    //     },
    //   },
    //   {
    //     $unwind: "$connectedUsers",
    //   },
    //   {
    //     $match: dateMatch
    //   },
    //   // {
    //   //   $project: {
    //   //     __v: 0,
    //   //   },
    //   // },
    // ]);

    const pipeline = [];

    // Match stage to find the salesperson by ID
    pipeline.push({
      $match: {
        _id: new Types.ObjectId(id),
      },
    });

    // Lookup stage to get the salesperson details
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "sales",
        as: "connectedUsers",
      },
    });

    // Unwind the salesPersonDetails array
    // pipeline.push({
    //   $unwind: "$connectedUsers",
    // });

    if (startDate && endDate) {
      pipeline.push({
        $addFields: {
          connectedUsers: {
            $filter: {
              input: "$connectedUsers",
              as: "connectedUser",
              cond: {
                $and: [
                  { $gte: ["$$connectedUser.Date", startDate] },
                  { $lte: ["$$connectedUser.Date", endDate] },
                ],
              },
            },
          },
        },
      });
    }

    const usersConnectedToSales = await salesPerson.aggregate(pipeline) ;

    if (usersConnectedToSales.length === 0) {
      return res.status(404).json({
        status: "Fail",
        message: "No users connected to the SalesPerson",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "get all data",
      data: usersConnectedToSales,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

// salesPersonSearch
exports.salesPersonSearch = async (req, res) => {
  try {
    let matchField = {};

    if (req.query.SalesPersonName) {
      matchField.Name = new RegExp(req.query.SalesPersonName, "i");
    }

    const searchData = await salesPerson
      .aggregate([
        {
          $match: matchField,
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "sales",
            as: "user",
          },
        },
        {
          $project: {
            __v: 0,
            "SalesPersonData.__v": 0,
          },
        },
      ])
      .exec();

    if (!searchData || searchData.length === 0) {
      return res.status(404).json({
        status: "Fail",
        message: "Data not found",
      });
    }
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

// using id salesPersonListWithUser
exports.salesPersonListWithUser = async function (req, res) {
  try {
    const personId = req.params.id;

    const usersConnectedToPerson = await user.aggregate([
      {
        $match: {
          sales: new mongoose.Types.ObjectId(personId),
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
        },
      },
    ]);

    if (usersConnectedToPerson.length === 0) {
      return res.status(404).json({
        status: "Fail",
        message: "No users connected to the SalesPerson",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "get all data",
      data: usersConnectedToPerson,
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
