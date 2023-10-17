const Follow = require("../model/follow.model");

exports.approve = async (req, res) => {
  try {
    const quatationId = req.params.id;

    const quation = await Follow.findOne({quatationId});

    if (!quation) {
      return res
        .status(403)
        .json({ status: "Fail", message: "quatationId not found" });
    }

    const existingQutation = await Follow.findOneAndUpdate(
      { quatationId: quatationId, followup: true },
      { $set: { followup: false, Approve: true, Reject: false }},
      { new:true }
    );

    if (!existingQutation) {
      return res.status(403).json({
        status: "Fail",
        message: "permission not update ",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "permission update Successfully",
      data: existingQutation,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};


exports.Reject = async (req, res) => {
  try {
    const quatationId = req.params.id;

    const quation = await Follow.findOne({ quatationId });

    if (!quation) {
      return res
        .status(403)
        .json({ status: "Fail", message: "quatationId not found" });
    }

    const existingQutation = await Follow.findOneAndUpdate(
      { quatationId: quatationId, followup: true },
      { $set: { followup: false, Approve: false, Reject: true } },
      { new: true }
    );

    if (!existingQutation) {
      return res.status(403).json({
        status: "Fail",
        message: "permission not update ",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "permission update Successfully",
      data: existingQutation,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
