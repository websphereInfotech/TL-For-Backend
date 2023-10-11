const salesPerson = require("../model/salesPerson.model");
const user = require("../model/user.model");
var jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

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

// salesPersonList
exports.salesPersonList = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    
    console.log(startDate, endDate, ">>>>>>>>>>>");
    const usersConnectedToSales = await user.aggregate([
      {
        $match: {
          startDate: {
            $gte: new Date("05-01-2023"),
          },
          endDate: {
            $lte: new Date("12-08-2023"),
          },
        },
      },
      {
        $lookup: {
          from: "SalesPerson",
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
    console.log(usersConnectedToSales);
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
    const nameField = req.query.SalesPersonName;

    const salesData = await salesPerson.find({
      Name: { $regex: nameField, $options: "i" },
    });
    if (!salesData) {
      return res.status(404).json({
        status: "Fail",
        message: "SalesPerson not found",
      });
    }

    const searchData = await user
      .aggregate([
        {
          $match: { sales: salesData._id },
        },
        {
          $lookup: {
            from: "SalesPerson",
            localField: "sales",
            foreignField: "_id",
            as: "SalesPersonData",
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
