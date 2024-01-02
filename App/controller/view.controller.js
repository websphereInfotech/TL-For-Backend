const user = require("../model/quotation.model");
const excelJs = require("exceljs");
const ejs = require("ejs");
const pdf = require("html-pdf");
const puppeteer = require("puppeteer");
const Total = require("../model/total.model");
const Sales = require("../model/salesPerson.model");
const path = require("path");
const Follow = require("../model/follow.model");
const { Types, default: mongoose } = require("mongoose");
const os = require("os");

exports.AllFiles = async (req, res) => {
  try {
    console.log("*********");
    const id = req.params.id;
    console.log("id", id);
    const users = await user
      .findById(id)
      .populate("sales")
      .populate("architec")
      .populate("carpenter")
      .populate("shop");

    const Totalwithuser = await Total.find({ user_id: id });
    const status = await Follow.findOne({ quatationId: id });
    console.log("total", Totalwithuser);
    console.log("status", status);
    console.log("user", user);

    if (!users) {
      return res.status(404).json({
        status: "Fail",
        message: "Quatation not found",
      });
    }

    const html = await ejs.renderFile(
      path.join(__dirname, "../views/pdf.ejs"),
      { users, Totalwithuser, status }
    );
    console.log("html", html);

    const osPlatform = os.platform(); 
    console.log("Scraper running on platform: ", osPlatform);
    let executablePath;
    if (/^win/i.test(osPlatform)) {
      executablePath = "";
    } else if (/^linux/i.test(osPlatform)) {
      executablePath = '/usr/bin/chromium-browser'
    } 
    console.log("Executable Path:", executablePath);

    const browser = await puppeteer.launch({
      executablePath,
      slowMo: undefined,
      args: ['-no-sandbox']
    });
    console.log("Browser launched successfully");

    const page = await browser.newPage();
    await page.setContent(html);

    const pdfBuffer = await page.pdf();
    await browser.close();

    const base64String = pdfBuffer.toString("base64");
    return res.status(200).json({
      status: "Success",
      message: "PDF created successfully",
      data: base64String,
    });
  } catch (error) {
    console.error("Error creating Pdf Download:", error);
    res.status(500).json({ status: "Fail", message: "Internal Server Error" });
  }
};

// exports.AllFiles = async (req, res) => {
//   try {
//     console.log("*********");
//     const id = req.params.id;
//     console.log("id",id);
//     const users = await user
//       .findById(id)
//       .populate("sales")
//       .populate("architec")
//       .populate("carpenter")
//       .populate("shop");

//     const Totalwithuser = await Total.find({ user_id: id });
//         const status = await Follow.findOne({ quatationId: id });
// console.log("total",Totalwithuser);
// console.log("status",status);
// console.log("user",user);
//     if (!users) {
//       return res.status(404).json({
//         status: "Fail",
//         message: "Quatation not found",
//       });
//     }
//     // console.log(users);
//     // res.render(path.join(__dirname, "../views/convert.ejs"), {
//     //   users,
//     //   Totalwithuser,
//     //   status,
//     // });
//     // let base64 = "";
//     const html = await ejs.renderFile(
//       path.join(__dirname, "../views/pdf.ejs"),
//       { users, Totalwithuser, status }
//     );
//     const pdf1 = pdf.create(html).toBuffer((err, buffer) => {
//        if (err) {
//     console.error("Error creating PDF buffer:", err);
//     return res.status(500).json({
//       status: "Fail",
//       message: "Error creating PDF buffer",
//     });
//   }
//       const base64String = buffer.toString("base64");
//       return res.status(200).json({
//         status: "Success",
//         message: "pdf create successFully",
//         data: base64String,
//       });
//     });
//   } catch (error) {
//     console.error("Error creating Pdf Download:", error);
//     res.status(500).json({ status: "Fail", message: "Internal Server Error" });
//   }
// };

exports.createExcel = async (req, res) => {
  try {
    const id = req.params.id;
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(0);
    const endDate = req.query.endDate
      ? new Date(req.query.endDate)
      : new Date();

    const matchField = {};

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
        $lookup: {
          from: "shops",
          localField: "connectedUsers.shop",
          foreignField: "_id",
          as: "connectedUsers.shop",
        },
      },
      {
        $lookup: {
          from: "carpenters",
          localField: "connectedUsers.carpenter",
          foreignField: "_id",
          as: "connectedUsers.carpenter",
        },
      },
      {
        $lookup: {
          from: "architectuers",
          localField: "connectedUsers.architec",
          foreignField: "_id",
          as: "connectedUsers.architec",
        },
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
      {
        $lookup: {
          from: "totals",
          localField: "connectedUsers._id",
          foreignField: "user_id",
          as: "totalData",
        },
      },
    ]);

    // Create a new Excel workbook and worksheet
    const excelJs = require("exceljs");
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Quotation Data");

    // Define the Excel headers based on your data structure
    worksheet.columns = [
      { header: "TokenNo", key: "serialNumber" },
      { header: "Name", key: "userName" },
      { header: "MobileNo", key: "mobileNo" },
      { header: "Address", key: "address" },
      { header: "Date", key: "Date" },
      { header: "carpenter", key: "carpenter" },
      { header: "architec", key: "architec" },
      { header: "shop", key: "shop" },
      { header: "Description", key: "description" },
      { header: "Area", key: "area" },
      { header: "Size", key: "size" },
      { header: "Rate", key: "rate" },
      { header: "Quantity", key: "quantity" },
      { header: "Total", key: "total" },
    ];
    worksheet.columns.forEach((column) => {
      column.alignment = { horizontal: "center" };
      column.width = 15;
    });

    usersConnectedToSales.forEach((user) => {
      user.connectedUsers.forEach((cUser) => {
        const totalData = user.totalData.filter((data) =>
          data.user_id.equals(cUser._id)
        );

        const carpenterName = cUser.carpenter.map(
          (carpenter) => carpenter.carpentersName
        );
        const architecName = cUser.architec.map(
          (architec) => architec.architecsName
        );
        const shopName = cUser.shop.map((shop) => shop.shopName);

        console.log("????????????????????????", architecName);

        const data = {
          serialNumber: cUser.serialNumber,
          userName: cUser.userName,
          mobileNo: cUser.mobileNo,
          address: cUser.address,
          Date: cUser.Date,
          carpenter: carpenterName.join(", "), // Set each carpenter's name in a separate column
          architec: architecName.join(", "), // Set each architec's name in a separate column
          shop: shopName.join(", "),
        };
        worksheet.addRow(data);

        // carpenterName.forEach((carpenterName) => {
        //   const data = {
        //     carpenter: carpenterName, // Set each carpenter's name in a separate row
        //   };
        //   worksheet.addRow(data);
        // });
        // architecName.forEach((architecName) => {
        //   const data = {
        //     architec: architecName,
        //   };
        //   worksheet.addRow(data);
        // });
        // shopName.forEach((shopName) => {
        //   const data = {
        //     shop: shopName,
        //   };
        //   worksheet.addRow(data);
        // });
        totalData.forEach((data) => {
          const rowData = {
            description: data.description,
            area: data.area,
            size: data.size,
            rate: data.rate,
            quantity: data.quantity,
            total: data.total,
          };
          worksheet.addRow(rowData);
        });
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
