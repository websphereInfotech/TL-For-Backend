const user = require("../model/user.model");

exports.AllFiles = async (req, res) => {
  const users = await user
    .find({ mobileNo: 7891191880 })
    .populate("sales")
    .populate("architec")
    .populate("carpenter")
    .populate("shop");
  console.log(users);
  res.render("convert", { users });
};
