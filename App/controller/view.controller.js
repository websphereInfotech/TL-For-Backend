const user = require("../model/user.model");

exports.AllFiles = async (req, res) => {
  const users = await user.find({});
  console.log(users);
  res.render("convert", { users });
};
