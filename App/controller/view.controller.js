const user = require("../model/user.model");
const ejs = require("ejs");
const pdf = require("html-pdf");
const Total = require("../model/total.model");
const path = require("path");
const Follow = require("../model/follow.model");
exports.AllFiles = async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const users = await user
    .findById(id)
    .populate("sales")
    .populate("architec")
    .populate("carpenter")
    .populate("shop");

  // console.log(users);
  const Totalwithuser = await Total.find({ user_id: id });

  const status = await Follow.findOne({ quatationId: id });
  // console.log(status);
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
    path.join(__dirname, "../views/convert1.ejs"),
    { users, Totalwithuser, status }
  );
  // console.log(html)
  const pdf1 = pdf.create(html).toBuffer((err, buffer) => {
    // console.log(buffer)
    const base64String = buffer.toString("base64");
    // console.log(base64String)
    return res.status(200).json({
      status: "Success",
      message: "pdf create successFully",
      data: base64String,
    });
  });
};
