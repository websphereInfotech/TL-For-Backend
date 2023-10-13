const Total = require("../model/total.model");

exports.totalCreate = async (req, res) => {
  try {
    const { user_id, description, area, size, rate, quantity, total } = req.body;

    const totalOfAll = await Total.create({
      user_id,
      description,
      area,
      size,
      rate,
      quantity,
      total,
    });
    await totalOfAll.save();

    res.status(200).json({
      status: "Success",
      message: "Total Create Successfully",
      data: totalOfAll,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
