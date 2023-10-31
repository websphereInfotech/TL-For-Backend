const user = require("../model/quotation.model");
const excelJs = require("exceljs");
const ejs = require("ejs");
const pdf = require("html-pdf");
const Total = require("../model/total.model");
const Sales = require('../model/salesPerson.model')
const path = require("path");
const Follow = require("../model/follow.model");
const { Types, default: mongoose } = require("mongoose");

exports.AllFiles = async (req, res) => {
  try {
    const id = req.params.id;

    const users = await user
      .findById(id)
      .populate("sales")
      .populate("architec")
      .populate("carpenter")
      .populate("shop");

    const Totalwithuser = await Total.find({ user_id: id });

    const status = await Follow.findOne({ quatationId: id });

    if (!users) {
      return res.status(404).json({
        status: "Fail",
        message: "Quatation not found",
      });
    }
    // console.log(users);
    // res.render(path.join(__dirname, "../views/convert.ejs"), {
    //   users,
    //   Totalwithuser,
    //   status,
    // });
    // let base64 = "";
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/pdf.ejs"),
      { users, Totalwithuser, status }
    );
    const pdf1 = pdf.create(html).toBuffer((err, buffer) => {
      const base64String = buffer.toString("base64");
      return res.status(200).json({
        status: "Success",
        message: "pdf create successFully",
        data: base64String,
      });
    });
  } catch (error) {
    console.error("Error creating Pdf Download:", error);
    res.status(500).json({ status: "Fail", message: "Internal Server Error" });
  }
};

exports.createExcel = async (req, res) => {
  try {
    const id = req.params.id;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(0);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    const matchField  = {}
    
    if (req.query.startDate || req.query.endDate) {
      matchField.$and = [
        { "connectedUsers.Date": { $gte: startDate } },
        { "connectedUsers.Date": { $lte: endDate } },
      ];
    }

    const usersConnectedToSales = await Sales.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "sales",
          as: "connectedUsers",
        },
      },
      {
        $unwind: "$connectedUsers",
      },
      {
        $match: matchField,
      },
      {
        $group: {
          _id: "$_id",
          userName: { $first: "$Name" },
          mobileNo: { $first: "$mobileNo" },
          connectedUsers: { $push: "$connectedUsers" },
        },
      },
    ]);

    // Create a new Excel workbook and worksheet
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Quotation Data");

    // Define the Excel headers based on your data structure
    worksheet.columns = [
      // { header: "sr_No", key: "serial_No" },
      { header: "TokenNo", key: "serialNumber" },
      { header: "Name", key: "userName" },
      { header: "MobileNo", key: "mobileNo" },
      { header: "Address", key: "address" },
      { header: "Date", key: "Date" },
      { header: "Description", key: "description" },
      { header: "Area", key: "area" },
      { header: "Size", key: "size" },
      { header: "Rate", key: "rate" },
      { header: "Quantity", key: "quantity" },
      { header: "Total", key: "total" },
    ];
    // worksheet.addRow(headers);
    // console.log(">>>>>>>>>>",Sales.Name);
    usersConnectedToSales.forEach((user) => {
      user.connectedUsers.forEach((cUser) => {
        const rowData = {
          serialNumber: cUser.serialNumber,
          userName: cUser.userName,
          mobileNo: cUser.mobileNo,
          address: cUser.address,
          Date: cUser.Date,
          // Description:cUser.description
        };
        console.log("rowData:", rowData);
        worksheet.addRow(rowData);
        // console.log("????",rowData);
      });
    });

    // Set content disposition for the response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=quotation_data.xlsx"
    );

    // Generate the Excel file and send it as a response
    const buffer = await workbook.xlsx.writeBuffer();
    res.end(buffer);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};


// exports.createExcel = async (req, res) => {
//   try {
//     const startDate = req.query.startDate;
//     const endDate = req.query.endDate;

//     const query = {};

