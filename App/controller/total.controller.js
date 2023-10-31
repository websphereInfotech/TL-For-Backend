const Total = require("../model/total.model");
const user = require("../model/quotation.model");


// totalCreate
exports.totalCreate = async (req, res) => {
  try {
    const dataToStore = req.body; // Assuming req.body is an array of data objects

    // Create multiple Total documents at once
   
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

// totalupdate
exports.totalupdate = async (req, res) => {
  try {
    const { description, area, size, rate, quantity, total } = req.body;
    const totalId = req.params.id;

    const updatedTotal = await Total.findByIdAndUpdate(totalId , {
          description,
          area,
          size,
          rate,
          quantity,
          total,
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

// totalView
exports.totalView = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch Total records for the specified user_id
    const totalRecords = await Total.find({ user_id: userId });

    res.status(200).json({
      status: "Success",
      message: "Total Records Retrieved Successfully",
      data: totalRecords,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

//totalDelete
exports.totalDelete = async (req, res) => {
  try {
    const totalId = req.params.id;

    // Find the Total record by _id and remove it
    const deletedTotal = await Total.findByIdAndRemove(totalId);

    res.status(200).json({
      status: 'Success',
      message: 'Total deleted successfully',
      data: { },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};




