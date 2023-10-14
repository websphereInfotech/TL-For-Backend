const Total = require("../model/total.model");
const user = require("../model/user.model");

exports.totalCreate = async (req, res) => {
  try {
    const { user_id, description, area, size, rate, quantity, total } =
      req.body;

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

// updateTotal
exports.totalupdate = async (req, res) => {
  try {
    const { description, area, size, rate, quantity, total } = req.body;
    const userId = req.params.id;
    console.log(userId);
    const updatedTotal = await Total.findOneAndUpdate(
      { user_id: userId },
      {
        $set: {
          description,
          area,
          size,
          rate,
          quantity,
          total,
        },
      },
      { new: true }
    );

    if (!updatedTotal) {
      return res.status(404).json({
        status: "fail",
        message: "Total not found",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Total updated successfully",
      data: updatedTotal,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