//     if (startDate && endDate) {
//       query.Date = { $gte: startDate, $lte: endDate };
//     }

//     const users = await user
//       .find(query)
//       .populate("sales")
//       .populate("architec")
//       .populate("carpenter")
//       .populate("shop");
//     // console.log(users);
//     const workbook = new excelJs.Workbook();
//     const worksheet = workbook.addWorksheet("My Quotation");

//     // Define worksheet columns based on the fields from the "Total" model
//     worksheet.columns = [
//       { header: "TokenNo", key: "serialNumber" },
//       { header: "Name", key: "userName" },
//       { header: "MobileNo", key: "mobileNo" },
//       { header: "Address", key: "address" },
//       { header: "Date", key: "Date" },
//       { header: "SalesName", key: "sales.Name" },
//       { header: "CarpenterName", key: "carpenter.carpentersName" },
//       { header: "ShopName", key: "shop.shopName" },
//       { header: "ArchitectName", key: "architec.architecsName" },
//       { header: "Description", key: "description" },
//       { header: "Area", key: "area" },
//       { header: "Size", key: "size" },
//       { header: "Rate", key: "rate" },
//       { header: "Quantity", key: "quantity" },
//       { header: "Total", key: "total" },
//     ];

//     const userTotalData = {};

//     const totalData = await Total.find({
//       user_id: { $in: users.map((user) => user._id) },
//     });
//     totalData.forEach((total) => {
//       if (!userTotalData[total.user_id]) {
//         userTotalData[total.user_id] = [];
//       }
//       userTotalData[total.user_id].push(total);
//     });

//     users.forEach((user, index) => {
//       user.serial_No = index + 1;

//       // Add the user's data to the row
//       const userRow = { ...user._doc };
//       worksheet.addRow(userRow);

//       const userTotals = userTotalData[user._id] || [];
//       let userTotalSum = 0;

//       userTotals.forEach((total) => {
//         // Add the "Total" data as separate rows within the user's row
//         const totalRow = { ...total._doc };
//         worksheet.addRow(totalRow);
//         // Calculate the sum of "Total" values for this user
//         userTotalSum += total.total;
//       });

//       // Add a new row for the total sum within the user's section
//       worksheet.addRow({ TotalOfQuotation: userTotalSum }); // Customize the column name as needed
//     });

//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader("Content-Disposition", "attachment; filename=Quotation.xlsx");

//     workbook.xlsx.write(res).then(() => {
//       res.status(200).end();
//     });
//   } catch (error) {
//     console.error("Error creating Excel Sheet Download:", error);
//     res.status(500).json({ status: "Fail", message: "Internal Server Error" });
//   }
// };

// exports.createExcel = async (req, res) => {
//   try {
//     const startDate = req.query.startDate;
//     const endDate = req.query.endDate;

//     const query = {};

//     if (startDate && endDate) {
//       query.Date = { $gte: startDate, $lte: endDate };
//     }

//     const users = await user
//       .find(query)
//       .populate("sales")
//       .populate("architec")
//       .populate("carpenter")
//       .populate("shop");
//     console.log(users);
//     const workbook = new excelJs.Workbook();
//     const worksheet = workbook.addWorksheet("My Quotation");

//     // Define worksheet columns based on the fields from the "Total" model
//     worksheet.columns = [
//       { header: "TokenNo", key: "serialNumber" },
//       { header: "Name", key: "userName" },
//       { header: "MobileNo", key: "mobileNo" },
//       { header: "Address", key: "address" },
//       { header: "Date", key: "Date" },
//       { header: "SalesName", key: "sales.Name" },
//       { header: "CarpenterName", key: "carpenter.carpentersName" },
//       { header: "ShopName", key: "shop.shopName" },
//       { header: "ArchitectName", key: "architec.architecsName" },
//       { header: "Description", key: "description" },
//       { header: "Area", key: "area" },
//       { header: "Size", key: "size" },
//       { header: "Rate", key: "rate" },
//       { header: "Quantity", key: "quantity" },
//       { header: "Total", key: "total" },
//     ];

