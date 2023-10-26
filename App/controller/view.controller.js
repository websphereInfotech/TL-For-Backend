const user = require("../model/user.model");
const excelJs = require("exceljs");
const ejs = require("ejs");
const pdf = require("html-pdf");
const Total = require("../model/total.model");
const path = require("path");
const Follow = require("../model/follow.model");
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

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;    

    const users = await user
      .find({Date: { $gte: startDate, $lte: endDate }})
      .populate("sales")
      .populate("architec")
      .populate("carpenter")
      .populate("shop");
    // console.log(users);

    // const Totalwithuser = await Total.find({});

    // const status = await Follow.findOne({});

    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("My Users");

    worksheet.columns = [
      { header: "sr_No", key: "serial_No" },
      { header: "TokenNo", key: "serialNumber" },
      { header: "Name", key: "userName" },
      { header: "MobileNo", key: "mobileNo" },
      { header: "Address", key: "address" },
      { header: "Date", key: "Date" },
    ];

    users.forEach((user, index) => {
      user.serial_No = index + 1;
      worksheet.addRow(user);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=Quotation.xlsx");

    workbook.xlsx.write(res).then(() => {
      res.status(200);
    });
  } catch (error) {
    console.error("Error creating Excel Sheet Download:", error);
    res.status(500).json({ status: "Fail", message: "Internal Server Error" });
  }
};