//     const userTotalData = {};

//     const totalData = await Total.find({
//       user_id: { $in: users.map((user) => user._id) },
//     });

//     totalData.forEach((total) => {
//       if (!userTotalData[total.user_id]) {
//         userTotalData[total.user_id] = [];
//       }
//       userTotalData[total.user_id].push(total);
//     });

//     // Add the user's data to the row
//     users.forEach((user, index) => {
//       user.serial_No = index + 1;

//       const userRow = { ...user._doc };
//       worksheet.addRow(userRow);

//       const userTotals = userTotalData[user._id] || [];
//       let userTotalSum = 0;

//       // Add the "Total" data as separate rows within the user's row
//       userTotals.forEach((total) => {
//         const totalRow = { ...total._doc };
//         worksheet.addRow(totalRow);

//         // Calculate the sum of "Total" values for this user
//         userTotalSum += total.total;
//       });

//       // Add a new row for the total sum within the user's section
//       worksheet.addRow({ total: userTotalSum }); // Customize the column name as needed
//     });

//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader("Content-Disposition", "attachment; filename=Quotation.xlsx");

//     workbook.xlsx.write(res).then(() => {
//       res.status(200).end();
//     });
//   } catch (error) {
//     console.error("Error creating Excel Sheet Download:", error);
//     res.status(500).json({ status: "Fail", message: "Internal Server Error" });
//   }
// };

// exports.createExcel = async (req, res) => {
//   try {
//     const startDate = req.query.startDate;
//     const endDate = req.query.endDate;

//     const query = {};

//     if (startDate && endDate) {
//       query.Date = { $gte: startDate, $lte: endDate };
//     }

//     const users = await user
//       .find(query)
//       .populate("sales")
//       .populate("architec")
//       .populate("carpenter")
//       .populate("shop");

//     const workbook = new excelJs.Workbook();
//     const worksheet = workbook.addWorksheet("My Users");

//
//     worksheet.columns = [
//       // { header: "sr_No", key: "serial_No" },
//       { header: "TokenNo", key: "serialNumber" },
//       { header: "Name", key: "userName" },
//       { header: "MobileNo", key: "mobileNo" },
//       { header: "Address", key: "address" },
//       { header: "Date", key: "Date" },
//       { header: "Description", key: "description" },
//       { header: "Area", key: "area" },
//       { header: "Size", key: "size" },
//       { header: "Rate", key: "rate" },
//       { header: "Quantity", key: "quantity" },
//       { header: "Total", key: "total" },
//     ];
//     const userTotalData = {};

//     const totalData = await Total.find({
//       user_id: { $in: users.map((user) => user._id) },
//     });
//     totalData.forEach((total) => {
//       if (!userTotalData[total.user_id]) {
//         userTotalData[total.user_id] = [];
//       }
//       userTotalData[total.user_id].push(total);
//     });

//     users.forEach((user, index) => {
//       user.serial_No = index + 1;

//       // Add the user's data to the row
//       const userRow = { ...user._doc };
//       worksheet.addRow(userRow);

//       const userTotals = userTotalData[user._id] || [];

//       userTotals.forEach((total) => {
//         // Add the "Total" data as separate rows within the user's row
//         const totalRow = { ...total._doc };
//         // totalRow.serial_No = index + 1;
//         worksheet.addRow(totalRow);
//       });
//     });

//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader("Content-Disposition", "attachment; filename=Quotation.xlsx");

//     workbook.xlsx.write(res).then(() => {
//       res.status(200).end();
//     });
//   } catch (error) {
//     console.error("Error creating Excel Sheet Download:", error);
//     res.status(500).json({ status: "Fail", message: "Internal Server Error" });
//   }
// };

// exports.createExcel = async (req, res) => {
//   try {
//     const startDate = req.query.startDate;
//     const endDate = req.query.endDate;

//     const query = {};

//     if (startDate && endDate) {
//       query.Date = { $gte: startDate, $lte: endDate };
//     }

//     const users = await user
//       .find(query)
//       .populate("sales")
//       .populate("architec")
//       .populate("carpenter")
//       .populate("shop");

//     const workbook = new excelJs.Workbook();
//     const worksheet = workbook.addWorksheet("My Users");

//
//     worksheet.columns = [
//       { header: "sr_No", key: "serial_No" },
//       { header: "TokenNo", key: "serialNumber" },
//       { header: "Name", key: "userName" },
//       { header: "MobileNo", key: "mobileNo" },
//       { header: "Address", key: "address" },
//       { header: "Date", key: "Date" },
//       { header: "Description", key: "description" },
//       { header: "Area", key: "area" },
//       { header: "Size", key: "size" },
//       { header: "Rate", key: "rate" },
//       { header: "Quantity", key: "quantity" },
//       { header: "Total", key: "total" },
//     ];

//     const userTotalData = {};

//     const totalData = await Total.find({
//       user_id: { $in: users.map((user) => user._id) },
//     });
//     totalData.forEach((total) => {
//       if (!userTotalData[total.user_id]) {
//         userTotalData[total.user_id] = [];
//       }
//       userTotalData[total.user_id].push(total);
//     });

//     users.forEach((user, index) => {
//       user.serial_No = index + 1;

//       const userTotals = userTotalData[user._id] || [];

//       userTotals.forEach((total) => {
//         const row = { ...user._doc, ...total._doc };
//         row.serial_No = index + 1;
//         worksheet.addRow(row);
//       });
//     });

//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader("Content-Disposition", "attachment; filename=Quotation.xlsx");

//     workbook.xlsx.write(res).then(() => {
//       res.status(200).end();
//     });
//   } catch (error) {
//     console.error("Error creating Excel Sheet Download:", error);
//     res.status(500).json({ status: "Fail", message: "Internal Server Error" });
//   }
// };

// exports.createExcel = async (req, res) => {
//   try {
//     const startDate = req.query.startDate;
//     const endDate = req.query.endDate;

//     const query = {};

//     if (startDate && endDate) {
//       query.Date = { $gte: startDate, $lte: endDate };
//     }

//     const users = await user
//       .find(query)
//       .populate("sales")
//       .populate("architec")
//       .populate("carpenter")
//       .populate("shop");

//     const workbook = new excelJs.Workbook();
//     const worksheet = workbook.addWorksheet("My Users");

//     worksheet.columns = [
//       { header: "sr_No", key: "serial_No" },
//       { header: "TokenNo", key: "serialNumber" },
//       { header: "Name", key: "userName" },
//       { header: "MobileNo", key: "mobileNo" },
//       { header: "Address", key: "address" },
//       { header: "Date", key: "Date" },
//       { header: "Description", key: "description" },
//       { header: "Area", key: "area" },
//       { header: "Size", key: "size" },
//       { header: "Rate", key: "rate" },
//       { header: "Quantity", key: "quantity" },
//       { header: "Total", key: "total" },
//     ];

//     const totalData = await Total.find({ user_id: user._id });

//     users.forEach((user, index) => {
//       user.serial_No = index + 1;

//       worksheet.addRow(user);

//       totalData.forEach((total) => {

//         const totalRow = { ...user._doc, ...total._doc };
//         totalRow.serial_No = index + 1;
//         worksheet.addRow(totalRow);
//       });
//     });

//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader("Content-Disposition", "attachment; filename=Quotation.xlsx");

//     workbook.xlsx.write(res).then(() => {
//       res.status(200).end();
//     });
//   } catch (error) {
//     console.error("Error creating Excel Sheet Download:", error);
//     res.status(500).json({ status: "Fail", message: "Internal Server Error" });
//   }
// };
